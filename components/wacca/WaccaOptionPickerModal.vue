<template>
  <div class="modal on" @click="close">
    <div class="modal-content" @click.stop>
      <v-card>
        <v-card-title>
          <div class="d-flex justify-space-between align-center">
            {{ title }}
            <v-btn icon variant="plain" @click="close">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </div>
        </v-card-title>

        <v-card-text>
          <div v-if="errorMessage" class="picker-error">{{ errorMessage }}</div>

          <div class="box-items">
            <div
              v-for="item in ownedItems"
              :key="item.id"
              class="box-item"
              :class="{
                selected: item.id === currentValue,
                saving: savingId === item.id,
              }"
              @click="selectItem(item)"
            >
              <WaccaGachaItem
                :kind="itemKind"
                :id="item.id"
                :rarity="0"
                hideowned
              />
            </div>
          </div>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<style scoped lang="scss">
.modal {
  top: 0;
  left: 0;
}

.modal.on {
  .modal-content {
    flex: 0 1 900px;
    max-height: 90vh;
  }
}

:deep(.v-card) {
  display: flex;
  flex-direction: column;
  max-height: 90vh;
}

:deep(.v-card-text) {
  overflow-y: auto;
}

.box-items {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  width: 100%;
  justify-content: center;
}

.box-item {
  height: 120px;
  width: 150px;
  cursor: pointer;
  border-radius: 5px;
  outline: 3px solid transparent;
  outline-offset: 2px;
  transition:
    outline-color 0.15s,
    transform 0.1s;

  &:hover {
    transform: scale(1.03);
  }

  &.selected {
    outline-color: rgb(var(--v-theme-primary));
  }

  &.saving {
    opacity: 0.5;
    pointer-events: none;
  }
}

.picker-error {
  color: rgb(var(--v-theme-error));
  margin-bottom: 12px;
}

.picker-empty {
  opacity: 0.7;
  margin-bottom: 12px;
}
</style>

<script setup>
const runtimeConfig = useRuntimeConfig();
const profile = useState("profile");
const activeCard = useState("activeCard");
const version = useState("version");

const props = defineProps({
  title: { type: String, required: true },
  itemKind: { type: Number, required: true },
  optionId: { type: Number, required: true },
  items: { type: Array, required: true },
});

const emit = defineEmits(["closeModal"]);

const savingId = ref(null);
const errorMessage = ref("");

const currentValue = computed(() => profile.value.options[props.optionId]);

const ownedItems = computed(() => {
  return props.items.filter((item) =>
    profile.value.items.some((owned) => owned.item_id === item.id),
  );
});

async function selectItem(item) {
  if (savingId.value || item.id === currentValue.value) {
    return;
  }

  savingId.value = item.id;
  errorMessage.value = "";

  profile.value.options[props.optionId] = item.id;
  close();
}

function close() {
  emit("closeModal");
}
</script>
