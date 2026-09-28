// One WACCA song for any number of playfield views: loads the chart, owns the session
// (clock, judging, bot) and the one frame loop that steps it and draws the views.
// Views are WaccaPlayfieldCanvas, controls are WaccaPlayfieldControls, both take what this returns
//
//   chartUrl: getter for the MER chart to play, fetched from public/
//   options: getter for profile options by id (mirror and judgement timing matter here)
//   features: getter for { autoplay, judging, botSkill }, see PlayfieldSession.setFeatures
//   startPaused: start paused instead of playing right away
import PlayfieldSession from "~/assets/wacca/playfield/PlayfieldSession.js";

// Playback speed, for looking at things in slow motion
const SPEEDS = [0.1, 0.5, 1, 2];
// Scrubbing glides after the bar: this long (ms) to cover about two thirds of the way,
// the same at any frame rate
const SCRUB_GLIDE_MS = 90;

export function usePlayfieldSession({
  chartUrl = () => null,
  options = () => ({}),
  features = () => ({}),
  startPaused = false
} = {}) {
  const session = new PlayfieldSession();

  // Start paused when asked to, or for reduced motion
  const paused = ref(
    startPaused ||
      (typeof window !== "undefined" &&
        window.matchMedia?.("(prefers-reduced-motion: reduce)").matches)
  );
  // Someone clicked in and is playing instead of the bot
  const playing = ref(false);
  const speed = ref(1);
  // Scrub bar: where in the song we are
  const position = ref(0);
  const songLength = ref(session.songLength);

  // A chart is being fetched, and why the last one failed if it did
  const loading = ref(false);
  const loadError = ref(null);

  // Views registered by WaccaPlayfieldCanvas: { canDraw(), draw(dt) }
  const views = new Set();
  let frame = null;
  let lastFrameTime = null;
  let active = true;
  let scrubbing = false;
  let scrubTarget = 0;

  function drawViews(dt) {
    for (const view of views) if (view.canDraw()) view.draw(dt);
  }

  function tick(now) {
    frame = requestAnimationFrame(tick);

    const dt = lastFrameTime === null ? 0 : now - lastFrameTime;
    lastFrameTime = now;

    if (scrubbing) {
      // Glide towards where the scrub bar is instead of jumping there
      const current = session.songTime;
      const glide = 1 - Math.exp(-dt / SCRUB_GLIDE_MS);
      const next =
        Math.abs(scrubTarget - current) < 5
          ? scrubTarget
          : current + (scrubTarget - current) * glide;
      session.seek(next);
      session.step(0);
    } else {
      session.step(dt * speed.value);
    }
    drawViews(dt);
    playing.value = session.playing;
    // The bar follows the drag, not the gliding preview
    if (!scrubbing) updatePosition();
  }

  // Draw where the song is now without moving it, for pauses, seeks and option changes
  function redraw() {
    session.step(0);
    drawViews(0);
    updatePosition();
  }

  // Runs while any view is on screen, unless paused. Call it when anything that affects that changes
  function updateLoop() {
    const canDraw = active && [...views].some((view) => view.canDraw());
    const shouldRun = canDraw && (!paused.value || scrubbing);

    if (shouldRun && frame === null) {
      lastFrameTime = null;
      frame = requestAnimationFrame(tick);
    } else if (!shouldRun && frame !== null) {
      cancelAnimationFrame(frame);
      frame = null;
    }

    // Paused: still redraw so option changes show
    if (canDraw && !shouldRun) redraw();
  }

  function addView(view) {
    views.add(view);
    updateLoop();
    return () => {
      views.delete(view);
      updateLoop();
    };
  }

  function togglePause() {
    paused.value = !paused.value;
    updateLoop();
  }

  function play() {
    if (paused.value) togglePause();
  }

  // About every 0.1s is plenty for the bar, no need to update it every frame
  function updatePosition() {
    const time = session.songTime;
    if (Math.abs(time - position.value) >= 100) position.value = time;
  }

  // Dragging holds the song where the bar is (gliding there), letting go picks up again
  function scrubStart() {
    scrubTarget = session.songTime;
    scrubbing = true;
    session.scrubbing = true;
    updateLoop();
  }

  function scrub(time) {
    position.value = time;
    scrubTarget = time;
    // Clicks without a drag jump straight there
    if (!scrubbing) {
      session.seek(time);
      redraw();
    }
  }

  function scrubEnd() {
    scrubbing = false;
    session.scrubbing = false;
    session.seek(scrubTarget);
    updateLoop();
  }

  watch(speed, (value) => {
    session.playbackRate = value;
  });

  // Charts load on request, only the latest one counts if it changes quickly
  let chartRequest = 0;

  function showChart(text) {
    session.loadChart(text);
    songLength.value = session.songLength;
    position.value = 0;
    updateLoop();
  }

  async function loadChart(url) {
    const request = ++chartRequest;
    loadError.value = null;
    if (!url) {
      loading.value = false;
      showChart("");
      return;
    }
    loading.value = true;
    try {
      const text = await $fetch(url, { responseType: "text" });
      if (request !== chartRequest) return;
      // Missing files come back as the app's html, not a 404
      if (!/^#BODY\s*$/m.test(text)) throw new Error("not a .mer file");
      showChart(text);
    } catch (error) {
      console.error(`Couldn't load chart ${url}`, error);
      if (request === chartRequest)
        loadError.value = "Couldn't load this chart";
    } finally {
      if (request === chartRequest) loading.value = false;
    }
  }

  watch(chartUrl, loadChart);
  watch(
    options,
    (value) => {
      session.setOptions(value);
      updateLoop();
    },
    { deep: true, immediate: true }
  );
  watch(
    features,
    (value) => {
      session.setFeatures(value);
      updateLoop();
    },
    { deep: true, immediate: true }
  );

  onMounted(() => loadChart(chartUrl()));

  // Pages are kept alive, stop drawing when navigated away
  onActivated(() => {
    active = true;
    updateLoop();
  });

  onDeactivated(() => {
    active = false;
    updateLoop();
  });

  onBeforeUnmount(() => {
    active = false;
    views.clear();
    updateLoop();
  });

  return {
    session,
    SPEEDS,
    paused,
    playing,
    speed,
    position,
    songLength,
    loading,
    loadError,
    addView,
    updateLoop,
    togglePause,
    play,
    scrubStart,
    scrub,
    scrubEnd
  };
}
