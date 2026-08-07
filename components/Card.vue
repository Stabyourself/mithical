<template>
  <v-card class="card">
    <v-card-text>
      <div class="card-name">
        <div class="card-name-left">
          <div>{{ props.card.user_name }}</div>
          <v-tooltip location="top">
            <template v-slot:activator="{ props }">
              <v-btn
                icon
                variant="text"
                size="small"
                @click="openEditNameDialog"
                v-bind="props"
              >
                <v-icon size="small">mdi-pencil</v-icon>
              </v-btn>
            </template>
            <span>Edit name</span>
          </v-tooltip>
        </div>
        <div>
          <v-tooltip location="top">
            <template v-slot:activator="{ props }">
              <v-btn
                icon
                variant="text"
                size="small"
                @click="deleteCard"
                v-bind="props"
              >
                <v-icon color="error">mdi-delete</v-icon>
              </v-btn>
            </template>
            <span>Remove card</span>
          </v-tooltip>
        </div>
      </div>
      <div class="card-luid">
        <v-tooltip location="top">
          <template v-slot:activator="{ props }">
            <v-btn
              icon
              variant="text"
              size="small"
              @click="toggleHidden"
              v-bind="props"
            >
              <v-icon size="small">{{
                hidden ? "mdi-eye" : "mdi-eye-off"
              }}</v-icon>
            </v-btn>
          </template>
          <span>View full ID</span>
        </v-tooltip>
        {{ formattedLuid }}
      </div>

      <v-dialog v-model="isEditNameDialogOpen" max-width="420">
        <v-card>
          <v-card-title>Change name</v-card-title>
          <v-card-text>
            <v-text-field
              v-model="editedName"
              label="Name"
              maxlength="8"
              counter="8"
              :error-messages="nameErrors"
              @keydown.enter="saveName"
            ></v-text-field>
            <div class="name-change-note">
              This will change your in-game name.
            </div>
            <div v-if="nameSaveError" class="name-save-error">
              {{ nameSaveError }}
            </div>
          </v-card-text>
          <v-card-actions>
            <v-btn
              color="primary"
              :disabled="!canSaveName || isSavingName"
              :loading="isSavingName"
              @click="saveName"
              >Save</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card-text>
  </v-card>
</template>

<script setup>
const runtimeConfig = useRuntimeConfig();

const hidden = ref(true);
const isEditNameDialogOpen = ref(false);
const editedName = ref("");
const isSavingName = ref(false);
const nameSaveError = ref("");

const props = defineProps({
  card: {
    type: Object,
    required: true,
  },
});

const trimmedEditedName = computed(() => editedName.value.trim());

const canSaveName = computed(() => {
  const length = trimmedEditedName.value.length;
  return length >= 1 && length <= 8;
});

const nameErrors = computed(() => {
  if (trimmedEditedName.value.length === 0) {
    return ["Name must be 1-8 characters."];
  }

  if (trimmedEditedName.value.length > 8) {
    return ["Name must be 1-8 characters."];
  }

  return [];
});

watch(editedName, () => {
  nameSaveError.value = "";
});

const formattedLuid = computed(() => {
  // replace all numbers with asterisks except the last 4 if hidden
  let luid = props.card.luid;
  if (hidden.value) {
    luid = luid.replace(/\d(?=\d{4})/g, "x");
  }

  // add spaces
  luid = luid.replace(/(.{4})/g, "$1 ").trim();

  return luid;
});

function toggleHidden() {
  hidden.value = !hidden.value;
}

const emit = defineEmits(["delete", "update-name"]);

function openEditNameDialog() {
  editedName.value = props.card.user_name ?? "";
  nameSaveError.value = "";
  isEditNameDialogOpen.value = true;
}

async function saveName() {
  if (!canSaveName.value) {
    return;
  }

  if (isSavingName.value) {
    return;
  }

  isSavingName.value = true;
  nameSaveError.value = "";

  try {
    const data = await $fetch(
      `${runtimeConfig.public.apiUrl}/wacca/user/${props.card.luid}/changename`,
      {
        method: "POST",
        body: {
          name: trimmedEditedName.value,
        },
      },
    );

    emit("update-name", data.user_name ?? "");
    isEditNameDialogOpen.value = false;
  } catch {
    nameSaveError.value = "Failed to change name.";
  } finally {
    isSavingName.value = false;
  }
}

function deleteCard() {
  emit("delete");
}
</script>

<style scoped lang="scss">
.card-name-left {
  display: flex;
  align-items: center;
}

.name-save-error {
  color: rgb(var(--v-theme-error));
  font-size: 0.8rem;
  line-height: 1.2;
  margin-top: -4px;
}

.name-change-note {
  color: rgba(var(--v-theme-on-surface), 0.75);
  line-height: 1.2;
  margin-top: -6px;
  margin-bottom: 6px;
}
</style>
