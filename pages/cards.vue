<template>
  <v-container class="cards-container">
    <v-card class="card">
      <v-card-title>Add a card</v-card-title>

      <v-card-text>
        <div class="access-code-wrap">
          <v-text-field
            v-model="luid"
            label="Access Code"
            maxlength="24"
            pattern="[0-9]*"
            inputmode="numeric"
            :error-messages="errorMessage"
            :messages="message"
            @keydown.enter="addCard"
            :loading="loading"
          ></v-text-field>
        </div>

        <v-btn
          color="primary"
          @click="addCard"
          :loading="loading"
          block
          style="margin-top: 6px"
        >
          Add Card
        </v-btn>

        <div style="margin-top: 1em">
          <v-btn
            v-if="cards.length > 0"
            color="primary"
            @click="$router.push('/wacca')"
            block
          >
            Go to the Wacca page
          </v-btn>
        </div>
      </v-card-text>
    </v-card>

    <TransitionGroup class="cards" name="cards" tag="div">
      <Card
        v-for="card in cards"
        :key="card.luid"
        :card="card"
        @delete="deleteCard(card)"
      />
    </TransitionGroup>
  </v-container>
</template>

<style scoped lang="scss">
.cards-enter-active,
.cards-leave-active {
  transform-origin: top;
  transform: perspective(600px) rotateX(0deg);
  transition: transform 0.5s ease-out;
}
.cards-enter-from,
.cards-leave-to {
  transform: perspective(600px) rotateX(90deg);
  transform-origin: top;
}

.access-code-wrap {
  display: flex;
  align-items: top;
  gap: 10px;

  a {
    margin-top: 6px;
  }
}
</style>

<script setup>
const runtimeConfig = useRuntimeConfig();

const luid = ref("");
const cards = useState("cards");
const activeCard = useState("activeCard");
const errorMessage = ref("");
const message = ref("");
const loading = ref(false);

function formatLuid(ins) {
  let realLuid = ins.replace(/[^0-9]/gi, "");
  let separatedLuid = realLuid.match(/.{1,4}/g);

  if (separatedLuid === null) {
    return "";
  }

  return separatedLuid.join(" ");
}

watch(luid, () => {
  luid.value = formatLuid(luid.value);
});

async function addCard() {
  // check that the card is valid by asking the API
  const inputLuid = luid.value.replace(/[^0-9]/gi, "");

  if (inputLuid.length < 20) {
    errorMessage.value = "Card ID must be 20 characters long.";
    return;
  }

  loading.value = true;

  await attemptAddCard(inputLuid).catch(async () => {
    await attemptAddCard(inputLuid, true).catch(() => {});
  });
}

async function attemptAddCard(addluid, convert) {
  return new Promise(async (resolve, reject) => {
    await getCardInfo(addluid, convert)
      .then((data) => {
        loading.value = false;
        errorMessage.value = "";

        cards.value.push(data);

        localStorage.setItem("cards", JSON.stringify(cards.value));
        activeCard.value = data.luid;
        localStorage.setItem("activeCard", activeCard.value);

        message.value = "Card added successfully!";
        luid.value = "";

        resolve();
      })
      .catch((error, data) => {
        if (convert) {
          loading.value = false;
          switch (error) {
            case "failedconvert":
              errorMessage.value = "Failed to find the card on the network.";
              break;
            case "alreadyadded":
              errorMessage.value = "You already added this card.";
              break;
            case "failedapi":
              errorMessage.value = "Failed to find the card on the network.";
              break;
            case "apidown":
              errorMessage.value = "The card network is down or had an error.";
              break;
          }
        }

        reject();
      });
  });
}

async function getCardInfo(addluid, convert) {
  return new Promise(async (resolve, reject) => {
    if (cards.value.find((card) => card.luid === addluid)) {
      reject("alreadyadded");
      return;
    }

    if (convert) {
      // attempt to convert the ID using bsnk api
      await $fetch(`https://card.bsnk.me/card/${addluid}`)
        .then((data) => {
          if (data.ids["0008"]) {
            addluid = data.ids["0008"];
          } else {
            reject("failedconvert");
          }
        })
        .catch((error) => {
          reject("failedapi");
        });
    }

    if (cards.value.find((card) => card.luid === addluid)) {
      reject("alreadyadded");
      return;
    }

    $fetch(`${runtimeConfig.public.apiUrl}/card/${addluid}`)
      .then((data) => {
        if (data.user_name === undefined) {
          reject("failedapi");
          return;
        }

        data = {
          luid: addluid,
          user_name: data.user_name,
        };
        resolve(data);
      })
      .catch((error) => {
        reject("apidown");
      });
  });
}

function deleteCard(card) {
  cards.value = cards.value.filter((c) => c.luid !== card.luid);
  localStorage.setItem("cards", JSON.stringify(cards.value));

  if (activeCard.value === card.luid) {
    if (cards.value.length > 0) {
      activeCard.value = cards.value[0].luid;
      localStorage.setItem("activeCard", activeCard.value);
    } else {
      activeCard.value = null;
      localStorage.removeItem("activeCard");
    }
  }
}
</script>
