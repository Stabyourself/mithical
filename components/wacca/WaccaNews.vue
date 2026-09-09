<template>
  <div class="news-post">
    <div class="news-title-bar">
      <div class="news-title" v-html="renderedTitle"></div>
      <div class="news-date">{{ formattedDate }}</div>
    </div>

    <div class="news-card">
      <div class="news-content" :class="{ 'is-expanded': expanded }">
        <div class="news-body-mask" :class="{ 'is-expanded': expanded }">
          <Collapse
            :when="expanded"
            :baseHeight="peekHeight"
            class="news-body-collapse"
          >
            <div class="news-body" v-html="renderedBody"></div>
          </Collapse>
        </div>
      </div>

      <div class="news-toggle" v-ripple @click="expanded = !expanded">
        <span>{{ expanded ? "Show less" : "Read more" }}</span>
        <v-icon size="small">{{
          expanded ? "mdi-chevron-up" : "mdi-chevron-down"
        }}</v-icon>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
$news-bg-alpha: 0.65;
$news-padding-x: 24px;
$news-padding-y: 20px;

.news-post {
  position: relative;
}

.news-card {
  position: relative;
  z-index: 1;
  margin-top: -12px;
  background: rgba(var(--v-theme-boxcolor), $news-bg-alpha);
  backdrop-filter: blur(8px);
  color: white;
  overflow: hidden;
  border-radius: 0 0 12px 12px;
}

.news-content {
  padding: $news-padding-y $news-padding-x;
  padding-top: $news-padding-y + 10px;
  padding-bottom: $news-padding-y;
  transition: padding-bottom 300ms linear;

  &.is-expanded {
    padding-bottom: $news-padding-y * 1.5;
  }
}

.v-theme--waccaOled .news-card {
  outline: solid 1px white;
}

.news-title-bar {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
  margin: 0 -14px;
  padding: 6px 28px;
  color: white;
}

.news-title-bar:after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: v-bind(accentColor);
  transform: skew(-20deg);
  z-index: -1;
}

.news-title {
  font-size: 1.4rem;
  font-weight: 700;

  :deep(p) {
    margin: 0;
  }
}

.news-date {
  font-size: 0.85rem;
  font-weight: 200;
  opacity: 0.85;
  white-space: nowrap;
}

.news-body-mask {
  position: relative;
  transition: mask-image 300ms linear, -webkit-mask-image 300ms linear;
  mask-image: linear-gradient(
    to bottom,
    black calc(100% - 40px),
    black calc(100% - 40px),
    transparent 100%
  );
  -webkit-mask-image: linear-gradient(
    to bottom,
    black calc(100% - 40px),
    black calc(100% - 40px),
    transparent 100%
  );

  &.is-expanded {
    mask-image: linear-gradient(to bottom, black 100%, black 100%, transparent 100%);
    -webkit-mask-image: linear-gradient(
      to bottom,
      black 100%,
      black 100%,
      transparent 100%
    );
  }
}

.news-body {
  line-height: 1.5;
  font-weight: 300;

  :deep(p) {
    margin: 0 0 10px;
  }

  :deep(p:last-child) {
    margin-bottom: 0;
  }

  :deep(a) {
    color: v-bind(accentColor);
  }

  :deep(ul),
  :deep(ol) {
    margin: 0 0 10px;
    padding-left: 1.3em;
  }

  :deep(ul:last-child),
  :deep(ol:last-child) {
    margin-bottom: 0;
  }

  :deep(h1),
  :deep(h2),
  :deep(h3) {
    margin: 0 0 8px;
    font-weight: 700;
  }

  :deep(h1) {
    font-size: 1.3rem;
  }

  :deep(h2) {
    font-size: 1.15rem;
  }

  :deep(h3) {
    font-size: 1rem;
  }

  :deep(img) {
    max-width: 100%;
    border-radius: 8px;
    margin: 4px 0 10px;
  }

  :deep(blockquote) {
    margin: 0 0 10px;
    padding: 4px 14px;
    border-left: 3px solid v-bind(accentColor);
    opacity: 0.85;
    font-style: italic;
  }

  :deep(code) {
    background: rgba(0, 0, 0, 0.3);
    padding: 1px 6px;
    border-radius: 4px;
    font-size: 0.9em;
  }

  :deep(hr) {
    border: none;
    border-top: 1px solid rgba(255, 255, 255, 0.2);
    margin: 10px 0;
  }

  :deep(table) {
    border-collapse: collapse;
    margin: 0 0 10px;
    width: 100%;
  }

  :deep(th),
  :deep(td) {
    border: 1px solid rgba(255, 255, 255, 0.2);
    padding: 4px 10px;
    text-align: left;
  }

  :deep(th) {
    background: rgba(0, 0, 0, 0.2);
  }
}

.news-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
  width: fit-content;
  padding: 6px 16px;
  font-size: 0.85rem;
  font-weight: 600;
  background: v-bind(accentColor);
  color: white;
  cursor: pointer;
  user-select: none;
  border-radius: 8px 8px 0 0;

  &:hover {
    opacity: 0.8;
  }
}
</style>

<script setup>
import { Collapse } from "vue-collapsed";
import { marked } from "marked";

const props = defineProps({
  title: { type: String, required: true },
  date: { type: [String, Date], required: true },
  body: { type: String, required: true },
  peekHeight: { type: Number, default: 80 },
  accentColor: { type: String, default: "#009de6" },
});

const { accentColor } = toRefs(props);

const expanded = ref(false);

const renderedTitle = computed(() => marked.parseInline(props.title));
const renderedBody = computed(() => marked.parse(props.body));

const formattedDate = computed(() => {
  return new Date(props.date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
});
</script>
