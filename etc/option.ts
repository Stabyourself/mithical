export enum UserOptionType {
  // Debug: ハイスピード
  // Web UI: スピード調整
  // Web UI Description: ノーツのスピードを設定できます。
  // Value: 0 = 1.0, 1 = 1.1, ..., 50 = 6.0
  NoteSpeed = 1,
  // Debug: マスク
  // Web UI: マスク濃度を設定できます。
  // Web UI Description: マスク濃度を設定できます。
  // Value:
  //     0 = マスク無し
  //     1 = 濃度+1
  //     2 = 濃度+2
  //     3 = 濃度+3
  //     4 = 濃度+4
  Mask = 2,
  // Debug: 入力SE
  // Web UI: ノーツタッチSEt
  // Value:
  //     105001 = デフォルト(WACCA Lily R)
  //     105002 = ウッド
  //     105005 = スターライト
  //     105008 = クラップ
  //     205003 = タンバリン
  //     205005 = デフォルト(WACCA)
  NoteTouchSoundEffect = 3,
  // Debug: シンボルカラー
  // Web UI: マイカラー
  // Value:
  //     103001 = 現在のマイカラー
  //     203001 = リリィカラー
  //     203004 = トリコロール
  //     303001 = ルーンカラー
  MyColor = 4,
  // Debug: BGMボリューム
  // Web UI: BGMボリューム
  // Web UI Description: プレイ中のBGMの音量を設定できます。
  // Value: 0 = 0, 1 = 10, ..., 10 = 100
  BgmVolume = 5,
  // 背景動画のON / OFF
  SoundEffectVolume = 6,
  // Debug: 背景動画
  // Web UI: 背景動画設定
  // Value: 0 = 毎回確認, 1 = OFF, 2 = ON
  Movie = 7,
  // Debug: ミラー設定
  // Web UI: ミラー設定
  // Web UI Description: プレイ中のノーツ配置入れ替えを設定できます。
  // Value: 0 = なし, 1 = 左右ミラー
  Mirror = 101,
  // Debug: 判定 表示位置
  // Web UI: 判定表示位置
  // Web UI Description: 判定の表示位置を設定できます。
  // Value:
  //     0 = センター
  //     1 = アンダー
  //     2 = トップ
  //     3 = OFF
  JudgePosition = 102,
  // Debug: 判定 詳細表示ON / OFF
  // Web UI: 判定詳細表示
  // Web UI Description: 「FAST/LATE」表示のON/OFFを設定できます。
  // Value: 0 = OFF, 1 = ON
  JudgeDetail = 103,
  // ガイドライン エリアライン
  GuideLineAreaLine = 104,
  // Debug: ガイドライン 小節ラインON / OFF
  // Web UI: 小節線表示
  // Web UI Description: 小節線のON/OFFを設定できます。
  // Value: 0 = OFF, 1 = ON
  GuideMeasureLine = 105,
  // Debug: ガイドライン マスク
  // Web UI: ガイドラインの濃度
  // Web UI Description: ガイドラインの濃度を設定できます。
  // Value: 0 = 0, 1 = 1, ..., 5 = 5
  GuideLineMask = 106,
  // コンボ 表示
  ComboDisplay = 107,
  // Debug: 判定ライン タイミング調整
  // Web UI: 判定調整設定
  // Web UI Description: 入力判定タイミングを設定できます。
  // Value: 0 = -10.0, 1 = -9.9, ..., 200 = +10.0
  JudgeLineTiming = 108,
  // ボーナスエフェクト 表示
  BonusEffectSetting = 109,
  // Debug: ノーツデザイン
  // Web UI: ノーツ幅設定
  // Web UI Description: ノーツ幅を設定できます。
  // Value: 1 = 1, ..., 5 = 5
  NoteWidth = 110,
  // ガイド音設定
  GuideSoundSetting = 111,
  // 各SEボリューム設定
  MiscSoundEffectVolume = 112,
  // 楽曲開始音設定
  SongStartSound = 113,
  // ボーナス効果設定
  // Web UI: ボーナス効果
  // Web UI Description: ボーナスノーツの効果のON/OFFを設定できます。
  // Value: 0 = OFF, 1 = ON
  BonusNoteEffect = 114,
  // Debug: キャラクター音声設定
  // Web UI: キャラクター音声
  // Web UI Description: プレイ中のキャラクター音声のON/OFFを設定できます。
  // Value: 0 = OFF, 1 = ON
  CharaSound = 115,
  // Debug: スコア表示方式
  // Web UI: スコア表示方式
  // Web UI Description: プレイ中のスコア表示形式を設定できます。
  // Value: 0 = プラス方式, 1 = マイナス方式
  ScoreDisplay = 116,
  // Debug: ギブアップ設定
  // Web UI: ギブアップ設定
  // Web UI Description: プレイ中の「途中終了」を設定できます。
  // Value:
  //     0 = なし
  //     1 = ノータッチ
  //     2 = Sボーダー
  //     3 = SSボーダー
  //     4 = SSSボーダー
  //     5 = 自己ベストボーダー
  GiveUp = 117,
  // Debug: ガイドライン間隔
  // Web UI: ガイドライン間隔線表示
  // Web UI Description: ガイドラインの間隔線を設定できます。
  // Value:
  //     0 = なし
  //     1 = Aタイプ
  //     2 = Bタイプ
  //     3 = Cタイプ
  //     4 = Dタイプ
  //     5 = Eタイプ
  //     6 = Fタイプ
  //     7 = Gタイプ
  GuideLineInterval = 118,
  // Debug: 中央表示
  // Web UI: 中央表示
  // Web UI Description: 画面中央表示を設定できます。
  // Value:
  //     0 = なし
  //     1 = COMBO表示
  //     2 = スコア（加算タイプ）
  //     3 = スコア（減算タイプ）
  //     4 = Sボーダー
  //     5 = SSボーダー
  //     6 = SSSボーダー
  //     7 = 自己ベストボーダー
  CenterDisplay = 119,
  // Debug: 順位表示
  // Web UI: 順位表示
  // Web UI Description: マルチプレイ中の順位表示を設定できます。
  // Value: 0 = OFF, 1 = ON
  MultiRankDisplay = 120,
  // Debug: ステージアッぷアイコン表示
  // Web UI: エンブレム表示
  // Web UI Description: ステージアップエンブレムの表示を設定できます。
  // Value: 0 = OFF, 1 = ON
  EmblemDisplay = 121,
  // Debug: レート表示
  // Web UI: レート表示
  // Web UI Description: レートの表示を設定できます。
  // Value: 0 = OFF, 1 = ON
  RateDisplay = 122,
  // Debug: プレイヤーレベル表示
  // Web UI: プレイヤーレベル表示
  // Web UI Description: プレイヤーレベルの表示を設定できます。
  // Value: 0 = OFF, 1 = ON
  PlayerLevelDisplay = 123,
  // タッチエフェクト
  TouchEffect = 124,
  // Debug: ガイド音ボリューム
  // Web UI: ガイド音ボリューム
  // Web UI Description: プレイ中のガイド音の音量を設定できます。
  // Value: 0 = 0, 1 = 10, ..., 10 = 100
  GuideSoundVolume = 125,
  // Debug: タッチノーツボリューム
  // Web UI: タッチノーツボリューム
  // Web UI Description: プレイ中のタッチノーツ成功時の音量を設定できます。
  // Value: 0 = 0, 1 = 10, ..., 10 = 100
  TouchNoteVolume = 126,
  // Debug: ホールドノーツボリューム
  // Web UI: ホールドノーツボリューム
  // Web UI Description: プレイ中のホールドノーツ成功時の音量を設定できます。
  // Value: 0 = 0, 1 = 10, ..., 10 = 100
  HoldNoteVolume = 127,
  // Debug: スライドノーツボリューム
  // Web UI: スライドノーツボリューム
  // Web UI Description: プレイ中のスライドノーツ成功時の音量を設定できます。
  // Value: 0 = 0, 1 = 10, ..., 10 = 100
  SlideNoteVolume = 128,
  // Debug: スナップノーツボリューム
  // Web UI: スナップノーツボリューム
  // Web UI Description: プレイ中のスナップノーツ成功時の音量を設定できます。
  // Value: 0 = 0, 1 = 10, ..., 10 = 100
  SnapNoteVolume = 129,
  // Debug: チェインノーツボリューム
  // Web UI: チェインノーツボリューム
  // Web UI Description: プレイ中のチェインノーツ成功時の音量を設定できます。
  // Value: 0 = 0, 1 = 10, ..., 10 = 100
  ChainNoteVolume = 130,
  // Debug: ボーナス効果ボリューム
  // Web UI: ボーナスノーツボリューム
  // Web UI Description: プレイ中のボーナスノーツ成功時の音量を設定できます。
  // Value: 0 = 0, 1 = 10, ..., 10 = 100
  BonusNoteVolume = 131,
  // Debug: ゲート演出スキップ
  // Web UI: ゲート簡易演出
  // Web UI Description: ゲート進行の簡易演出を設定できます。
  // Value: 0 = OFF, 1 = ON
  GateDirectingSkip = 132,
  // Debug: キービーム表示
  // Web UI: キービーム
  // Web UI Description: キービームのON/OFFを設定できます。
  // Value: 0 = OFF, 1 = ON
  KeyBeamDisplay = 133,
  // TODO: Figure out what this value is used for or if it is included for
  //  previous game versions
  Unk134 = 134,
  // Web UI: Rノーツボリューム
  // Web UI Description: プレイ中のRノーツ成功時の音量を設定できます。
  // Value: 0 = 0, 1 = 10, ..., 10 = 100
  RNoteVolume = 135,
  // Web UI: スライドカラー反転
  // Web UI Description: スライドカラー反転の設定を変更できます。
  // Value: 0 = 通常, 1 = 反転
  SlideColorInvert = 136,
  // TODO: Figure out what this value is used for or if it is included for
  //  previous game versions
  Unk137 = 137,
  // Web UI: タッチエフェクト(シュート)
  // Web UI Description: タッチエフェクト(シュート)のON/OFFを設定できます。
  // Value: 0 = OFF, 1 = ON
  TouchEffectShoot = 138,
  // Web UI: Rノーツエフェクト
  // Web UI Description: RノーツエフェクトのON/OFFを設定できます。
  // Value: 0 = OFF, 1 = ON
  RNoteEffect = 139,
  // Web UI: 表示情報の濃度
  // Web UI Description: 表示情報の濃度を設定できます。
  // Value: 0 = 0, ..., 5 = 5
  InformationMask = 140,
  // Web UI: WACCA BINGO 簡易演出
  // Web UI Description: WACCA BINGOの簡易演出を設定できます。
  // Value: 0 = OFF, 1 = ON
  MissionDirectingSkip = 141,
  // Debug: ←スライドノーツの色
  // Web UI: ←スライドノーツの色
  // Web UI Description: ←スライドノーツの色を設定できます。
  // Value:
  //     5 = ライトマゼンタ
  //     6 = ライトイエロー
  //     4 = オレンジ
  //     3 = ライム
  //     1 = レッド
  //     2 = スカイブルー
  //     7 = ダークイエロー
  //     1001 = ライトレッド
  //     1002 = イエロー
  //     1003 = ピュアグリーン
  //     1004 = ブライトブルー
  //     1005 = ライトブルー
  //     1006 = ライトグレー
  SlideNoteLeftColor = 201,
  // Debug: →スライドノーツの色
  // Web UI: →スライドノーツの色
  // Web UI Description: →スライドノーツの色を設定できます。
  // Value:
  //     5 = ライトマゼンタ
  //     6 = ライトイエロー
  //     4 = オレンジ
  //     3 = ライム
  //     1 = レッド
  //     2 = スカイブルー
  //     7 = ダークイエロー
  //     1001 = ライトレッド
  //     1002 = イエロー
  //     1003 = ピュアグリーン
  //     1004 = ブライトブルー
  //     1005 = ライトブルー
  //     1006 = ライトグレー
  SlideNoteRightColor = 202,
  // Debug: ↑スナップノーツの色
  // Web UI: ↑スナップノーツの色
  // Web UI Description: ↑スナップノーツの色を設定できます。
  // Value:
  //     5 = ライトマゼンタ
  //     6 = ライトイエロー
  //     4 = オレンジ
  //     3 = ライム
  //     1 = レッド
  //     2 = スカイブルー
  //     7 = ダークイエロー
  //     1001 = ライトレッド
  //     1002 = イエロー
  //     1003 = ピュアグリーン
  //     1004 = ブライトブルー
  //     1005 = ライトブルー
  //     1006 = ライトグレー
  SnapNoteUpColor = 203,
  // Debug: ↓スナップノーツの色
  // Web UI: ↓スナップノーツの色
  // Web UI Description: ↓スナップノーツの色を設定できます。
  // Value:
  //     5 = ライトマゼンタ
  //     6 = ライトイエロー
  //     4 = オレンジ
  //     3 = ライム
  //     1 = レッド
  //     2 = スカイブルー
  //     7 = ダークイエロー
  //     1001 = ライトレッド
  //     1002 = イエロー
  //     1003 = ピュアグリーン
  //     1004 = ブライトブルー
  //     1005 = ライトブルー
  //     1006 = ライトグレー
  SnapNoteDownColor = 204,
  // Web UI: タッチノーツの色
  // Web UI Description: タッチノーツの色を設定できます。
  // Value:
  //     5 = ライトマゼンタ
  //     6 = ライトイエロー
  //     4 = オレンジ
  //     3 = ライム
  //     1 = レッド
  //     2 = スカイブルー
  //     7 = ダークイエロー
  //     1001 = ライトレッド
  //     1002 = イエロー
  //     1003 = ピュアグリーン
  //     1004 = ブライトブルー
  //     1005 = ライトブルー
  //     1006 = ライトグレー
  TouchNoteColor = 205,
  // Web UI: チェインノーツの色
  // Web UI Description: チェインノーツの色を設定できます。
  // Value:
  //     5 = ライトマゼンタ
  //     6 = ライトイエロー
  //     4 = オレンジ
  //     3 = ライム
  //     1 = レッド
  //     2 = スカイブルー
  //     7 = ダークイエロー
  //     1001 = ライトレッド
  //     1002 = イエロー
  //     1003 = ピュアグリーン
  //     1004 = ブライトブルー
  //     1005 = ライトブルー
  //     1006 = ライトグレー
  ChainNoteColor = 206,
  // Web UI: ホールドノーツの色
  // Web UI Description: ホールドノーツの色を設定できます。
  // Value:
  //     5 = ライトマゼンタ
  //     6 = ライトイエロー
  //     4 = オレンジ
  //     3 = ライム
  //     1 = レッド
  //     2 = スカイブルー
  //     7 = ダークイエロー
  //     1001 = ライトレッド
  //     1002 = イエロー
  //     1003 = ピュアグリーン
  //     1004 = ブライトブルー
  //     1005 = ライトブルー
  //     1006 = ライトグレー
  HoldNoteColor = 207,
  // マスタボリューム
  MasterVolume = 1001,
  // セット中 プリセット称号ID
  TitleId = 1002,
  // セット中 アイコンID
  IconId = 1003,
  // セット中 ナビキャラクターID
  NavigatorCharacterId = 1004,
  // セット中 ユーザープレートID
  PlateBackgroundId = 1005,
  // Web UI: タッチエフェクト(ポップ)
  // Value:
  //     312000 = OFF
  //     312001 = デフォルト
  TouchEffectPop = 1006
}
