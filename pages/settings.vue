<template>
  <WaccaProfileRequired>
    <v-container>
      <v-alert type="info">
        This page is only for testing purposes right now. It may or may not show
        correct data, and won't save anything yet.<br />Also it looks bad.<br />
        <br />If you wanna help me sort out any unknown stuff and lists here,
        lemme know.
      </v-alert>

      <div v-for="option in optionList" :key="option.name" class="option">
        <h2>{{ option.title[language] }}</h2>
        <p>{{ option.description[language] }}</p>

        <div v-if="option.type == 'slider'">
          <v-slider
            color="primary"
            v-model="profile.options[option.id]"
            :min="option.min"
            :max="option.max"
            :step="option.step"
            thumb-label
            hide-details
          >
            <template v-slot:thumb-label="{ modelValue }">
              {{ option.format(modelValue) }}
            </template>

            <template v-slot:prepend>
              {{ option.format(profile.options[option.id]) }}
            </template>
          </v-slider>
        </div>

        <div v-if="option.type == 'options'">
          <v-btn-toggle v-model="profile.options[option.id]" shaped mandatory>
            <v-btn
              color="primary"
              v-for="choice in option.choices"
              :key="choice.value"
              :value="choice.value"
            >
              {{ choice.text[language] }}
            </v-btn>
          </v-btn-toggle>
        </div>

        <div v-if="option.type == 'toggle'">
          <v-switch
            v-model="profile.options[option.id]"
            color="primary"
            hide-details
            :true-value="1"
            :false-value="0"
          ></v-switch>
        </div>
      </div>
    </v-container>
  </WaccaProfileRequired>
</template>

<style scoped lang="scss">
.option {
  margin-bottom: 32px;

  h2 {
    font-size: 20px;
  }

  p {
    opacity: 0.6;
  }
}
</style>

<script setup>
definePageMeta({
  middleware: ["auth"],
});

const language = useState("language");
const profile = useState("profile");

const colorOptions = [
  {
    text: {
      ja: "ライトマゼンタ",
      en: "Light Magenta",
    },
    value: 5,
  },
  {
    text: {
      ja: "ライトイエロー",
      en: "Light Yellow",
    },
    value: 6,
  },
  {
    text: {
      ja: "オレンジ",
      en: "Orange",
    },
    value: 4,
  },
  {
    text: {
      ja: "ライム",
      en: "Lime",
    },
    value: 3,
  },
  {
    text: {
      ja: "レッド",
      en: "Red",
    },
    value: 1,
  },
  {
    text: {
      ja: "スカイブルー",
      en: "Sky Blue",
    },
    value: 2,
  },
  {
    text: {
      ja: "ダークイエロー",
      en: "Dark Yellow",
    },
    value: 7,
  },
  {
    text: {
      ja: "ライトレッド",
      en: "Dark Orange",
    },
    value: 1001,
  },
  {
    text: {
      ja: "イエロー",
      en: "Yellow",
    },
    value: 1002,
  },
  {
    text: {
      ja: "ピュアグリーン",
      en: "Pure Green",
    },
    value: 1003,
  },
  {
    text: {
      ja: "ブライトブルー",
      en: "Bright Blue",
    },
    value: 1004,
  },
  {
    text: {
      ja: "ライトブルー",
      en: "Light Blue",
    },
    value: 1005,
  },
  {
    text: {
      ja: "ライトグレー",
      en: "Light Gray",
    },
    value: 1006,
  },
];

const optionList = [
  {
    id: 1,
    type: "slider",
    title: {
      en: "Speed Settings",
      ja: "スピード調整",
    },
    description: {
      en: "Adjust how fast notes travel.",
      ja: "ノーツのスピードの設定を調整します。",
    },
    default: 5,
    min: 0,
    max: 50,
    step: 1,
    format: (value) => `×${(value / 10 + 1).toFixed(1)}`,
  },

  {
    id: 2,
    title: {
      en: "Mask Opacity",
      ja: "マスク濃度",
    },
    description: {
      en: "Adjust the background mask opacity.",
      ja: "マスク濃度の設定を調整します。",
    },
    type: "slider",
    default: 0,
    min: 0,
    max: 4,
    step: 1,
    format: (value) => value,
  },

  {
    id: 3,
    title: {
      en: "Note Touch SFX",
      ja: "ノーツタッチＳＥ",
    },
    description: {
      en: "Change the sound effect when notes are touched. (NEEDS ITEMS?)",
      ja: "ノーツをタッチしたときのＳＥを変更します。",
    },
    type: "options",
    default: 105001,
    choices: [
      {
        text: {
          ja: "デフォルト(WACCA Lily R)",
          en: "デフォルト(WACCA Lily R)",
        },
        value: 105001,
      },
      {
        text: {
          ja: "ウッド",
          en: "ウッド",
        },
        value: 105002,
      },
      {
        text: {
          ja: "スターライト",
          en: "スターライト",
        },
        value: 105005,
      },
      {
        text: {
          ja: "クラップ",
          en: "クラップ",
        },
        value: 105008,
      },
      {
        text: {
          ja: "タンバリン",
          en: "タンバリン",
        },
        value: 205003,
      },
      {
        text: {
          ja: "デフォルト(WACCA)",
          en: "デフォルト(WACCA)",
        },
        value: 205005,
      },
    ],
  },

  {
    id: 4,
    title: {
      en: "Customize Colors",
      ja: "マイカラー",
    },
    description: {
      en: "Change the color pattern of the WACCA console. (NEEDS ITEMS)",
      ja: "ＷＡＣＣＡコンソールのカラーパターンを変更します。",
    },
    type: "options",
    default: 303001,
    choices: [
      {
        text: {
          ja: "現在のマイカラー",
          en: "Current My Color",
        },
        value: 103001,
      },
      {
        text: {
          ja: "リリィカラー",
          en: "Lily Color",
        },
        value: 203001,
      },
      {
        text: {
          ja: "トリコロール",
          en: "Tricolor",
        },
        value: 203004,
      },
      {
        text: {
          ja: "ルーンカラー",
          en: "Luin Color",
        },
        value: 303001,
      },
    ],
  },

  {
    id: 5,
    title: {
      en: "BGM Volume",
      ja: "ＢＧＭボリューム",
    },
    description: {
      en: "Adjust the volume of the music that plays during gameplay.",
      ja: "プレイ中(演奏中)のＢＧＭの音量を調整します。",
    },
    type: "slider",
    default: 10,
    min: 0,
    max: 10,
    step: 1,
    format: (value) => `${value * 10}%`,
  },

  {
    id: 6,
    title: {
      en: "SE Volume (obsolete)",
      ja: "ＳＥボリューム",
    },
    description: {
      en: "Adjust the volume of sound effects.",
      ja: "ＳＥの音量を調整します。",
    },
    type: "slider",
    default: 10,
    min: 0,
    max: 10,
    step: 1,
    format: (value) => `${value * 10}%`,
  },

  {
    id: 7,
    title: {
      en: "Background Video Settings",
      ja: "背景動画設定",
    },
    description: {
      en: "Choose how songs with videos are displayed before playing them.",
      ja: "動画再生対応楽曲をプレイする前に動画再生を確認するか設定を変更します。",
    },
    type: "options",
    default: 0,
    choices: [
      {
        text: {
          ja: "背景動画がある場合、毎回確認します。",
          en: "Ask whether or not to play background videos each time.",
        },
        value: 0,
      },
      {
        text: {
          ja: "背景動画を再生しません。",
          en: "Never play background videos.",
        },
        value: 1,
      },
      {
        text: {
          ja: "背景動画を常に再生します。",
          en: "Always play background videos.",
        },
        value: 2,
      },
    ],
  },

  {
    id: 101,
    title: {
      en: "Mirror Settings (MISSING FUNCTIONALITY)",
      ja: "ミラー設定",
    },
    description: {
      en: "Choose whether to mirror the notes.",
      ja: "ノーツをミラーするか設定を変更します。",
    },
    type: "toggle",
    default: 0,
  },

  {
    id: 102,
    title: {
      en: "Judgment Display Position",
      ja: "判定表示位置",
    },
    description: {
      en: 'Adjust the display position of judgments such as "Marvelous".',
      ja: "「Ｍａｒｖｅｌｏｕｓ」などの判定の表示位置を調整します。",
    },
    type: "options",
    default: 0,
    choices: [
      {
        text: {
          ja: "センター",
          en: "CENTER",
        },
        value: 0,
      },
      {
        text: {
          ja: "アンダー",
          en: "LOW",
        },
        value: 1,
      },
      {
        text: {
          ja: "トップ",
          en: "HIGH",
        },
        value: 2,
      },
      {
        text: {
          ja: "OFF",
          en: "OFF",
        },
        value: 3,
      },
    ],
  },

  {
    id: 103,
    title: {
      en: "Judgment Detail Display",
      ja: "判定詳細表示",
    },
    description: {
      en: 'Choose whether to display "FAST/LATE" for non-Marvelous hits.',
      ja: "「Ｍａｒｖｅｌｏｕｓ」以外の判定の時に「ＦＡＳＴ／ＬＡＴＥ」の表示を追加できます。",
    },
    type: "toggle",
  },

  {
    id: 104,
    title: {
      en: "GuideLineAreaLine",
    },
    description: {
      en: "MISSING 104",
    },
  },

  {
    id: 105,
    title: {
      en: "Barline Display",
      ja: "小節線表示",
    },
    description: {
      en: "You can show or hide barlines.",
      ja: "小節線の表示を設定できます。",
    },
    type: "toggle",
    default: 1,
  },

  {
    id: 106,
    title: {
      en: "Guideline Intensity",
      ja: "ガイドラインの濃度",
    },
    description: {
      en: "You can adjust the intensity of the guidelines.",
      ja: "ガイドラインの濃度を調整できます。",
    },
    type: "slider",
    default: 5,
    min: 0,
    max: 5,
    step: 1,
    format: (value) => value,
  },

  {
    id: 107,
    title: {
      en: "Combo Display (obsolete)",
    },
    description: {
      en: "MISSING 107",
    },
  },

  {
    id: 108,
    title: {
      en: "Judgment Timing Settings",
      ja: "判定調整設定",
    },
    description: {
      en: "You can adjust the judgment timing.",
      ja: "入力判定タイミングを調整できます。",
    },
    type: "slider",
    default: 0,
    min: 0,
    max: 200,
    step: 1,
    format: (value) => `${(value / 10 - 10).toFixed(1)}`,
  },

  {
    id: 109,
    title: {
      en: "BonusEffectSetting",
    },
    description: {
      en: "MISSING 109",
    },
  },

  {
    id: 110,
    title: {
      en: "Note Thickness",
      ja: "ノーツ幅設定",
    },
    description: {
      en: "Adjust how thick notes are displayed.",
      ja: "ノーツの幅を設定できます。",
    },
    type: "slider",
    default: 3,
    min: 1,
    max: 5,
    step: 1,
    format: (value) => value,
  },

  {
    id: 111,
    title: {
      en: "GuideSoundSetting",
    },
    description: {
      en: "MISSING 111",
    },
  },

  {
    id: 112,
    title: {
      en: "MiscSoundEffectVolume",
    },
    description: {
      en: "MISSING 112",
    },
  },

  {
    id: 113,
    title: {
      en: "SongStartSound",
    },
    description: {
      en: "MISSING 113",
    },
  },

  {
    id: 114,
    title: {
      en: "Bonus Effect",
      ja: "ボーナス効果",
    },
    description: {
      en: "Choose the bonus effect.",
      ja: "ボーナス効果の設定を行います。",
    },
    type: "options",
    default: 1,
    choices: [
      {
        text: {
          ja: "ボーナス効果をＯＦＦにする。",
          en: "Turn Bonus Notes OFF",
        },
        value: 0,
      },
      {
        text: {
          ja: "ボーナス効果をＯＮにする。",
          en: "Turn Bonus Notes ON",
        },
        value: 1,
      },
    ],
  },

  {
    id: 115,
    title: {
      en: "Character Voices",
      ja: "キャラクター音声",
    },
    description: {
      en: "You can turn character voices on or off.",
      ja: "プレイ中（演奏中）のキャラクター音声をＯＮ／ＯＦＦできます",
    },
    type: "toggle",
    default: 1,
  },

  {
    id: 116,
    title: {
      en: "Score Display",
      ja: "スコア表示方式",
    },
    description: {
      en: "Choose which method to display your score.",
      ja: "ゲーム中のスコアの表示方式を変更できます。",
    },
    type: "options",
    default: 0,
    choices: [
      {
        text: {
          ja: "プラス方式",
          en: "Plus Method",
        },
        value: 0,
      },
      {
        text: {
          ja: "マイナス方式",
          en: "Minus Method",
        },
        value: 1,
      },
    ],
  },

  {
    id: 117,
    title: {
      en: "Give Up Settings",
      ja: "ギブアップ設定",
    },
    description: {
      en: "Set the ability to give-up a song mid-game.",
      ja: "プレイ中の「途中終了」を設定できます。",
    },
    type: "options",
    default: 0,
    choices: [
      {
        text: {
          ja: "なし",
          en: "OFF",
        },
        value: 0,
      },
      {
        text: {
          ja: "ノータッチ",
          en: "No-Touch",
        },
        value: 1,
      },
      {
        text: {
          ja: "Sボーダー",
          en: "S Border",
        },
        value: 2,
      },
      {
        text: {
          ja: "SSボーダー",
          en: "SS Border",
        },
        value: 3,
      },
      {
        text: {
          ja: "SSSボーダー",
          en: "SSS Border",
        },
        value: 4,
      },
      {
        text: {
          ja: "自己ベストボーダー",
          en: "Personal Best Border",
        },
        value: 5,
      },
    ],
  },

  {
    id: 118,
    title: {
      en: "Guideline Interval",
      ja: "ガイドライン間隔線表示",
    },
    description: {
      en: "Choose how many guidelines are displayed.",
      ja: "ガイドラインの間隔線を設定できます。",
    },
    type: "options",
    default: 1,
    choices: [
      {
        text: {
          ja: "なし",
          en: "None",
        },
        value: 0,
      },
      {
        text: {
          ja: "Aタイプ",
          en: "A Type",
        },
        value: 1,
      },
      {
        text: {
          ja: "Bタイプ",
          en: "B Type",
        },
        value: 2,
      },
      {
        text: {
          ja: "Cタイプ",
          en: "C Type",
        },
        value: 3,
      },
      {
        text: {
          ja: "Dタイプ",
          en: "D Type",
        },
        value: 4,
      },
      {
        text: {
          ja: "Eタイプ",
          en: "E Type",
        },
        value: 5,
      },
      {
        text: {
          ja: "Fタイプ",
          en: "F Type",
        },
        value: 6,
      },
      {
        text: {
          ja: "Gタイプ",
          en: "G Type",
        },
        value: 7,
      },
    ],
  },

  {
    id: 119,
    title: {
      en: "Center Display",
      ja: "中央表示",
    },
    description: {
      en: "Adjust information displayed in the screen center.",
      ja: "画面中央表示を設定できます。",
    },
    type: "options",
    default: 1,
    choices: [
      {
        text: {
          ja: "なし",
          en: "None",
        },
        value: 0,
      },
      {
        text: {
          ja: "COMBO",
          en: "COMBO",
        },
        value: 1,
      },
      {
        text: {
          ja: "SCORE(プラス方式)",
          en: "Score (Plus Method)",
        },
        value: 2,
      },
      {
        text: {
          ja: "SCORE(マイナス方式タイプ)",
          en: "Score (Minus Method)",
        },
        value: 3,
      },
      {
        text: {
          ja: "Sボーダー",
          en: "S Border",
        },
        value: 4,
      },
      {
        text: {
          ja: "SSボーダー",
          en: "SS Border",
        },
        value: 5,
      },
      {
        text: {
          ja: "SSSボーダー",
          en: "SSS Border",
        },
        value: 6,
      },
      {
        text: {
          ja: "自己ベストボーダー",
          en: "Personal Best Border",
        },
        value: 7,
      },
    ],
  },

  {
    id: 120,
    title: {
      en: "Ranking Display",
      ja: "順位表示",
    },
    description: {
      en: "Adjust how rankings are shown in multiplayer.",
      ja: "マルチプレイ中の順位の表示を設定できます。",
    },
    type: "toggle",
    default: 1,
  },

  {
    id: 121,
    title: {
      en: "Emblem Display",
      ja: "エンブレム表示",
    },
    description: {
      en: "Adjust the display of Stage Up Emblems.",
      ja: "ステージアップエンブレムの表示を設定できます。",
    },
    type: "toggle",
    default: 1,
  },

  {
    id: 122,
    title: {
      en: "Rate Display",
      ja: "レート表示",
    },
    description: {
      en: "Adjust the display of ratings.",
      ja: "レーティングの表示を設定できます。",
    },
    type: "toggle",
    default: 1,
  },

  {
    id: 123,
    title: {
      en: "Player Level Display",
      ja: "プレイヤーレベル表示",
    },
    description: {
      en: "Adjust player level display.",
      ja: "プレイヤーレベルの表示を設定できます。",
    },
    type: "toggle",
    default: 1,
  },

  {
    id: 124,
    title: {
      en: "Touch Effect (Pop) (obsolete)",
    },
    description: {
      en: "This version was a toggle",
    },
  },

  {
    id: 125,
    title: {
      en: "Guide Sound Volume",
      ja: "ガイド音ボリューム",
    },
    description: {
      en: "Adjust the volume of the guide sounds that occur during gameplay.",
      ja: "プレイ中(演奏中)のガイド音の音量を調整します。",
    },
    type: "slider",
    default: 10,
    min: 0,
    max: 10,
    step: 1,
    format: (value) => `${value * 10}%`,
  },

  {
    id: 126,
    title: {
      en: "Touch Note Volume",
      ja: "タッチノーツボリューム",
    },
    description: {
      en: "Adjust the volume of touch note sounds that occur during gameplay.",
      ja: "プレイ中(演奏中)のタッチノーツ音の音量を調整します。",
    },
    type: "slider",
    default: 10,
    min: 0,
    max: 10,
    step: 1,
    format: (value) => `${value * 10}%`,
  },

  {
    id: 127,
    title: {
      en: "Hold Note Volume",
      ja: "ホールドノーツボリューム",
    },
    description: {
      en: "Adjust the volume of hold note sounds that occur during gameplay.",
      ja: "プレイ中(演奏中)のホールドノーツ音の音量を調整します。",
    },
    type: "slider",
    default: 10,
    min: 0,
    max: 10,
    step: 1,
    format: (value) => `${value * 10}%`,
  },

  {
    id: 128,
    title: {
      en: "Slide Note Volume",
      ja: "スライドノーツボリューム",
    },
    description: {
      en: "Adjust the volume of slide note sounds that occur during gameplay.",
      ja: "プレイ中(演奏中)のスライドノーツ音の音量を調整します。",
    },
    type: "slider",
    default: 10,
    min: 0,
    max: 10,
    step: 1,
    format: (value) => `${value * 10}%`,
  },

  {
    id: 129,
    title: {
      en: "Snap Sound Volume",
      ja: "スナップノーツボリューム",
    },
    description: {
      en: "Adjust the volume of snap note sounds that occur during gameplay.",
      ja: "プレイ中(演奏中)のスナップノーツ音の音量を調整します。",
    },
    type: "slider",
    default: 10,
    min: 0,
    max: 10,
    step: 1,
    format: (value) => `${value * 10}%`,
  },

  {
    id: 130,
    title: {
      en: "Chain Note Volume",
      ja: "チェインノーツボリューム",
    },
    description: {
      en: "Adjust the volume of chain note sounds that occur during gameplay.",
      ja: "プレイ中(演奏中)のチェインノーツ音の音量を調整します。",
    },
    type: "slider",
    default: 10,
    min: 0,
    max: 10,
    step: 1,
    format: (value) => `${value * 10}%`,
  },

  {
    id: 131,
    title: {
      en: "Bonus Note Volume",
      ja: "ボーナスノーツボリューム",
    },
    description: {
      en: "Adjust the volume of bonus note sounds that occur during gameplay.",
      ja: "プレイ中(演奏中)のボーナスノーツ音の音量を調整します。",
    },
    type: "slider",
    default: 10,
    min: 0,
    max: 10,
    step: 1,
    format: (value) => `${value * 10}%`,
  },

  {
    id: 132,
    title: {
      en: "Gate Skip",
      ja: "ゲート簡易演出",
    },
    description: {
      en: "You can turn choose to quickly skip Gates.",
      ja: "ゲート進行の簡易演出を設定できます。",
    },
    type: "toggle",
    default: 0,
  },

  {
    id: 133,
    title: {
      en: "Key Beam",
      ja: "キービーム",
    },
    description: {
      en: "Choose whether to show the key beam effect.",
      ja: "キービームの表示を設定できます。",
    },
    type: "toggle",
    default: 1,
  },

  {
    id: 134,
    title: {
      en: "Unknown",
    },
    description: {
      en: "MISSING 134",
    },
  },

  {
    id: 135,
    title: {
      en: "R Note Volume",
      ja: "Ｒノーツボリューム",
    },
    description: {
      en: "Adjust the volume of R note sounds that occur during gameplay.",
      ja: "プレイ中(演奏中)のＲノーツ音の音量を調整します。",
    },
    type: "slider",
    default: 10,
    min: 0,
    max: 10,
    step: 1,
    format: (value) => `${value * 10}%`,
  },

  {
    id: 136,
    title: {
      en: "Invert Slide Notes",
      ja: "スライドカラー反転",
    },
    description: {
      en: "Inverts the slide color gradient.",
      ja: "スライドのグラデーションを反転します。",
    },
    type: "toggle",
    default: 0,
  },

  {
    id: 137,
    title: {
      en: "Unknown",
    },
    description: {
      en: "MISSING 137",
    },
  },

  {
    id: 138,
    title: {
      en: "Touch Effect (Shoot)",
      ja: "タッチエフェクト(シュート)",
    },
    description: {
      en: "Choose whether to show shooting touch effects.",
      ja: "タッチエフェクト(シュート)の表示を設定できます。",
    },
    type: "toggle",
    default: 1,
  },

  {
    id: 139,
    title: {
      en: "R Note Effect",
      ja: "Ｒノーツエフェクト",
    },
    description: {
      en: "Choose whether to show R note effects.",
      ja: "Ｒノーツエフェクトの表示を設定できます。",
    },
    type: "toggle",
    default: 1,
  },

  {
    id: 140,
    title: {
      en: "Display Information Opacity",
      ja: "表示情報の濃度",
    },
    description: {
      en: "You can make the displayed information transparent.",
      ja: "表示情報の濃度を調整できます。",
    },
    type: "slider",
    default: 5,
    min: 0,
    max: 5,
    step: 1,
    format: (value) => value,
  },

  {
    id: 141,
    title: {
      en: "WACCA Bingo Skip",
      ja: "WACCA BINGO簡易演出",
    },
    description: {
      en: "You can turn choose to quickly skip WACCA Bingo.",
      ja: "WACCA BINGOの簡易演出を設定できます。",
    },
    type: "toggle",
    default: 0,
  },

  {
    id: 201,
    title: {
      en: "← Slide Note Color",
      ja: "←スライドノーツの色",
    },
    description: {
      en: "Set the color of ← Slide Notes.",
      ja: "←スライドノーツの色を設定します。",
    },
    type: "options",
    default: 4,
    choices: colorOptions,
  },

  {
    id: 202,
    title: {
      en: "→ Slide Note Color",
      ja: "→スライドノーツの色",
    },
    description: {
      en: "Set the color of → Slide Notes.",
      ja: "→スライドノーツの色を設定します。",
    },
    type: "options",
    default: 3,
    choices: colorOptions,
  },

  {
    id: 203,
    title: {
      en: "↑ Snap Note Color",
      ja: "↑スナップノーツの色",
    },
    description: {
      en: "Set the color of ↑ Slide Notes.",
      ja: "↑スナップノーツの色を設定します。",
    },
    type: "options",
    default: 1,
    choices: colorOptions,
  },

  {
    id: 204,
    title: {
      en: "↓ Slide Note Color",
      ja: "↓スナップノーツの色",
    },
    description: {
      en: "Set the color of ↓ Slide Notes.",
      ja: "↓スライドノーツの色を設定します。",
    },
    type: "options",
    default: 2,
    choices: colorOptions,
  },

  {
    id: 205,
    title: {
      en: "Touch Note Color",
      ja: "タッチノーツの色",
    },
    description: {
      en: "Set the color of Touch Notes.",
      ja: "タッチノーツの色を設定します。",
    },
    type: "options",
    default: 5,
    choices: colorOptions,
  },

  {
    id: 206,
    title: {
      en: "Chain Note Color",
      ja: "チェインノーツの色",
    },
    description: {
      en: "Set the color of Chain Notes.",
      ja: "チェインノーツの色を設定します。",
    },
    type: "options",
    default: 6,
    choices: colorOptions,
  },

  {
    id: 207,
    title: {
      en: "Hold Note Color",
      ja: "ホールドノーツの色",
    },
    description: {
      en: "Set the color of Hold Notes.",
      ja: "ホールドノーツの色を設定します。",
    },
    type: "options",
    default: 7,
    choices: colorOptions,
  },

  {
    id: 1001,
    title: {
      en: "Headphone Volume",
    },
    description: {
      en: "Adjust the volume of the headphone audio.",
    },
    type: "slider",
    default: 0,
    min: 0,
    max: 20,
    step: 1,
    format: (value) => value,
  },

  {
    id: 1006,
    title: {
      en: "Touch Effect (Pop)",
      ja: "タッチエフェクト(ポップ)",
    },
    description: {
      en: "Choose which popping touch effects are shown. (NEEDS ITEMS)",
      ja: "タッチエフェクト(ポップ)の表示を設定できます。",
    },
    type: "options",
    default: 312001,
    choices: [
      {
        text: {
          ja: "OFF",
          en: "OFF",
        },
        value: 312000,
      },
      {
        text: {
          ja: "デフォルト",
          en: "Default",
        },
        value: 312001,
      },
      {
        text: {
          ja: "バブル",
          en: "Bubble",
        },
        value: 312002,
      },
    ],
  },
];
const options = ref({});
</script>
