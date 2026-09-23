<template>
  <!-- padding, not margin, or the collapse snaps at the end -->
  <div class="play-detail-wrap">
    <div class="play-detail-panel" :style="{ '--accent': props.color }">
      <div class="pd-head">
        <div class="pd-title">
          <span class="pd-swatch"></span>
          <strong>{{ props.difficulty }}</strong>
          <span class="pd-muted">· play #{{ props.playNumber }}</span>
          <span class="pd-muted">· {{ dateLabel }}</span>
        </div>

        <div class="pd-actions">
          <v-btn
            icon="mdi-chevron-left"
            size="small"
            variant="text"
            :disabled="!props.hasPrev"
            aria-label="Previous play"
            @click="emit('prev')"
          />
          <v-btn
            icon="mdi-chevron-right"
            size="small"
            variant="text"
            :disabled="!props.hasNext"
            aria-label="Next play"
            @click="emit('next')"
          />
          <v-btn
            icon="mdi-close"
            size="small"
            variant="text"
            aria-label="Close"
            @click="emit('close')"
          />
        </div>
      </div>

      <div class="pd-body">
        <div class="pd-score-block">
          <WaccaGrade class="pd-grade" :grade="grade" />
          <div>
            <div class="pd-score">{{ info.score.toLocaleString("en-US") }}</div>
            <div class="pd-tags">
              <WaccaMedal :medal="medal" class="pd-medal" />
              <span v-if="info.is_new_record" class="pd-tag record">
                New record
              </span>
              <span v-else-if="props.isBest" class="pd-tag">Personal best</span>
            </div>
          </div>
        </div>

        <div class="pd-judgements">
          <div class="pd-bar" role="img" :aria-label="barLabel">
            <div
              v-for="j in judgements"
              :key="j.key"
              class="pd-bar-seg"
              :style="{ flexGrow: j.value, background: j.color }"
            ></div>
          </div>

          <div class="pd-grid">
            <div v-for="j in judgements" :key="j.key" class="pd-stat">
              <span class="pd-dot" :style="{ background: j.color }"></span>
              <span class="pd-label">{{ j.label }}</span>
              <span class="pd-value">{{ j.value.toLocaleString("en-US") }}</span>
            </div>
          </div>
        </div>

        <div class="pd-extras">
          <div v-for="x in extras" :key="x.label" class="pd-extra">
            <div class="pd-extra-label">{{ x.label }}</div>
            <div class="pd-extra-value">{{ x.value.toLocaleString("en-US") }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.play-detail-wrap {
  padding: 0 10px 10px;
}

.play-detail-panel {
  padding: 10px 12px 12px;
  border-radius: 10px;
  border: 1px solid rgba(var(--v-theme-on-surface), 0.1);
  background: rgba(var(--v-theme-on-surface), 0.03);
}

.pd-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.pd-title {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
}

.pd-swatch {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--accent);
}

.pd-muted {
  color: rgba(var(--v-theme-on-surface), 0.6);
}

.pd-actions {
  display: flex;
  flex-shrink: 0;
  margin-right: -6px;
}

.pd-body {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px 32px;
  margin-top: 4px;
}

.pd-score-block {
  display: flex;
  align-items: center;
  gap: 10px;
}

.pd-grade {
  height: 52px;
}

.pd-score {
  font-size: 1.9rem;
  font-weight: 800;
  line-height: 1.1;
  font-variant-numeric: tabular-nums;
}

.pd-tags {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 2px;
}

.pd-medal {
  font-size: 1.1rem;
}

.pd-tag {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 1px 6px;
  border-radius: 4px;
  background: rgba(var(--v-theme-primary), 0.15);
  color: rgb(var(--v-theme-primary));
}

.pd-judgements {
  flex: 1 1 280px;
  min-width: 0;
}

.pd-extras {
  display: flex;
  gap: 20px;
  padding-left: 20px;
  border-left: 1px solid rgba(var(--v-theme-on-surface), 0.12);

  @media (max-width: 600px) {
    padding-left: 0;
    border-left: none;
  }
}

.pd-extra-label {
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgba(var(--v-theme-on-surface), 0.55);
}

.pd-extra-value {
  font-size: 1.15rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

.pd-bar {
  display: flex;
  gap: 2px;
  height: 8px;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}

.pd-bar-seg {
  flex-basis: 0;
  min-width: 0;
  transition: flex-grow 0.35s ease;
}

.pd-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 4px 16px;
}

.pd-stat {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
}

.pd-dot {
  width: 8px;
  height: 8px;
  border-radius: 2px;
  flex-shrink: 0;
}

.pd-label {
  color: rgba(var(--v-theme-on-surface), 0.7);
}

.pd-value {
  margin-left: auto;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}
</style>

<script setup>
const props = defineProps({
  play: { type: Object, required: true },
  difficulty: String,
  color: String,
  playNumber: Number,
  grade: Number,
  isBest: Boolean,
  hasPrev: Boolean,
  hasNext: Boolean,
});

const emit = defineEmits(["prev", "next", "close"]);

const UNDATED = "1970-01-01T00:00:00+00:00";

const info = computed(() => props.play.info);

const dateLabel = computed(() =>
  info.value.user_play_date == UNDATED
    ? "Date unknown"
    : new Date(info.value.user_play_date).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      }),
);

const medal = computed(() => {
  const status = info.value.clear_status;
  if (status.is_all_marvelous) return "allmarvelous";
  if (status.is_full_combo) return "fullcombo";
  if (status.is_missless) return "missless";
  if (status.is_clear) return "clear";
  return "failed";
});

const judgements = computed(() => [
  { key: "marvelous", label: "Marvelous", color: "#ff3d7f" },
  { key: "great", label: "Great", color: "#a8d95b" },
  { key: "good", label: "Good", color: "#5b9cf0" },
  { key: "miss", label: "Miss", color: "#9a9a9a" },
].map((j) => ({ ...j, value: info.value.judge[j.key] ?? 0 })));

const extras = computed(() => [
  { label: "Fast", value: info.value.fast ?? 0 },
  { label: "Late", value: info.value.late ?? 0 },
  { label: "Max combo", value: info.value.combo ?? 0 },
]);

const barLabel = computed(() =>
  judgements.value.map((j) => `${j.label} ${j.value}`).join(", "),
);
</script>
