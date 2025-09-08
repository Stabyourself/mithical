const waccaTitles = [
  {
    "id": 104001,
    "name": "ゲスト  ",
    "acquisition": "最初から所持",
    "acquisitionEnglish": "Obtained from the beginning."
  },
  {
    "id": 104002,
    "name": "ＷＡＣＣＡ  はじめました",
    "acquisition": "最初から所持",
    "acquisitionEnglish": "Obtained from the beginning."
  },
  {
    "id": 104003,
    "name": "ウェルカム トゥ ワッカ！",
    "acquisition": "最初から所持",
    "acquisitionEnglish": "Obtained from the beginning."
  },
  {
    "id": 104004,
    "name": "準備  満タンです",
    "acquisition": "ａｒａｎ楽曲を\r\n１００回クリア",
    "acquisitionEnglish": "Clear the song\r\naran 100 times."
  },
  {
    "id": 104005,
    "name": "マルチプレイ  誘ってください",
    "acquisition": "最初から所持",
    "acquisitionEnglish": "Obtained from the beginning."
  },
  {
    "id": 104006,
    "name": "ＳＳ以上 が マジのクリア",
    "acquisition": "難易度ＥＸＰＥＲＴで\r\nレートＳＳ以上を３０回達成",
    "acquisitionEnglish": "Achieve Rank SS 30\r\ntimes on EXPERT or above."
  },
  {
    "id": 104007,
    "name": "ＳＳＳ しか 認めない",
    "acquisition": "難易度ＥＸＰＥＲＴで\r\nレートＳＳＳ以上を３０回達成",
    "acquisitionEnglish": "Achieve Rank SSS 30\r\ntimes on EXPERT or above."
  },
  {
    "id": 104009,
    "name": "永久  機関",
    "acquisition": "プレイヤーレベルを\r\n１００にする",
    "acquisitionEnglish": "Reach Player Level\r\n100."
  },
  {
    "id": 104011,
    "name": "君ワッカ  うまいねぇ",
    "acquisition": "ALL Marvelousを\r\n達成",
    "acquisitionEnglish": "Achieve\r\nALL Marvelous."
  },
  {
    "id": 104012,
    "name": "初めて の フルコンボ",
    "acquisition": "Full Comboを\r\n達成",
    "acquisitionEnglish": "Achieve a\r\nFull Combo."
  },
  {
    "id": 104013,
    "name": "もうちょい  あと一歩",
    "acquisition": "Misslessを\r\n達成",
    "acquisitionEnglish": "Achieve\r\nMissless."
  },
  {
    "id": 104014,
    "name": "私のレベル は …１０だ！",
    "acquisition": "プレイヤーレベルを\r\n１０にする",
    "acquisitionEnglish": "Reach Player Level\r\n10."
  },
  {
    "id": 104015,
    "name": "ボカロ  愛好家",
    "acquisition": "ボカロ楽曲を３０回プレイ",
    "acquisitionEnglish": "Play Vocaloid songs 30 times."
  },
  {
    "id": 104016,
    "name": "アニソン  オタク",
    "acquisition": "アニメ／ＰＯＰ楽曲を３０回プレイ",
    "acquisitionEnglish": "Play Anime/Pop songs 30 times."
  },
  {
    "id": 104017,
    "name": "２．５次元  大好き",
    "acquisition": "２．５次元楽曲を５回プレイ",
    "acquisitionEnglish": "Play 2.5D Musical songs 5 times."
  },
  {
    "id": 104018,
    "name": "ハードコア  タノシー",
    "acquisition": "HARDCORE TANO*C楽曲を\r\n３０回プレイ",
    "acquisitionEnglish": "Play HARDCORE TANO*C\r\nsongs 30 times."
  },
  {
    "id": 104019,
    "name": "ボカロ  マイスター",
    "acquisition": "ボカロ楽曲を\r\nレートＳ以上で５０回達成",
    "acquisitionEnglish": "Achieve Rank S or higher on\r\nVocaloid songs 50 times."
  },
  {
    "id": 104020,
    "name": "十分 に 強い",
    "acquisition": "プレイヤーレベルを\r\n２００にする",
    "acquisitionEnglish": "Reach Player Level\r\n200."
  },
  {
    "id": 104021,
    "name": "俺たち の 舞台！",
    "acquisition": "２．５次元楽曲を\r\nレートＳ以上で１０回達成",
    "acquisitionEnglish": "Achieve Rank S or higher on\r\n2.5D Musical songs 10 times."
  },
  {
    "id": 104022,
    "name": "ＲＥＤＡＬｉＣＥ  ファン",
    "acquisition": "ＲＥＤＡＬｉＣＥ楽曲を\r\n３０回クリア",
    "acquisitionEnglish": "Clear REDALiCE\r\nsongs 30 times."
  },
  {
    "id": 104023,
    "name": "ｔ＋ｐａｚｏｌｉｔｅ  ファミリー",
    "acquisition": "ｔ＋ｐａｚｏｌｉｔｅ楽曲を\r\n３０回クリア",
    "acquisitionEnglish": "Clear t+pazolite\r\nsongs 30 times."
  },
  {
    "id": 104024,
    "name": "ＵＳＡＯ  兄貴",
    "acquisition": "ＵＳＡＯ楽曲を\r\n３０回クリア",
    "acquisitionEnglish": "Clear USAO\r\nsongs 30 times."
  },
  {
    "id": 104025,
    "name": "Ｐ＊Ｌｉｇｈｔ は 家族",
    "acquisition": "Ｐ＊Ｌｉｇｈｔ楽曲を\r\n３０回クリア",
    "acquisitionEnglish": "Clear P*Light\r\nsongs 30 times."
  },
  {
    "id": 104026,
    "name": "ＤＪ　Ｇｅｎｋｉ は 仲間",
    "acquisition": "ＤＪ　Ｇｅｎｋｉ楽曲を\r\n３０回クリア",
    "acquisitionEnglish": "Clear DJ Genki\r\nsongs 30 times."
  },
  {
    "id": 104027,
    "name": "ＤＪ　Ｎｏｒｉｋｅｎ  軍団",
    "acquisition": "ＤＪ　Ｎｏｒｉｋｅｎ楽曲を\r\n３０回クリア",
    "acquisitionEnglish": "Clear DJ Noriken\r\nsongs 30 times."
  },
  {
    "id": 104028,
    "name": "ＭＮＫ  メンバー",
    "acquisition": "Ｍａｓｓｉｖｅ Ｎｅｗ Ｋｒｅｗ楽曲を\r\n３０回クリア",
    "acquisitionEnglish": "Clear Massive New Krew\r\nsongs 30 times."
  },
  {
    "id": 104029,
    "name": "ＤＪ　Ｍｙｏｓｕｋｅ  兄弟",
    "acquisition": "ＤＪ　Ｍｙｏｓｕｋｅ楽曲を\r\n３０回クリア",
    "acquisitionEnglish": "Clear DJ Myosuke\r\nsongs 30 times."
  },
  {
    "id": 104030,
    "name": "Ｋｏｂａｒｙｏ  推し",
    "acquisition": "Ｋｏｂａｒｙｏ楽曲を\r\n３０回クリア",
    "acquisitionEnglish": "Clear Kobaryo\r\nsongs 30 times."
  },
  {
    "id": 104031,
    "name": "ａｒａｎ は ダチ",
    "acquisition": "ａｒａｎ楽曲を\r\n３０回クリア",
    "acquisitionEnglish": "Clear aran\r\nsongs 30 times."
  },
  {
    "id": 104032,
    "name": "源屋  フレンズ",
    "acquisition": "源屋楽曲を\r\n３０回クリア",
    "acquisitionEnglish": "Clear Minamotoya\r\nsongs 30 times."
  },
  {
    "id": 104035,
    "name": "Ｓｒａｖ３Ｒ  先生",
    "acquisition": "Ｓｒａｖ３Ｒ楽曲を\r\n３０回クリア",
    "acquisitionEnglish": "Clear Srav3R\r\nsongs 30 times."
  },
  {
    "id": 104036,
    "name": "Ｇｅｔｔｙ  家",
    "acquisition": "Ｇｅｔｔｙ楽曲を\r\n３０回クリア",
    "acquisitionEnglish": "Clear Getty\r\nsongs 30 times."
  },
  {
    "id": 104037,
    "name": "Ｌａｕｒ  信者",
    "acquisition": "Ｌａｕｒ楽曲を\r\n３０回クリア",
    "acquisitionEnglish": "Clear Laur\r\nsongs 30 times."
  },
  {
    "id": 104038,
    "name": "ＰＯＰ  プレイヤー",
    "acquisition": "アニメ／ＰＯＰ楽曲を\r\nレートＳ以上で５０回達成",
    "acquisitionEnglish": "Achieve Rank S or better on\r\nAnime/Pop songs 50 times."
  },
  {
    "id": 104049,
    "name": "強いやつ に 会いに来た",
    "acquisition": "マルチプレイ(対戦)を１回プレイ",
    "acquisitionEnglish": "Play multiplayer (VS) one time."
  },
  {
    "id": 104050,
    "name": "平和  主義者",
    "acquisition": "マルチプレイ(協力)を１回プレイ",
    "acquisitionEnglish": "Play multiplayer (co-op) 1 time."
  },
  {
    "id": 104051,
    "name": "この体 にも なじんできた",
    "acquisition": "難易度ＮＯＲＭＡＬ以上で\r\n１５回プレイ",
    "acquisitionEnglish": "Play on NORMAL or higher\r\ndifficulty 15 times."
  },
  {
    "id": 104052,
    "name": "ボク ちょっと 強いかも",
    "acquisition": "プレイヤーレベルを\r\n３０にする",
    "acquisitionEnglish": "Reach Player Level\r\n30."
  },
  {
    "id": 104053,
    "name": "素人 は 黙っとれ",
    "acquisition": "プレイヤーレベルを\r\n５０にする",
    "acquisitionEnglish": "Reach Player Level\r\n50."
  },
  {
    "id": 104054,
    "name": "俺たちの戦い は 始まったばかりだ",
    "acquisition": "難易度ＨＡＲＤ以上で９０回プレイ",
    "acquisitionEnglish": "Play on HARD or higher\r\ndifficulty 90 times."
  },
  {
    "id": 104055,
    "name": "アクセサリー  マニア",
    "acquisition": "５つ以上のアイコンを使用してプレイ",
    "acquisitionEnglish": "Play using 5 or more icons."
  },
  {
    "id": 104056,
    "name": "スピード  狂",
    "acquisition": "すごく速い楽曲を\r\n５０回プレイ",
    "acquisitionEnglish": "Play very fast\r\nsongs 50 times."
  },
  {
    "id": 104057,
    "name": "飽きるまで  粘着",
    "acquisition": "１０回連続で、同一楽曲をプレイ",
    "acquisitionEnglish": "Play the same song 10 times in a row."
  },
  {
    "id": 104058,
    "name": "早よ  決めて",
    "acquisition": "楽曲を５回以上選びなおしてからプレイ",
    "acquisitionEnglish": "Reselect a song 5 times before starting."
  },
  {
    "id": 104059,
    "name": "くぅ～  疲れましたｗ",
    "acquisition": "難易度ＥＸＰＥＲＴで\r\n３００回プレイ",
    "acquisitionEnglish": "Play on EXPERT\r\ndifficulty 300 times."
  },
  {
    "id": 104061,
    "name": "「Ｓ」以上 が ホントのクリア",
    "acquisition": "難易度ＨＡＲＤ以上で\r\nレートＳ以上を１００回達成",
    "acquisitionEnglish": "Achieve Rank S or better\r\n100 times on HARD or above."
  },
  {
    "id": 104062,
    "name": "精度 の 鬼",
    "acquisition": "難易度ＥＸＰＥＲＴで\r\nALL Marvelousを\r\n１０回達成",
    "acquisitionEnglish": "Achieve ALL Marvelous\r\non EXPERT difficulty\r\n10 times."
  },
  {
    "id": 104064,
    "name": "ヾ(ﾟДﾟ)ノ ＜ ハードコアタノシー",
    "acquisition": "HARDCORE TANO*C楽曲を\r\n２００回クリア",
    "acquisitionEnglish": "Clear HARDCORE TANO*C\r\nsongs 200 times."
  },
  {
    "id": 104069,
    "name": "お年  玉！！",
    "acquisition": "１月１日プレイで獲得",
    "acquisitionEnglish": "Play on January 1st."
  },
  {
    "id": 104070,
    "name": "お豆  まき",
    "acquisition": "２月３日プレイで獲得",
    "acquisitionEnglish": "Play on February 3rd."
  },
  {
    "id": 104071,
    "name": "チョコ など いらん！",
    "acquisition": "２月１４日プレイで獲得",
    "acquisitionEnglish": "Play on February 14th."
  },
  {
    "id": 104072,
    "name": "ひな  祭り",
    "acquisition": "３月３日プレイで獲得",
    "acquisitionEnglish": "Play on March 3rd."
  },
  {
    "id": 104073,
    "name": "うそはうそであると見抜ける人でないと (WACCAを使うのは) 難しい",
    "acquisition": "４月１日プレイで獲得",
    "acquisitionEnglish": "Play on April 1st."
  },
  {
    "id": 104074,
    "name": "ゴールド  ラッシュ",
    "acquisition": "４月２９日～５月５日プレイで獲得",
    "acquisitionEnglish": "Play between\r\nApril 29th and May 5th."
  },
  {
    "id": 104075,
    "name": "七夕  （笑）",
    "acquisition": "７月７日プレイで獲得",
    "acquisitionEnglish": "Play on July 7th."
  },
  {
    "id": 104076,
    "name": "百鬼  夜行",
    "acquisition": "１０月３１日プレイで獲得",
    "acquisitionEnglish": "Play on October 31st."
  },
  {
    "id": 104077,
    "name": "クリスマス は 予定なし",
    "acquisition": "１２月２４日～１２月２５日\r\nプレイで獲得",
    "acquisitionEnglish": "Play between\r\nDecember 24th and December 31."
  },
  {
    "id": 104078,
    "name": "北海道 といえば じゃがいも",
    "acquisition": "上記地方店舗プレイで獲得",
    "acquisitionEnglish": "Play at the above store location."
  },
  {
    "id": 104079,
    "name": "青森県 といえば りんご",
    "acquisition": "上記地方店舗プレイで獲得",
    "acquisitionEnglish": "Play at the above store location."
  },
  {
    "id": 104080,
    "name": "岩手県 といえば わんこそば",
    "acquisition": "上記地方店舗プレイで獲得",
    "acquisitionEnglish": "Play at the above store location."
  },
  {
    "id": 104081,
    "name": "宮城県 といえば 牛タン",
    "acquisition": "上記地方店舗プレイで獲得",
    "acquisitionEnglish": "Play at the above store location."
  },
  {
    "id": 104082,
    "name": "秋田県 といえば きりたんぽ",
    "acquisition": "上記地方店舗プレイで獲得",
    "acquisitionEnglish": "Play at the above store location."
  },
  {
    "id": 104083,
    "name": "山形県 といえば いも煮",
    "acquisition": "上記地方店舗プレイで獲得",
    "acquisitionEnglish": "Play at the above store location."
  },
  {
    "id": 104084,
    "name": "福島県 といえば ズワイガニ",
    "acquisition": "上記地方店舗プレイで獲得",
    "acquisitionEnglish": "Play at the above store location."
  },
  {
    "id": 104085,
    "name": "茨城県 といえば 納豆",
    "acquisition": "上記地方店舗プレイで獲得",
    "acquisitionEnglish": "Play at the above store location."
  },
  {
    "id": 104086,
    "name": "栃木県 といえば ギョウザ",
    "acquisition": "上記地方店舗プレイで獲得",
    "acquisitionEnglish": "Play at the above store location."
  },
  {
    "id": 104087,
    "name": "群馬県 といえば こんにゃく",
    "acquisition": "上記地方店舗プレイで獲得",
    "acquisitionEnglish": "Play at the above store location."
  },
  {
    "id": 104088,
    "name": "埼玉県 といえば ネギ",
    "acquisition": "上記地方店舗プレイで獲得",
    "acquisitionEnglish": "Play at the above store location."
  },
  {
    "id": 104089,
    "name": "千葉県 といえば ピーナッツ",
    "acquisition": "上記地方店舗プレイで獲得",
    "acquisitionEnglish": "Play at the above store location."
  },
  {
    "id": 104090,
    "name": "東京都 といえば もんじゃ",
    "acquisition": "上記地方店舗プレイで獲得",
    "acquisitionEnglish": "Play at the above store location."
  },
  {
    "id": 104091,
    "name": "神奈川県 といえば かまぼこ",
    "acquisition": "上記地方店舗プレイで獲得",
    "acquisitionEnglish": "Play at the above store location."
  },
  {
    "id": 104092,
    "name": "新潟県 といえば こしひかり",
    "acquisition": "上記地方店舗プレイで獲得",
    "acquisitionEnglish": "Play at the above store location."
  },
  {
    "id": 104093,
    "name": "富山県 といえば 白エビ",
    "acquisition": "上記地方店舗プレイで獲得",
    "acquisitionEnglish": "Play at the above store location."
  },
  {
    "id": 104094,
    "name": "石川県 といえば 寒ブリ",
    "acquisition": "上記地方店舗プレイで獲得",
    "acquisitionEnglish": "Play at the above store location."
  },
  {
    "id": 104095,
    "name": "福井県 といえば 水ようかん",
    "acquisition": "上記地方店舗プレイで獲得",
    "acquisitionEnglish": "Play at the above store location."
  },
  {
    "id": 104096,
    "name": "山梨県 といえば ほうとう",
    "acquisition": "上記地方店舗プレイで獲得",
    "acquisitionEnglish": "Play at the above store location."
  },
  {
    "id": 104097,
    "name": "長野県 といえば 信州そば",
    "acquisition": "上記地方店舗プレイで獲得",
    "acquisitionEnglish": "Play at the above store location."
  },
  {
    "id": 104098,
    "name": "岐阜県 といえば 赤かぶ",
    "acquisition": "上記地方店舗プレイで獲得",
    "acquisitionEnglish": "Play at the above store location."
  },
  {
    "id": 104099,
    "name": "静岡県 といえば お茶",
    "acquisition": "上記地方店舗プレイで獲得",
    "acquisitionEnglish": "Play at the above store location."
  },
  {
    "id": 104100,
    "name": "愛知県 といえば 味噌カツ",
    "acquisition": "上記地方店舗プレイで獲得",
    "acquisitionEnglish": "Play at the above store location."
  },
  {
    "id": 104101,
    "name": "三重県 といえば 伊勢海老",
    "acquisition": "上記地方店舗プレイで獲得",
    "acquisitionEnglish": "Play at the above store location."
  },
  {
    "id": 104102,
    "name": "滋賀県 といえば 鮒寿司",
    "acquisition": "上記地方店舗プレイで獲得",
    "acquisitionEnglish": "Play at the above store location."
  },
  {
    "id": 104103,
    "name": "京都府 といえば 八つ橋",
    "acquisition": "上記地方店舗プレイで獲得",
    "acquisitionEnglish": "Play at the above store location."
  },
  {
    "id": 104104,
    "name": "大阪府 といえば たこやき",
    "acquisition": "上記地方店舗プレイで獲得",
    "acquisitionEnglish": "Play at the above store location."
  },
  {
    "id": 104105,
    "name": "兵庫県 といえば 神戸牛",
    "acquisition": "上記地方店舗プレイで獲得",
    "acquisitionEnglish": "Play at the above store location."
  },
  {
    "id": 104106,
    "name": "奈良県 といえば 奈良漬け",
    "acquisition": "上記地方店舗プレイで獲得",
    "acquisitionEnglish": "Play at the above store location."
  },
  {
    "id": 104107,
    "name": "和歌山県 といえば はっさく",
    "acquisition": "上記地方店舗プレイで獲得",
    "acquisitionEnglish": "Play at the above store location."
  },
  {
    "id": 104108,
    "name": "鳥取県 といえば 梨",
    "acquisition": "上記地方店舗プレイで獲得",
    "acquisitionEnglish": "Play at the above store location."
  },
  {
    "id": 104109,
    "name": "島根県 といえば 出雲そば",
    "acquisition": "上記地方店舗プレイで獲得",
    "acquisitionEnglish": "Play at the above store location."
  },
  {
    "id": 104110,
    "name": "岡山県 といえば きびだんご",
    "acquisition": "上記地方店舗プレイで獲得",
    "acquisitionEnglish": "Play at the above store location."
  },
  {
    "id": 104111,
    "name": "広島県 といえば 尾道ラーメン",
    "acquisition": "上記地方店舗プレイで獲得",
    "acquisitionEnglish": "Play at the above store location."
  },
  {
    "id": 104112,
    "name": "山口県 といえば レンコン",
    "acquisition": "上記地方店舗プレイで獲得",
    "acquisitionEnglish": "Play at the above store location."
  },
  {
    "id": 104113,
    "name": "徳島県 といえば すだち",
    "acquisition": "上記地方店舗プレイで獲得",
    "acquisitionEnglish": "Play at the above store location."
  },
  {
    "id": 104114,
    "name": "香川県 といえば うどん",
    "acquisition": "上記地方店舗プレイで獲得",
    "acquisitionEnglish": "Play at the above store location."
  },
  {
    "id": 104115,
    "name": "愛媛県 といえば みかん",
    "acquisition": "上記地方店舗プレイで獲得",
    "acquisitionEnglish": "Play at the above store location."
  },
  {
    "id": 104116,
    "name": "高知県 といえば かつお節",
    "acquisition": "上記地方店舗プレイで獲得",
    "acquisitionEnglish": "Play at the above store location."
  },
  {
    "id": 104117,
    "name": "福岡県 といえば 博多ラーメン",
    "acquisition": "上記地方店舗プレイで獲得",
    "acquisitionEnglish": "Play at the above store location."
  },
  {
    "id": 104118,
    "name": "佐賀県 といえば 海苔",
    "acquisition": "上記地方店舗プレイで獲得",
    "acquisitionEnglish": "Play at the above store location."
  },
  {
    "id": 104119,
    "name": "長崎県 といえば ちゃんぽん",
    "acquisition": "上記地方店舗プレイで獲得",
    "acquisitionEnglish": "Play at the above store location."
  },
  {
    "id": 104120,
    "name": "熊本県 といえば 赤なす",
    "acquisition": "上記地方店舗プレイで獲得",
    "acquisitionEnglish": "Play at the above store location."
  },
  {
    "id": 104121,
    "name": "大分県 といえば かぼちゃ",
    "acquisition": "上記地方店舗プレイで獲得",
    "acquisitionEnglish": "Play at the above store location."
  },
  {
    "id": 104122,
    "name": "宮崎県 といえば マンゴー",
    "acquisition": "上記地方店舗プレイで獲得",
    "acquisitionEnglish": "Play at the above store location."
  },
  {
    "id": 104123,
    "name": "鹿児島県 といえば さつまあげ",
    "acquisition": "上記地方店舗プレイで獲得",
    "acquisitionEnglish": "Play at the above store location."
  },
  {
    "id": 104124,
    "name": "沖縄県 といえば ルートビア",
    "acquisition": "上記地方店舗プレイで獲得",
    "acquisitionEnglish": "Play at the above store location."
  },
  {
    "id": 104125,
    "name": "北海道  君主！",
    "acquisition": "北海道 店舗プレイで獲得",
    "acquisitionEnglish": "Play at a store in Hokkaido."
  },
  {
    "id": 104126,
    "name": "東北  王子！",
    "acquisition": "青森県 岩手県 秋田県\r\n宮城県 山形県 福島県\r\n全地域プレイで獲得",
    "acquisitionEnglish": "Play in one of the following prefectures:\r\nAomori, Iwate, Akita,\r\nMiyagi, Yamagata, Fukushima"
  },
  {
    "id": 104127,
    "name": "関東  制覇！",
    "acquisition": "茨城県 栃木県 群馬県 埼玉県\r\n千葉県 東京都 神奈川県\r\n全地域プレイで獲得",
    "acquisitionEnglish": "Play in one of the following prefectures:\r\nIbaraki, Tochigi, Gunma, Saitama,\r\nChiba, Tokyo, Kanagawa"
  },
  {
    "id": 104128,
    "name": "中部  討伐！",
    "acquisition": "山梨県 長野県 新潟県 富山県 石川県\r\n福井県 静岡県 愛知県 岐阜県 三重県\r\n全地域プレイで獲得",
    "acquisitionEnglish": "Play in one of the following prefectures:\r\nYamanashi, Nagano, Niigata, Toyama, Ishikawa,\r\nFukui, Shizuoka, Aichi, Gifu, Mie"
  },
  {
    "id": 104129,
    "name": "近畿  大名！",
    "acquisition": "滋賀県 京都府 大阪府\r\n兵庫県 奈良県 和歌山県\r\n全地域プレイで獲得",
    "acquisitionEnglish": "Play in one of the following prefectures:\r\nShiga, Kyoto, Osaka,\r\nHyogo, Nara, Wakayama"
  },
  {
    "id": 104130,
    "name": "中国  覇者！",
    "acquisition": "鳥取県 島根県 岡山県\r\n広島県 山口県\r\n全地域プレイで獲得",
    "acquisitionEnglish": "Play in one of the following prefectures:\r\nTottori, Shimane, Okayama,\r\nHiroshima, Yamaguchi"
  },
  {
    "id": 104131,
    "name": "四国  魔王！",
    "acquisition": "香川県 愛媛県 徳島県 高知県\r\n全地域プレイで獲得",
    "acquisitionEnglish": "Play in one of the following prefectures:\r\nKagawa, Ehime, Tokushima, Kochi"
  },
  {
    "id": 104132,
    "name": "九州  帝王！",
    "acquisition": "福岡県 佐賀県 長崎県 熊本県\r\n大分県 宮崎県 鹿児島県\r\n全地域プレイで獲得",
    "acquisitionEnglish": "Play in one of the following prefectures:\r\nFukuoka, Saga, Nagasaki, Kumamoto,\r\nOita, Miyazaki, Kagoshima"
  },
  {
    "id": 104133,
    "name": "沖縄  統一！",
    "acquisition": "沖縄県 店舗プレイで獲得",
    "acquisitionEnglish": "Play in Okinawa."
  },
  {
    "id": 104134,
    "name": "全クリ  しました",
    "acquisition": "全都道府県プレイで獲得",
    "acquisitionEnglish": "Play in every prefecture in Japan!"
  },
  {
    "id": 104135,
    "name": "ついに  始まる…",
    "acquisition": "先行無料体験会参加特典",
    "acquisitionEnglish": "Early demo participation reward."
  },
  {
    "id": 104136,
    "name": "サントラ には 目がない",
    "acquisition": "稼働記念サントラCDゲットキャンペーン\r\n期間中に３０回プレイする",
    "acquisitionEnglish": "Commemorative OST CD Campaign\r\nPlay 30 times during the campaign."
  },
  {
    "id": 104137,
    "name": "アビバビジャッパ  ",
    "acquisition": "｢こんにちは、ARuFaです。｣\r\n｢ぼくの夢、メチャクソ無限湧き｣\r\n｢さんさーら！｣\r\nのアイコンを全て獲得する",
    "acquisitionEnglish": "Acquire the icons:\r\n\"Hello, I am ARuFa.\"\r\n\"My dreams were totally crushed!\"\r\n\"Samsara!\""
  },
  {
    "id": 104138,
    "name": "君 とならば Ever…",
    "acquisition": "アルティメット・タノシー!!!!!!!!!!\r\n開催中にプレイで獲得",
    "acquisitionEnglish": "ULTIMATE TANO*C!!!!!!\r\nPlay during the event."
  },
  {
    "id": 104139,
    "name": "一本  デカい！",
    "acquisition": "アルティメット・タノシー!!!!!!!!!!\r\n開催中にHARDCORE TANO*C楽曲を\r\n１０回プレイで獲得",
    "acquisitionEnglish": "ULTIMATE TANO*C!!!!!!\r\nPlay HARDCORE TANO*C songs\r\n10 times during the event."
  },
  {
    "id": 104140,
    "name": "世界、滲ますな！  滲まんのかーい！",
    "acquisition": "アルティメット・タノシー!!!!!!!!!!\r\n開催中にHARDCORE TANO*C楽曲で\r\nFull Comboを達成で獲得",
    "acquisitionEnglish": "ULTIMATE TANO*C!!!!!!\r\nGet a Full Combo on a HARDCORE \r\nTANO*C song during the event."
  },
  {
    "id": 104141,
    "name": "アモアモ アモアモ アアモオジィｫﾞｵﾞｨ",
    "acquisition": "アルティメット・タノシー!!!!!!!!!!\r\n開催中に「４４４４ＷＰ」を\r\n取得すると獲得",
    "acquisitionEnglish": "ULTIMATE TANO*C!!!!!!\r\nAcquire \"4444WP\" during\r\nthe event."
  },
  {
    "id": 104142,
    "name": "これがタノシー の やり方か～",
    "acquisition": "アルティメット・タノシー!!!!!!!!!!\r\n開催中にHARDCORE TANO*C楽曲で\r\nＳＳＳ以上を１０回達成で獲得",
    "acquisitionEnglish": "ULTIMATE TANO*C!!!!!!\r\nClear HARDCORE TANO*C songs with SSS\r\nhigher 10 times during the event."
  },
  {
    "id": 104143,
    "name": "タノシー は いいぞ",
    "acquisition": "「TANO*C FES」来場特典",
    "acquisitionEnglish": "\"TANO*C FES\" Attendance Reward"
  },
  {
    "id": 104144,
    "name": "幻想郷 の 住人",
    "acquisition": "「東方Project × WACCA」\r\n「東方風神録 × WACCA」リニューアル\r\nイベント報酬",
    "acquisitionEnglish": "\"Touhou Project X WACCA\"\r\n\"Touhou: Mountain of Faith X WACCA\"\r\nRenewal Event reward."
  },
  {
    "id": 104145,
    "name": "円を描く  程度の能力",
    "acquisition": "「東方Project × WACCA」\r\n「東方風神録 × WACCA」リニューアル\r\nイベント報酬",
    "acquisitionEnglish": "\"Touhou Project X WACCA\"\r\n\"Touhou: Mountain of Faith X WACCA\"\r\nRenewal Event reward."
  },
  {
    "id": 104146,
    "name": "インテリジェント な スーパーＡＩ",
    "acquisition": "「Kizuna AI × WACCA」イベント\r\n開催中に\r\nスコアを累計1,000,000獲得する",
    "acquisitionEnglish": "Earn a cumulative score of\r\n1,000,000 during the\r\n\"Kizuna AI X WACCA\" Event."
  },
  {
    "id": 104147,
    "name": "すごい。 これぞ シンギュラリティ。",
    "acquisition": "「Kizuna AI × WACCA」イベント\r\n開催中に\r\nスコアを累計15,000,000獲得する",
    "acquisitionEnglish": "Earn a cumulative score of\r\n15,000,000 during the\r\n\"Kizuna AI X WACCA\" Event."
  },
  {
    "id": 104148,
    "name": "走るんだよ！！  おじじ！！",
    "acquisition": "「Kizuna AI × WACCA」イベント\r\n開催中に\r\nスコアを累計20,000,000獲得する",
    "acquisitionEnglish": "Earn a cumulative score of\r\n20,000,000 during the\r\n\"Kizuna AI X WACCA\" Event."
  },
  {
    "id": 104149,
    "name": "WACCA S ステージI  クリア！",
    "acquisition": "WACCA S\r\nステージアップ\r\nステージ I をクリアする",
    "acquisitionEnglish": "WACCA S\r\nStage Up\r\nClear Stage I"
  },
  {
    "id": 104150,
    "name": "WACCA S ステージII  クリア！",
    "acquisition": "WACCA S\r\nステージアップ\r\nステージ II をクリアする",
    "acquisitionEnglish": "WACCA S\r\nStage Up\r\nClear Stage II"
  },
  {
    "id": 104151,
    "name": "WACCA S ステージIII  クリア！",
    "acquisition": "WACCA S\r\nステージアップ\r\nステージ III をクリアする",
    "acquisitionEnglish": "WACCA S\r\nStage Up\r\nClear Stage III"
  },
  {
    "id": 104152,
    "name": "WACCA S ステージIV  クリア！",
    "acquisition": "WACCA S\r\nステージアップ\r\nステージ IV をクリアする",
    "acquisitionEnglish": "WACCA S\r\nStage Up\r\nClear Stage IV"
  },
  {
    "id": 104153,
    "name": "WACCA S ステージV  クリア！",
    "acquisition": "WACCA S\r\nステージアップ\r\nステージ V をクリアする",
    "acquisitionEnglish": "WACCA S\r\nStage Up\r\nClear Stage V"
  },
  {
    "id": 104154,
    "name": "WACCA S ステージVI  クリア！",
    "acquisition": "WACCA S\r\nステージアップ\r\nステージ VI をクリアする",
    "acquisitionEnglish": "WACCA S\r\nStage Up\r\nClear Stage VI"
  },
  {
    "id": 104155,
    "name": "WACCA S ステージVII  クリア！",
    "acquisition": "WACCA S\r\nステージアップ\r\nステージ VII をクリアする",
    "acquisitionEnglish": "WACCA S\r\nStage Up\r\nClear Stage VII"
  },
  {
    "id": 104156,
    "name": "WACCA S ステージVIII  クリア！",
    "acquisition": "WACCA S\r\nステージアップ\r\nステージ VIII をクリアする",
    "acquisitionEnglish": "WACCA S\r\nStage Up\r\nClear Stage VIII"
  },
  {
    "id": 104157,
    "name": "WACCA S ステージIX  クリア！",
    "acquisition": "WACCA S\r\nステージアップ\r\nステージ IX をクリアする",
    "acquisitionEnglish": "WACCA S\r\nStage Up\r\nClear Stage IX"
  },
  {
    "id": 104158,
    "name": "WACCA S ステージX  クリア！",
    "acquisition": "WACCA S\r\nステージアップ\r\nステージ X をクリアする",
    "acquisitionEnglish": "WACCA S\r\nStage Up\r\nClear Stage X"
  },
  {
    "id": 104159,
    "name": "WACCA S ステージXI  クリア！",
    "acquisition": "WACCA S\r\nステージアップ\r\nステージ XI をクリアする",
    "acquisitionEnglish": "WACCA S\r\nStage Up\r\nClear Stage XI"
  },
  {
    "id": 104160,
    "name": "WACCA S ステージXII  クリア！",
    "acquisition": "WACCA S\r\nステージアップ\r\nステージ XII をクリアする",
    "acquisitionEnglish": "WACCA S\r\nStage Up\r\nClear Stage XII"
  },
  {
    "id": 104161,
    "name": "WACCA S ステージXIII  クリア！",
    "acquisition": "WACCA S\r\nステージアップ\r\nステージ XIII をクリアする",
    "acquisitionEnglish": "WACCA S\r\nStage Up\r\nClear Stage XIII"
  },
  {
    "id": 104162,
    "name": "ＷＡＣＣＡ　Ｓ  はじめました",
    "acquisition": "｢WACCA S ゲート｣\r\n達成報酬",
    "acquisitionEnglish": "\"WACCA S Gate\"\r\nachievement reward."
  },
  {
    "id": 104163,
    "name": "オープン ザ ゲート",
    "acquisition": "｢WACCA S ゲート｣\r\n達成報酬",
    "acquisitionEnglish": "\"WACCA S Gate\"\r\nachievement reward."
  },
  {
    "id": 104164,
    "name": "今日 も 今日とて",
    "acquisition": "｢WACCA S ゲート｣\r\n達成報酬",
    "acquisitionEnglish": "\"WACCA S Gate\"\r\nachievement reward."
  },
  {
    "id": 104165,
    "name": "初陣 は 大成功",
    "acquisition": "｢WACCA S ゲート｣\r\n達成報酬",
    "acquisitionEnglish": "\"WACCA S Gate\"\r\nachievement reward."
  },
  {
    "id": 104166,
    "name": "おれたちの戦い は これからだ！",
    "acquisition": "｢WACCA S ゲート｣\r\n達成報酬",
    "acquisitionEnglish": "\"WACCA S Gate\"\r\nachievement reward."
  },
  {
    "id": 104167,
    "name": "ネクスト  ステージ",
    "acquisition": "｢WACCA S ゲート｣\r\n達成報酬",
    "acquisitionEnglish": "\"WACCA S Gate\"\r\nachievement reward."
  },
  {
    "id": 104168,
    "name": "ワッカ  エス",
    "acquisition": "｢WACCA S ゲート｣\r\n達成報酬",
    "acquisitionEnglish": "\"WACCA S Gate\"\r\nachievement reward."
  },
  {
    "id": 104169,
    "name": "ワッカ  サバイバー",
    "acquisition": "｢WACCA S ゲート｣\r\n達成報酬",
    "acquisitionEnglish": "\"WACCA S Gate\"\r\nachievement reward."
  },
  {
    "id": 104170,
    "name": "ワッカ は スピリッツ",
    "acquisition": "｢WACCA S ゲート｣\r\n達成報酬",
    "acquisitionEnglish": "\"WACCA S Gate\"\r\nachievement reward."
  },
  {
    "id": 104171,
    "name": "ワッカ  シンドローム",
    "acquisition": "｢WACCA S ゲート｣\r\n達成報酬",
    "acquisitionEnglish": "\"WACCA S Gate\"\r\nachievement reward."
  },
  {
    "id": 104172,
    "name": "スーパー  スター",
    "acquisition": "｢WACCA S ゲート｣\r\n達成報酬",
    "acquisitionEnglish": "\"WACCA S Gate\"\r\nachievement reward."
  },
  {
    "id": 104173,
    "name": "エスプレッソ  マシン",
    "acquisition": "｢WACCA S ゲート｣\r\n達成報酬",
    "acquisitionEnglish": "\"WACCA S Gate\"\r\nachievement reward."
  },
  {
    "id": 104174,
    "name": "ＷＡＣＣＡ  ガチ勢",
    "acquisition": "｢WACCA S ゲート｣\r\n達成報酬",
    "acquisitionEnglish": "\"WACCA S Gate\"\r\nachievement reward."
  },
  {
    "id": 104175,
    "name": "わし が 育てた",
    "acquisition": "｢WACCA S ゲート｣\r\n達成報酬",
    "acquisitionEnglish": "\"WACCA S Gate\"\r\nachievement reward."
  },
  {
    "id": 104176,
    "name": "ココロ が シンクロする",
    "acquisition": "｢WACCA S ゲート｣\r\n達成報酬",
    "acquisitionEnglish": "\"WACCA S Gate\"\r\nachievement reward."
  },
  {
    "id": 104177,
    "name": "Let You  ダイブ！",
    "acquisition": "｢WACCA S ゲート｣\r\n達成報酬",
    "acquisitionEnglish": "\"WACCA S Gate\"\r\nachievement reward."
  },
  {
    "id": 104178,
    "name": "ＷＡＣＣＡ  依存症",
    "acquisition": "｢WACCA S ゲート｣\r\n達成報酬",
    "acquisitionEnglish": "\"WACCA S Gate\"\r\nachievement reward."
  },
  {
    "id": 104179,
    "name": "わたしのＷＰ は ９９９９です",
    "acquisition": "｢WACCA S ゲート｣\r\n達成報酬",
    "acquisitionEnglish": "\"WACCA S Gate\"\r\nachievement reward."
  },
  {
    "id": 104180,
    "name": "すべて  ＷＡＣＣＡ！",
    "acquisition": "｢WACCA S ゲート｣\r\n達成報酬",
    "acquisitionEnglish": "\"WACCA S Gate\"\r\nachievement reward."
  },
  {
    "id": 104181,
    "name": "最 ｔｈｅ 高",
    "acquisition": "｢WACCA S ゲート｣\r\n達成報酬",
    "acquisitionEnglish": "\"WACCA S Gate\"\r\nachievement reward."
  },
  {
    "id": 104182,
    "name": "真の姿 を お見せしよう",
    "acquisition": "｢WACCA S ゲート｣\r\n達成報酬",
    "acquisitionEnglish": "\"WACCA S Gate\"\r\nachievement reward."
  },
  {
    "id": 104183,
    "name": "宇宙の法則 が 乱れる！",
    "acquisition": "｢WACCA S ゲート｣\r\n達成報酬",
    "acquisitionEnglish": "\"WACCA S Gate\"\r\nachievement reward."
  },
  {
    "id": 104184,
    "name": "最深部 へ ようこそ",
    "acquisition": "｢WACCA S ゲート｣\r\n達成報酬",
    "acquisitionEnglish": "\"WACCA S Gate\"\r\nachievement reward."
  },
  {
    "id": 104186,
    "name": "限界  突破",
    "acquisition": "プレイヤーレベルを\r\n３００にする",
    "acquisitionEnglish": "Reach Player Level\r\n300."
  },
  {
    "id": 104187,
    "name": "伝説の ＷＡＣＣＡ プレイヤー",
    "acquisition": "プレイヤーレベルを\r\n４００にする",
    "acquisitionEnglish": "Reach Player Level\r\n400."
  },
  {
    "id": 104188,
    "name": "ＷＡＣＣＡ  MASTER",
    "acquisition": "プレイヤーレベルを\r\n５００にする",
    "acquisitionEnglish": "Reach Player Level\r\n500."
  },
  {
    "id": 104189,
    "name": "そらとも は 止まらねぇぞ♪",
    "acquisition": "「ホロライブ × WACCA」\r\n「ホロライブ × WACCA」第2弾\r\nイベント報酬",
    "acquisitionEnglish": "\"Hololive X WACCA\"\r\n\"Hololive X WACCA\" 2nd Event\r\nreward."
  },
  {
    "id": 104190,
    "name": "共に創る  開拓者",
    "acquisition": "「ホロライブ × WACCA」\r\n「ホロライブ × WACCA」第2弾\r\nイベント報酬",
    "acquisitionEnglish": "\"Hololive X WACCA\"\r\n\"Hololive X WACCA\" 2nd Event\r\nreward."
  },
  {
    "id": 104191,
    "name": "走り続ける  物語",
    "acquisition": "「ホロライブ × WACCA」\r\n「ホロライブ × WACCA」第2弾\r\nイベント報酬",
    "acquisitionEnglish": "\"Hololive X WACCA\"\r\n\"Hololive X WACCA\" 2nd Event\r\nreward."
  },
  {
    "id": 104192,
    "name": "ホロライブ  推し",
    "acquisition": "「ホロライブ × WACCA」\r\n「ホロライブ × WACCA」第2弾\r\nイベント報酬",
    "acquisitionEnglish": "\"Hololive X WACCA\"\r\n\"Hololive X WACCA\" 2nd Event\r\nreward."
  },
  {
    "id": 104193,
    "name": "奇跡を起こす  程度の能力",
    "acquisition": "「東方風神録 × WACCA」\r\n「東方風神録 × WACCA」リニューアル\r\nイベント報酬",
    "acquisitionEnglish": "\"Touhou X WACCA\"\r\n\"Touhou: Mountain of Faith X WACCA\"\r\nRenewal Event reward."
  },
  {
    "id": 104194,
    "name": "祀られる 風の 人間",
    "acquisition": "「東方風神録 × WACCA」\r\n「東方風神録 × WACCA」リニューアル\r\nイベント報酬",
    "acquisitionEnglish": "\"Touhou X WACCA\"\r\n\"Touhou: Mountain of Faith X WACCA\"\r\nRenewal Event reward."
  },
  {
    "id": 104195,
    "name": "S+級  カレー",
    "acquisition": "「グルーヴコースター × WACCA」\r\nイベントゲート達成報酬",
    "acquisitionEnglish": "\"Groove Coaster X WACCA\"\r\nEvent Gate achievement reward."
  },
  {
    "id": 104196,
    "name": "I ♥ グルコス",
    "acquisition": "「グルーヴコースター × WACCA」\r\nイベントゲート達成報酬",
    "acquisitionEnglish": "\"Groove Coaster X WACCA\"\r\nEvent Gate achievement reward."
  },
  {
    "id": 104197,
    "name": "烈風 の 守護龍",
    "acquisition": "「グルーヴコースター × WACCA」\r\nイベントゲート達成報酬",
    "acquisitionEnglish": "\"Groove Coaster X WACCA\"\r\nEvent Gate achievement reward."
  },
  {
    "id": 104198,
    "name": "Starlight Road (半角スペース) King",
    "acquisition": "「グルーヴコースター × WACCA」\r\nイベントゲート達成報酬",
    "acquisitionEnglish": "\"Groove Coaster X WACCA\"\r\nEvent Gate achievement reward."
  },
  {
    "id": 104199,
    "name": "鼓動  先生",
    "acquisition": "「グルーヴコースター × WACCA」\r\nイベントゲート達成報酬",
    "acquisitionEnglish": "\"Groove Coaster X WACCA\"\r\nEvent Gate achievement reward."
  },
  {
    "id": 104200,
    "name": "BUCHiGiRE (半角スペース) God",
    "acquisition": "「グルーヴコースター × WACCA」\r\nイベントゲート達成報酬",
    "acquisitionEnglish": "\"Groove Coaster X WACCA\"\r\nEvent Gate achievement reward."
  },
  {
    "id": 104201,
    "name": "不器用 な ドS担当",
    "acquisition": "「ブレンド・S × WACCA」\r\nイベントゲート達成報酬",
    "acquisitionEnglish": "\"Blend S X WACCA\"\r\nEvent Gate achievement reward."
  },
  {
    "id": 104202,
    "name": "生粋ゲーマー  ツンデレ担当",
    "acquisition": "「ブレンド・S × WACCA」\r\nイベントゲート達成報酬",
    "acquisitionEnglish": "\"Blend S X WACCA\"\r\nEvent Gate achievement reward."
  },
  {
    "id": 104203,
    "name": "キッズアニメファン  妹担当",
    "acquisition": "「ブレンド・S × WACCA」\r\nイベントゲート達成報酬",
    "acquisitionEnglish": "\"Blend S X WACCA\"\r\nEvent Gate achievement reward."
  },
  {
    "id": 104204,
    "name": "妄想暴走  お姉さん担当",
    "acquisition": "「ブレンド・S × WACCA」\r\nイベントゲート達成報酬",
    "acquisitionEnglish": "\"Blend S X WACCA\"\r\nEvent Gate achievement reward."
  },
  {
    "id": 104205,
    "name": "男の娘  アイドル担当",
    "acquisition": "「ブレンド・S × WACCA」\r\nイベントゲート達成報酬",
    "acquisitionEnglish": "\"Blend S X WACCA\"\r\nEvent Gate achievement reward."
  },
  {
    "id": 104206,
    "name": "興奮しがち な 店長",
    "acquisition": "「ブレンド・S × WACCA」\r\nイベントゲート達成報酬",
    "acquisitionEnglish": "\"Blend S X WACCA\"\r\nEvent Gate achievement reward."
  },
  {
    "id": 104207,
    "name": "ガチツンデレ  キッチン担当",
    "acquisition": "「ブレンド・S × WACCA」\r\nイベントゲート達成報酬",
    "acquisitionEnglish": "\"Blend S X WACCA\"\r\nEvent Gate achievement reward."
  },
  {
    "id": 104208,
    "name": "銀髪 の 堕天使",
    "acquisition": "「タノシーコロシアム」\r\nイベントゲート達成報酬",
    "acquisitionEnglish": "\"TANO*C Coliseum\"\r\nEvent Gate achievement reward."
  },
  {
    "id": 104209,
    "name": "ＷＡＣＣＡ 以外 完璧な男",
    "acquisition": "「タノシーコロシアム」\r\nイベントゲート達成報酬",
    "acquisitionEnglish": "\"TANO*C Coliseum\"\r\nEvent Gate achievement reward."
  },
  {
    "id": 104210,
    "name": "天使  光輪",
    "acquisition": "「タノシーコロシアム」\r\nイベントゲート達成報酬",
    "acquisitionEnglish": "\"TANO*C Coliseum\"\r\nEvent Gate achievement reward."
  },
  {
    "id": 204001,
    "name": "WACCA Lily ステージI  クリア！",
    "acquisition": "WACCA Lily ステージアップ\r\nステージ I をクリアする",
    "acquisitionEnglish": "WACCA Lily Stage Up\r\nClear Stage I"
  },
  {
    "id": 204002,
    "name": "WACCA Lily ステージII  クリア！",
    "acquisition": "WACCA Lily ステージアップ\r\nステージ II をクリアする",
    "acquisitionEnglish": "WACCA Lily Stage Up\r\nClear Stage II"
  },
  {
    "id": 204003,
    "name": "WACCA Lily ステージIII  クリア！",
    "acquisition": "WACCA Lily ステージアップ\r\nステージ III をクリアする",
    "acquisitionEnglish": "WACCA Lily Stage Up\r\nClear Stage III"
  },
  {
    "id": 204004,
    "name": "WACCA Lily ステージIV  クリア！",
    "acquisition": "WACCA Lily ステージアップ\r\nステージ IV をクリアする",
    "acquisitionEnglish": "WACCA Lily Stage Up\r\nClear Stage IV"
  },
  {
    "id": 204005,
    "name": "WACCA Lily ステージV  クリア！",
    "acquisition": "WACCA Lily ステージアップ\r\nステージ V をクリアする",
    "acquisitionEnglish": "WACCA Lily Stage Up\r\nClear Stage V"
  },
  {
    "id": 204006,
    "name": "WACCA Lily ステージVI  クリア！",
    "acquisition": "WACCA Lily ステージアップ\r\nステージ VI をクリアする",
    "acquisitionEnglish": "WACCA Lily Stage Up\r\nClear Stage VI"
  },
  {
    "id": 204007,
    "name": "WACCA Lily ステージVII  クリア！",
    "acquisition": "WACCA Lily ステージアップ\r\nステージ VII をクリアする",
    "acquisitionEnglish": "WACCA Lily Stage Up\r\nClear Stage VII"
  },
  {
    "id": 204008,
    "name": "WACCA Lily ステージVIII  クリア！",
    "acquisition": "WACCA Lily ステージアップ\r\nステージ VIII をクリアする",
    "acquisitionEnglish": "WACCA Lily Stage Up\r\nClear Stage VIII"
  },
  {
    "id": 204009,
    "name": "WACCA Lily ステージIX  クリア！",
    "acquisition": "WACCA Lily ステージアップ\r\nステージ IX をクリアする",
    "acquisitionEnglish": "WACCA Lily Stage Up\r\nClear Stage IX"
  },
  {
    "id": 204010,
    "name": "WACCA Lily ステージX  クリア！",
    "acquisition": "WACCA Lily ステージアップ\r\nステージ X をクリアする",
    "acquisitionEnglish": "WACCA Lily Stage Up\r\nClear Stage X"
  },
  {
    "id": 204011,
    "name": "WACCA Lily ステージXI  クリア！",
    "acquisition": "WACCA Lily ステージアップ\r\nステージ XI をクリアする",
    "acquisitionEnglish": "WACCA Lily Stage Up\r\nClear Stage XI"
  },
  {
    "id": 204012,
    "name": "WACCA Lily ステージXII  クリア！",
    "acquisition": "WACCA Lily ステージアップ\r\nステージ XII をクリアする",
    "acquisitionEnglish": "WACCA Lily Stage Up\r\nClear Stage XII"
  },
  {
    "id": 204013,
    "name": "WACCA Lily ステージXIII  クリア！",
    "acquisition": "WACCA Lily ステージアップ\r\nステージ XIII をクリアする",
    "acquisitionEnglish": "WACCA Lily Stage Up\r\nClear Stage XIII"
  },
  {
    "id": 204014,
    "name": "WACCA Lily ステージXIV  クリア！",
    "acquisition": "WACCA Lily ステージアップ\r\nステージ XIV をクリアする",
    "acquisitionEnglish": "WACCA Lily Stage Up\r\nClear Stage XIV"
  },
  {
    "id": 204015,
    "name": "WACCA Lily  はじめました",
    "acquisition": "｢WACCA Lily ゲート｣\r\n達成報酬",
    "acquisitionEnglish": "\"WACCA Lily Gate\"\r\nachievement reward."
  },
  {
    "id": 204016,
    "name": "千里の道 も 一歩から",
    "acquisition": "｢WACCA Lily ゲート｣\r\n達成報酬",
    "acquisitionEnglish": "\"WACCA Lily Gate\"\r\nachievement reward."
  },
  {
    "id": 204017,
    "name": "疾風  怒濤",
    "acquisition": "｢WACCA Lily ゲート｣\r\n達成報酬",
    "acquisitionEnglish": "\"WACCA Lily Gate\"\r\nachievement reward."
  },
  {
    "id": 204018,
    "name": "不撓  不屈",
    "acquisition": "｢WACCA Lily ゲート｣\r\n達成報酬",
    "acquisitionEnglish": "\"WACCA Lily Gate\"\r\nachievement reward."
  },
  {
    "id": 204019,
    "name": "ＷＡＣＣＡ  解禁勢",
    "acquisition": "｢WACCA Lily ゲート｣\r\n達成報酬",
    "acquisitionEnglish": "\"WACCA Lily Gate\"\r\nachievement reward."
  },
  {
    "id": 204020,
    "name": "ＷＡＣＣＡ は 遊びじゃないんだよ！！",
    "acquisition": "｢WACCA Lily ゲート｣\r\n達成報酬",
    "acquisitionEnglish": "\"WACCA Lily Gate\"\r\nachievement reward."
  },
  {
    "id": 204021,
    "name": "ＷＡＣＣＡ が 生き甲斐",
    "acquisition": "｢WACCA Lily ゲート｣\r\n達成報酬",
    "acquisitionEnglish": "\"WACCA Lily Gate\"\r\nachievement reward."
  },
  {
    "id": 204022,
    "name": "フロンティア  ゲート",
    "acquisition": "｢WACCA Lily ゲート｣\r\n達成報酬",
    "acquisitionEnglish": "\"WACCA Lily Gate\"\r\nachievement reward."
  },
  {
    "id": 204023,
    "name": "ＷＡＣＣＡ の 申し子",
    "acquisition": "｢WACCA Lily ゲート｣\r\n達成報酬",
    "acquisitionEnglish": "\"WACCA Lily Gate\"\r\nachievement reward."
  },
  {
    "id": 204024,
    "name": "ワッカ  リリィ",
    "acquisition": "｢WACCA Lily ゲート｣\r\n達成報酬",
    "acquisitionEnglish": "\"WACCA Lily Gate\"\r\nachievement reward."
  },
  {
    "id": 204025,
    "name": "ワッカ  ストロンガー",
    "acquisition": "｢WACCA Lily ゲート｣\r\n達成報酬",
    "acquisitionEnglish": "\"WACCA Lily Gate\"\r\nachievement reward."
  },
  {
    "id": 204026,
    "name": "ゲート の 覇者",
    "acquisition": "｢WACCA Lily ゲート｣\r\n達成報酬",
    "acquisitionEnglish": "\"WACCA Lily Gate\"\r\nachievement reward."
  },
  {
    "id": 204027,
    "name": "考えるな  感じろ",
    "acquisition": "｢WACCA Lily ゲート｣\r\n達成報酬",
    "acquisitionEnglish": "\"WACCA Lily Gate\"\r\nachievement reward."
  },
  {
    "id": 204028,
    "name": "今の俺  強すぎるよ",
    "acquisition": "｢WACCA Lily ゲート｣\r\n達成報酬",
    "acquisitionEnglish": "\"WACCA Lily Gate\"\r\nachievement reward."
  },
  {
    "id": 204029,
    "name": "継続 は 力なり",
    "acquisition": "｢WACCA Lily ゲート｣\r\n達成報酬",
    "acquisitionEnglish": "\"WACCA Lily Gate\"\r\nachievement reward."
  },
  {
    "id": 204030,
    "name": "まだだ！  まだ終わっていない！！",
    "acquisition": "｢WACCA Lily ゲート｣\r\n達成報酬",
    "acquisitionEnglish": "\"WACCA Lily Gate\"\r\nachievement reward."
  },
  {
    "id": 204034,
    "name": "地獄 の 支配者",
    "acquisition": "1プレイ中全ての楽曲を\r\n難易度INFERNOで\r\nALL Marvelous達成",
    "acquisitionEnglish": "Achieve ALL Marvelous on\r\nINFERNO difficulty for\r\nevery song during 1 credit."
  },
  {
    "id": 204035,
    "name": "WACCA Lily 紺レート  達成！",
    "acquisition": "WACCA Lily\r\nレーティング値300達成",
    "acquisitionEnglish": "WACCA Lily\r\nAchieve a rating of 300."
  },
  {
    "id": 204036,
    "name": "WACCA Lily 黄レート  達成！",
    "acquisition": "WACCA Lily\r\nレーティング値600達成",
    "acquisitionEnglish": "WACCA Lily\r\nAchieve a rating of 600."
  },
  {
    "id": 204037,
    "name": "WACCA Lily 赤レート  達成！",
    "acquisition": "WACCA Lily\r\nレーティング値1000達成",
    "acquisitionEnglish": "WACCA Lily\r\nAchieve a rating of 1000."
  },
  {
    "id": 204038,
    "name": "WACCA Lily 紫レート  達成！",
    "acquisition": "WACCA Lily\r\nレーティング値1300達成",
    "acquisitionEnglish": "WACCA Lily\r\nAchieve a rating of 1300."
  },
  {
    "id": 204039,
    "name": "WACCA Lily 青レート  達成！",
    "acquisition": "WACCA Lily\r\nレーティング値1600達成",
    "acquisitionEnglish": "WACCA Lily\r\nAchieve a rating of 1600."
  },
  {
    "id": 204040,
    "name": "WACCA Lily 銀レート  達成！",
    "acquisition": "WACCA Lily\r\nレーティング値1900達成",
    "acquisitionEnglish": "WACCA Lily\r\nAchieve a rating of 1900."
  },
  {
    "id": 204041,
    "name": "WACCA Lily 金レート  達成！",
    "acquisition": "WACCA Lily\r\nレーティング値2200達成",
    "acquisitionEnglish": "WACCA Lily\r\nAchieve a rating of 2200."
  },
  {
    "id": 204042,
    "name": "WACCA Lily 虹レート  達成！",
    "acquisition": "WACCA Lily\r\nレーティング値2500達成",
    "acquisitionEnglish": "WACCA Lily\r\nAchieve a rating of 2500."
  },
  {
    "id": 204043,
    "name": "赤 の 独壇場",
    "acquisition": "｢リリィボックス｣から獲得",
    "acquisitionEnglish": "Obtained from a \"Lily Box\"."
  },
  {
    "id": 204044,
    "name": "青 から 逃げろ",
    "acquisition": "｢リリィボックス｣から獲得",
    "acquisitionEnglish": "Obtained from a \"Lily Box\"."
  },
  {
    "id": 204045,
    "name": "黄 0 あと一歩",
    "acquisition": "｢リリィボックス｣から獲得",
    "acquisitionEnglish": "Obtained from a \"Lily Box\"."
  },
  {
    "id": 204046,
    "name": "灰色  …１０だ！",
    "acquisition": "｢リリィボックス｣から獲得",
    "acquisitionEnglish": "Obtained from a \"Lily Box\"."
  },
  {
    "id": 204047,
    "name": "闇 が 消えない！",
    "acquisition": "｢リリィボックス｣から獲得",
    "acquisitionEnglish": "Obtained from a \"Lily Box\"."
  },
  {
    "id": 204048,
    "name": "神曲  いいぞ",
    "acquisition": "｢リリィボックス｣から獲得",
    "acquisitionEnglish": "Obtained from a \"Lily Box\"."
  },
  {
    "id": 204049,
    "name": "良曲 で いこう",
    "acquisition": "｢リリィボックス｣から獲得",
    "acquisitionEnglish": "Obtained from a \"Lily Box\"."
  },
  {
    "id": 204050,
    "name": "うどん の 冬",
    "acquisition": "｢リリィボックス｣から獲得",
    "acquisitionEnglish": "Obtained from a \"Lily Box\"."
  },
  {
    "id": 204051,
    "name": "ラーメン には 春",
    "acquisition": "｢リリィボックス｣から獲得",
    "acquisitionEnglish": "Obtained from a \"Lily Box\"."
  },
  {
    "id": 204052,
    "name": "冷やし中華 は 夏",
    "acquisition": "｢リリィボックス｣から獲得",
    "acquisitionEnglish": "Obtained from a \"Lily Box\"."
  },
  {
    "id": 204053,
    "name": "そば の 秋",
    "acquisition": "｢リリィボックス｣から獲得",
    "acquisitionEnglish": "Obtained from a \"Lily Box\"."
  },
  {
    "id": 204054,
    "name": "インターネット  つながりました！",
    "acquisition": "｢リリィボックス｣から獲得",
    "acquisitionEnglish": "Obtained from a \"Lily Box\"."
  },
  {
    "id": 204055,
    "name": "元気 な おじさん",
    "acquisition": "｢リリィボックス｣から獲得",
    "acquisitionEnglish": "Obtained from a \"Lily Box\"."
  },
  {
    "id": 204056,
    "name": "デジタル で お絵描きマン",
    "acquisition": "｢リリィボックス｣から獲得",
    "acquisitionEnglish": "Obtained from a \"Lily Box\"."
  },
  {
    "id": 204057,
    "name": "タノシー  ガチ勢",
    "acquisition": "｢リリィボックス｣から獲得",
    "acquisitionEnglish": "Obtained from a \"Lily Box\"."
  },
  {
    "id": 204058,
    "name": "ＷＡＣＣＡ  ﾁｮｯﾄﾃﾞｷﾙ",
    "acquisition": "｢リリィボックス｣から獲得",
    "acquisitionEnglish": "Obtained from a \"Lily Box\"."
  },
  {
    "id": 204059,
    "name": "1桁 から 3桁",
    "acquisition": "｢リリィボックス｣から獲得",
    "acquisitionEnglish": "Obtained from a \"Lily Box\"."
  },
  {
    "id": 204060,
    "name": "公式スタンプ は 40種類",
    "acquisition": "｢リリィボックス｣から獲得",
    "acquisitionEnglish": "Obtained from a \"Lily Box\"."
  },
  {
    "id": 204061,
    "name": "ＷＡＣＣＡ ＷＡＣＣＡ しますね",
    "acquisition": "｢リリィボックス｣から獲得",
    "acquisitionEnglish": "Obtained from a \"Lily Box\"."
  },
  {
    "id": 204062,
    "name": "お前 は 俺か",
    "acquisition": "｢リリィボックス｣から獲得",
    "acquisitionEnglish": "Obtained from a \"Lily Box\"."
  },
  {
    "id": 204063,
    "name": "Good を 消す方法",
    "acquisition": "｢リリィボックス｣から獲得",
    "acquisitionEnglish": "Obtained from a \"Lily Box\"."
  },
  {
    "id": 204064,
    "name": "Great ・・・ 深いな",
    "acquisition": "｢リリィボックス｣から獲得",
    "acquisitionEnglish": "Obtained from a \"Lily Box\"."
  },
  {
    "id": 204065,
    "name": "Miss  消えるのか？",
    "acquisition": "｢リリィボックス｣から獲得",
    "acquisitionEnglish": "Obtained from a \"Lily Box\"."
  },
  {
    "id": 204066,
    "name": "Marvelous  ！",
    "acquisition": "｢リリィボックス｣から獲得",
    "acquisitionEnglish": "Obtained from a \"Lily Box\"."
  },
  {
    "id": 204067,
    "name": "スマホでも  弄ってるわけ？",
    "acquisition": "｢リリィボックス｣から獲得",
    "acquisitionEnglish": "Obtained from a \"Lily Box\"."
  },
  {
    "id": 204068,
    "name": "明日 は ＷＡＣＣＡ",
    "acquisition": "｢リリィボックス｣から獲得",
    "acquisitionEnglish": "Obtained from a \"Lily Box\"."
  },
  {
    "id": 204069,
    "name": "わざと  やってんの?",
    "acquisition": "｢リリィボックス｣から獲得",
    "acquisitionEnglish": "Obtained from a \"Lily Box\"."
  },
  {
    "id": 204070,
    "name": "I'm  with  U",
    "acquisition": "｢リリィボックス｣から獲得",
    "acquisitionEnglish": "Obtained from a \"Lily Box\"."
  },
  {
    "id": 204071,
    "name": "Let's (半角スペース) Dive…",
    "acquisition": "｢リリィボックス｣から獲得",
    "acquisitionEnglish": "Obtained from a \"Lily Box\"."
  },
  {
    "id": 204072,
    "name": "歴史 に 学ぶ",
    "acquisition": "｢リリィボックス｣から獲得",
    "acquisitionEnglish": "Obtained from a \"Lily Box\"."
  },
  {
    "id": 204073,
    "name": "レバニラ  好き？",
    "acquisition": "｢リリィボックス｣から獲得",
    "acquisitionEnglish": "Obtained from a \"Lily Box\"."
  },
  {
    "id": 204074,
    "name": "焼肉  定食",
    "acquisition": "｢リリィボックス｣から獲得",
    "acquisitionEnglish": "Obtained from a \"Lily Box\"."
  },
  {
    "id": 204075,
    "name": "ＷＡＣＣＡ  部",
    "acquisition": "｢リリィボックス｣から獲得",
    "acquisitionEnglish": "Obtained from a \"Lily Box\"."
  },
  {
    "id": 204076,
    "name": "おいしい  譜面",
    "acquisition": "｢リリィボックス｣から獲得",
    "acquisitionEnglish": "Obtained from a \"Lily Box\"."
  },
  {
    "id": 204077,
    "name": "判定 -1 玄人",
    "acquisition": "｢リリィボックス｣から獲得",
    "acquisitionEnglish": "Obtained from a \"Lily Box\"."
  },
  {
    "id": 204078,
    "name": "今日 0 AM",
    "acquisition": "｢リリィボックス｣から獲得",
    "acquisitionEnglish": "Obtained from a \"Lily Box\"."
  },
  {
    "id": 204079,
    "name": "朝 1 ＷＡＣＣＡ",
    "acquisition": "｢リリィボックス｣から獲得",
    "acquisitionEnglish": "Obtained from a \"Lily Box\"."
  },
  {
    "id": 204080,
    "name": "ＷＡＣＣＡ 2 you",
    "acquisition": "｢リリィボックス｣から獲得",
    "acquisitionEnglish": "Obtained from a \"Lily Box\"."
  },
  {
    "id": 204081,
    "name": "Sun 3 産",
    "acquisition": "｢リリィボックス｣から獲得",
    "acquisitionEnglish": "Obtained from a \"Lily Box\"."
  },
  {
    "id": 204082,
    "name": "まだまだ  行けるよね？",
    "acquisition": "｢リリィボックス｣から獲得",
    "acquisitionEnglish": "Obtained from a \"Lily Box\"."
  },
  {
    "id": 204083,
    "name": "カレーライス が 好き",
    "acquisition": "｢リリィボックス｣から獲得",
    "acquisitionEnglish": "Obtained from a \"Lily Box\"."
  },
  {
    "id": 204084,
    "name": "有象  無象",
    "acquisition": "｢リリィボックス｣から獲得",
    "acquisitionEnglish": "Obtained from a \"Lily Box\"."
  },
  {
    "id": 204085,
    "name": "判定 が わからない",
    "acquisition": "｢リリィボックス｣から獲得",
    "acquisitionEnglish": "Obtained from a \"Lily Box\"."
  },
  {
    "id": 204086,
    "name": "ゲーセン の 常連",
    "acquisition": "｢リリィボックス｣から獲得",
    "acquisitionEnglish": "Obtained from a \"Lily Box\"."
  },
  {
    "id": 204087,
    "name": "ハピなる に な～る☆",
    "acquisition": "「プリティーシリーズ × WACCA」\r\nイベントゲート達成報酬",
    "acquisitionEnglish": "\"Pretty Series X WACCA\"\r\nEvent Gate achievement reward."
  },
  {
    "id": 204088,
    "name": "ありがとう の かしこまっ！",
    "acquisition": "「プリティーシリーズ × WACCA」\r\nイベントゲート達成報酬",
    "acquisitionEnglish": "\"Pretty Series X WACCA\"\r\nEvent Gate achievement reward."
  },
  {
    "id": 204089,
    "name": "キラッと☆ えもい 一輪花",
    "acquisition": "「プリティーシリーズ × WACCA」\r\nイベントゲート達成報酬",
    "acquisitionEnglish": "\"Pretty Series X WACCA\"\r\nEvent Gate achievement reward."
  },
  {
    "id": 204090,
    "name": "リトル ・ ルーキー",
    "acquisition": "「ダンまちⅢ × WACCA」\r\nイベントゲート達成報酬",
    "acquisitionEnglish": "\"DanMachi III X WACCA\"\r\nEvent Gate achievement reward."
  },
  {
    "id": 204091,
    "name": "ヘスティア ・ ファミリア",
    "acquisition": "「ダンまちⅢ × WACCA」\r\nイベントゲート達成報酬",
    "acquisitionEnglish": "\"DanMachi III X WACCA\"\r\nEvent Gate achievement reward."
  },
  {
    "id": 204092,
    "name": "寡黙 な 剣姫",
    "acquisition": "「ダンまちⅢ × WACCA」\r\nイベントゲート達成報酬",
    "acquisitionEnglish": "\"DanMachi III X WACCA\"\r\nEvent Gate achievement reward."
  },
  {
    "id": 204093,
    "name": "かぼちゃ  パーティー",
    "acquisition": "10月31日～11月7日\r\nプレイで獲得",
    "acquisitionEnglish": "Play between\r\nOctober 31st and November 7th."
  },
  {
    "id": 204094,
    "name": "ぺーこ ぺこ ぺこ",
    "acquisition": "「ホロライブ × WACCA」第2弾\r\nイベントゲート達成報酬",
    "acquisitionEnglish": "\"Hololive X WACCA\" 2nd Event\r\nGate achievement reward."
  },
  {
    "id": 204095,
    "name": "野うさぎ同盟  ",
    "acquisition": "「ホロライブ × WACCA」第2弾\r\nイベントゲート達成報酬",
    "acquisitionEnglish": "\"Hololive X WACCA\" 2nd Event\r\nGate achievement reward."
  },
  {
    "id": 204096,
    "name": "エリート  巫女",
    "acquisition": "「ホロライブ × WACCA」第2弾\r\nイベントゲート達成報酬",
    "acquisitionEnglish": "\"Hololive X WACCA\" 2nd Event\r\nGate achievement reward."
  },
  {
    "id": 204097,
    "name": "35P  ",
    "acquisition": "「ホロライブ × WACCA」第2弾\r\nイベントゲート達成報酬",
    "acquisitionEnglish": "\"Hololive X WACCA\" 2nd Event\r\nGate achievement reward."
  },
  {
    "id": 204098,
    "name": "おはこんですよー  (^・ω・^§)ﾉ",
    "acquisition": "「ホロライブ × WACCA」第2弾\r\nイベントゲート達成報酬",
    "acquisitionEnglish": "\"Hololive X WACCA\" 2nd Event\r\nGate achievement reward."
  },
  {
    "id": 204099,
    "name": "すこん部  ",
    "acquisition": "「ホロライブ × WACCA」第2弾\r\nイベントゲート達成報酬",
    "acquisitionEnglish": "\"Hololive X WACCA\" 2nd Event\r\nGate achievement reward."
  },
  {
    "id": 204100,
    "name": "すいちゃん は 今日もかわいいー！",
    "acquisition": "「ホロライブ × WACCA」第2弾\r\nイベントゲート達成報酬",
    "acquisitionEnglish": "\"Hololive X WACCA\" 2nd Event\r\nGate achievement reward."
  },
  {
    "id": 204101,
    "name": "星詠み  ",
    "acquisition": "「ホロライブ × WACCA」第2弾\r\nイベントゲート達成報酬",
    "acquisitionEnglish": "\"Hololive X WACCA\" 2nd Event\r\nGate achievement reward."
  },
  {
    "id": 204102,
    "name": "Good Night<comma> (半角スペース) Bad God.",
    "acquisition": "「グルーヴコースター × WACCA」第2弾\r\nイベントゲート達成報酬",
    "acquisitionEnglish": "\"Groove Coaster X WACCA\" 2nd\r\nEvent Gate achievement reward."
  },
  {
    "id": 204103,
    "name": "God  more  raves?",
    "acquisition": "「グルーヴコースター × WACCA」第2弾\r\nイベントゲート達成報酬",
    "acquisitionEnglish": "\"Groove Coaster X WACCA\" 2nd\r\nEvent Gate achievement reward."
  },
  {
    "id": 204104,
    "name": "CHAIN  CHAIN  CHAIN GOD!!!",
    "acquisition": "「グルーヴコースター × WACCA」第2弾\r\nイベントゲート達成報酬",
    "acquisitionEnglish": "\"Groove Coaster X WACCA\" 2nd\r\nEvent Gate achievement reward."
  },
  {
    "id": 204105,
    "name": "QiXiN  MAdN3ss  2153 God",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204106,
    "name": "チキン は 別腹",
    "acquisition": "12月24日～12月31日\r\nプレイで獲得",
    "acquisitionEnglish": "Play between\r\nDecember 24th and December 31."
  },
  {
    "id": 204107,
    "name": "メメント ・ モチ",
    "acquisition": "1月1日～1月11日\r\nプレイで獲得",
    "acquisitionEnglish": "Play between\r\nJanuary 1st and January 11th."
  },
  {
    "id": 204108,
    "name": "鬼 は そと",
    "acquisition": "2月2日～2月9日\r\nプレイで獲得",
    "acquisitionEnglish": "Play between\r\nFebruary 2nd and February 9th."
  },
  {
    "id": 204109,
    "name": "何個  もらった？",
    "acquisition": "2月14日～2月21日\r\nプレイで獲得",
    "acquisitionEnglish": "Play between\r\nFebruary 14th and February 21st."
  },
  {
    "id": 204110,
    "name": "ひな  あられ",
    "acquisition": "3月3日～3月10日\r\nプレイで獲得",
    "acquisitionEnglish": "Play between\r\nMarch 3rd and March 10th."
  },
  {
    "id": 204111,
    "name": "無限 の 空へ",
    "acquisition": "WACCA Lily\r\n｢エクストラゲート｣達成報酬",
    "acquisitionEnglish": "WACCA Lily\r\n\"Extra Gate\" achievement reward."
  },
  {
    "id": 204112,
    "name": "心理  解放",
    "acquisition": "WACCA Lily\r\n｢エクストラゲート｣達成報酬",
    "acquisitionEnglish": "WACCA Lily\r\n\"Extra Gate\" achievement reward."
  },
  {
    "id": 204113,
    "name": "愛くるしき  怪猫",
    "acquisition": "WACCA Lily\r\n｢エクストラゲート｣達成報酬",
    "acquisitionEnglish": "WACCA Lily\r\n\"Extra Gate\" achievement reward."
  },
  {
    "id": 204114,
    "name": "憎悪 の 化身",
    "acquisition": "WACCA Lily\r\n｢エクストラゲート｣達成報酬",
    "acquisitionEnglish": "WACCA Lily\r\n\"Extra Gate\" achievement reward."
  },
  {
    "id": 204115,
    "name": "宇宙 の 誕生",
    "acquisition": "WACCA Lily\r\n｢エクストラゲート｣達成報酬",
    "acquisitionEnglish": "WACCA Lily\r\n\"Extra Gate\" achievement reward."
  },
  {
    "id": 204116,
    "name": "お姉さま と 一緒",
    "acquisition": "｢アールボックス｣から獲得",
    "acquisitionEnglish": "Obtained from an \"R Box\"."
  },
  {
    "id": 204117,
    "name": "わたしはあなた が 好き",
    "acquisition": "｢アールボックス｣から獲得",
    "acquisitionEnglish": "Obtained from an \"R Box\"."
  },
  {
    "id": 204118,
    "name": "人気DJ の 学園生活",
    "acquisition": "｢アールボックス｣から獲得",
    "acquisitionEnglish": "Obtained from an \"R Box\"."
  },
  {
    "id": 204119,
    "name": "花見 の はる",
    "acquisition": "｢アールボックス｣から獲得",
    "acquisitionEnglish": "Obtained from an \"R Box\"."
  },
  {
    "id": 204120,
    "name": "アツ い なつ",
    "acquisition": "｢アールボックス｣から獲得",
    "acquisitionEnglish": "Obtained from an \"R Box\"."
  },
  {
    "id": 204121,
    "name": "エモ い あき",
    "acquisition": "｢アールボックス｣から獲得",
    "acquisitionEnglish": "Obtained from an \"R Box\"."
  },
  {
    "id": 204122,
    "name": "クール な ふゆ",
    "acquisition": "｢アールボックス｣から獲得",
    "acquisitionEnglish": "Obtained from an \"R Box\"."
  },
  {
    "id": 204123,
    "name": "サイン コサイン タンジェント",
    "acquisition": "｢アールボックス｣から獲得",
    "acquisitionEnglish": "Obtained from an \"R Box\"."
  },
  {
    "id": 204124,
    "name": "大量の みかんの 箱",
    "acquisition": "｢アールボックス｣から獲得",
    "acquisitionEnglish": "Obtained from an \"R Box\"."
  },
  {
    "id": 204125,
    "name": "るくあんす is …？",
    "acquisition": "｢アールボックス｣から獲得",
    "acquisitionEnglish": "Obtained from an \"R Box\"."
  },
  {
    "id": 204126,
    "name": "デッカイ  ノーツ",
    "acquisition": "｢アールボックス｣から獲得",
    "acquisitionEnglish": "Obtained from an \"R Box\"."
  },
  {
    "id": 204127,
    "name": "Miss  滅するべし",
    "acquisition": "｢アールボックス｣から獲得",
    "acquisitionEnglish": "Obtained from an \"R Box\"."
  },
  {
    "id": 204128,
    "name": "偉大 な 先人",
    "acquisition": "｢アールボックス｣から獲得",
    "acquisitionEnglish": "Obtained from an \"R Box\"."
  },
  {
    "id": 204129,
    "name": "後発 でも 負けません！",
    "acquisition": "｢アールボックス｣から獲得",
    "acquisitionEnglish": "Obtained from an \"R Box\"."
  },
  {
    "id": 204130,
    "name": "許すな なんて 言えない",
    "acquisition": "｢アールボックス｣から獲得",
    "acquisitionEnglish": "Obtained from an \"R Box\"."
  },
  {
    "id": 204131,
    "name": "4時間 で 余裕でした",
    "acquisition": "｢アールボックス｣から獲得",
    "acquisitionEnglish": "Obtained from an \"R Box\"."
  },
  {
    "id": 204132,
    "name": "取る のではなく 取らせる",
    "acquisition": "｢アールボックス｣から獲得",
    "acquisitionEnglish": "Obtained from an \"R Box\"."
  },
  {
    "id": 204133,
    "name": "1日  1譜面",
    "acquisition": "｢アールボックス｣から獲得",
    "acquisitionEnglish": "Obtained from an \"R Box\"."
  },
  {
    "id": 204134,
    "name": "LR これで いける",
    "acquisition": "｢アールボックス｣から獲得",
    "acquisitionEnglish": "Obtained from an \"R Box\"."
  },
  {
    "id": 204135,
    "name": "ポップ ステップ シュート！",
    "acquisition": "｢アールボックス｣から獲得",
    "acquisitionEnglish": "Obtained from an \"R Box\"."
  },
  {
    "id": 204136,
    "name": "デフォルトSE ？ 良くある",
    "acquisition": "｢アールボックス｣から獲得",
    "acquisitionEnglish": "Obtained from an \"R Box\"."
  },
  {
    "id": 204137,
    "name": "ノーツ 判定 経験が生きたな",
    "acquisition": "｢アールボックス｣から獲得",
    "acquisitionEnglish": "Obtained from an \"R Box\"."
  },
  {
    "id": 204138,
    "name": "ノーツ カラー いっぱい！",
    "acquisition": "｢アールボックス｣から獲得",
    "acquisitionEnglish": "Obtained from an \"R Box\"."
  },
  {
    "id": 204139,
    "name": "たまに は ステージアップ！",
    "acquisition": "｢アールボックス｣から獲得",
    "acquisitionEnglish": "Obtained from an \"R Box\"."
  },
  {
    "id": 204140,
    "name": "高レート  憧れちゃうなー",
    "acquisition": "｢アールボックス｣から獲得",
    "acquisitionEnglish": "Obtained from an \"R Box\"."
  },
  {
    "id": 204141,
    "name": "解禁条件 ほう、 そんなのもあるのか",
    "acquisition": "｢アールボックス｣から獲得",
    "acquisitionEnglish": "Obtained from an \"R Box\"."
  },
  {
    "id": 204142,
    "name": "ゲートミッション  忘れちゃうよね",
    "acquisition": "｢アールボックス｣から獲得",
    "acquisitionEnglish": "Obtained from an \"R Box\"."
  },
  {
    "id": 204143,
    "name": "リサイクルボックス  ではない",
    "acquisition": "｢アールボックス｣から獲得",
    "acquisitionEnglish": "Obtained from an \"R Box\"."
  },
  {
    "id": 204144,
    "name": "これは 4 プレイで達成しました",
    "acquisition": "｢アールボックス｣から獲得",
    "acquisitionEnglish": "Obtained from an \"R Box\"."
  },
  {
    "id": 204145,
    "name": "難易度 5 ＋あるかもね",
    "acquisition": "｢アールボックス｣から獲得",
    "acquisitionEnglish": "Obtained from an \"R Box\"."
  },
  {
    "id": 204146,
    "name": "ステージアップ 6 いけそうです",
    "acquisition": "｢アールボックス｣から獲得",
    "acquisitionEnglish": "Obtained from an \"R Box\"."
  },
  {
    "id": 204147,
    "name": "俺たち  ズッ友！",
    "acquisition": "フレンドのスコア表示を1人設定する",
    "acquisitionEnglish": "Display scores from 1 friend."
  },
  {
    "id": 204148,
    "name": "WACCA Lily R  はじめました",
    "acquisition": "｢WACCA Lily R ゲート｣\r\n達成報酬",
    "acquisitionEnglish": "\"WACCA Lily R Gate\"\r\nachievement reward."
  },
  {
    "id": 204149,
    "name": "今シーズン も 折り返し",
    "acquisition": "｢WACCA Lily R ゲート｣\r\n達成報酬",
    "acquisitionEnglish": "\"WACCA Lily R Gate\"\r\nachievement reward."
  },
  {
    "id": 204150,
    "name": "走る 走る WACCAer",
    "acquisition": "｢WACCA Lily R ゲート｣\r\n達成報酬",
    "acquisitionEnglish": "\"WACCA Lily R Gate\"\r\nachievement reward."
  },
  {
    "id": 204151,
    "name": "狂気の沙汰 ほど 面白い",
    "acquisition": "｢WACCA Lily R ゲート｣\r\n達成報酬",
    "acquisitionEnglish": "\"WACCA Lily R Gate\"\r\nachievement reward."
  },
  {
    "id": 204152,
    "name": "紛うことなき  廃人",
    "acquisition": "｢WACCA Lily R ゲート｣\r\n達成報酬",
    "acquisitionEnglish": "\"WACCA Lily R Gate\"\r\nachievement reward."
  },
  {
    "id": 204153,
    "name": "WACCA Lily R ステージI  クリア！",
    "acquisition": "WACCA Lily R ステージアップ\r\nステージ I をクリアする",
    "acquisitionEnglish": "WACCA Lily R Stage Up\r\nClear Stage I"
  },
  {
    "id": 204154,
    "name": "WACCA Lily R ステージII  クリア！",
    "acquisition": "WACCA Lily R ステージアップ\r\nステージ II をクリアする",
    "acquisitionEnglish": "WACCA Lily R Stage Up\r\nClear Stage II"
  },
  {
    "id": 204155,
    "name": "WACCA Lily R ステージIII  クリア！",
    "acquisition": "WACCA Lily R ステージアップ\r\nステージ III をクリアする",
    "acquisitionEnglish": "WACCA Lily R Stage Up\r\nClear Stage III"
  },
  {
    "id": 204156,
    "name": "WACCA Lily R ステージIV  クリア！",
    "acquisition": "WACCA Lily R ステージアップ\r\nステージ IV をクリアする",
    "acquisitionEnglish": "WACCA Lily R Stage Up\r\nClear Stage IV"
  },
  {
    "id": 204157,
    "name": "WACCA Lily R ステージV  クリア！",
    "acquisition": "WACCA Lily R ステージアップ\r\nステージ V をクリアする",
    "acquisitionEnglish": "WACCA Lily R Stage Up\r\nClear Stage V"
  },
  {
    "id": 204158,
    "name": "WACCA Lily R ステージVI  クリア！",
    "acquisition": "WACCA Lily R ステージアップ\r\nステージ VI をクリアする",
    "acquisitionEnglish": "WACCA Lily R Stage Up\r\nClear Stage VI"
  },
  {
    "id": 204159,
    "name": "WACCA Lily R ステージVII  クリア！",
    "acquisition": "WACCA Lily R ステージアップ\r\nステージ VII をクリアする",
    "acquisitionEnglish": "WACCA Lily R Stage Up\r\nClear Stage VII"
  },
  {
    "id": 204160,
    "name": "WACCA Lily R ステージVIII  クリア！",
    "acquisition": "WACCA Lily R ステージアップ\r\nステージ VIII をクリアする",
    "acquisitionEnglish": "WACCA Lily R Stage Up\r\nClear Stage VIII"
  },
  {
    "id": 204161,
    "name": "WACCA Lily R ステージIX  クリア！",
    "acquisition": "WACCA Lily R ステージアップ\r\nステージ IX をクリアする",
    "acquisitionEnglish": "WACCA Lily R Stage Up\r\nClear Stage IX"
  },
  {
    "id": 204162,
    "name": "WACCA Lily R ステージX  クリア！",
    "acquisition": "WACCA Lily R ステージアップ\r\nステージ X をクリアする",
    "acquisitionEnglish": "WACCA Lily R Stage Up\r\nClear Stage X"
  },
  {
    "id": 204163,
    "name": "WACCA Lily R ステージXI  クリア！",
    "acquisition": "WACCA Lily R ステージアップ\r\nステージ XI をクリアする",
    "acquisitionEnglish": "WACCA Lily R Stage Up\r\nClear Stage XI"
  },
  {
    "id": 204164,
    "name": "WACCA Lily R ステージXII  クリア！",
    "acquisition": "WACCA Lily R ステージアップ\r\nステージ XII をクリアする",
    "acquisitionEnglish": "WACCA Lily R Stage Up\r\nClear Stage XII"
  },
  {
    "id": 204165,
    "name": "WACCA Lily R ステージXIII  クリア！",
    "acquisition": "WACCA Lily R ステージアップ\r\nステージ XIII をクリアする",
    "acquisitionEnglish": "WACCA Lily R Stage Up\r\nClear Stage XIII"
  },
  {
    "id": 204166,
    "name": "WACCA Lily R ステージXIV  クリア！",
    "acquisition": "WACCA Lily R ステージアップ\r\nステージ XIV をクリアする",
    "acquisitionEnglish": "WACCA Lily R Stage Up\r\nClear Stage XIV"
  },
  {
    "id": 204167,
    "name": "WACCA Lily R 紺レート  達成！",
    "acquisition": "WACCA Lily R\r\nレーティング値300達成",
    "acquisitionEnglish": "WACCA Lily R\r\nAchieve a rating of 300."
  },
  {
    "id": 204168,
    "name": "WACCA Lily R 黄レート  達成！",
    "acquisition": "WACCA Lily R\r\nレーティング値600達成",
    "acquisitionEnglish": "WACCA Lily R\r\nAchieve a rating of 600."
  },
  {
    "id": 204169,
    "name": "WACCA Lily R 赤レート  達成！",
    "acquisition": "WACCA Lily R\r\nレーティング値1000達成",
    "acquisitionEnglish": "WACCA Lily R\r\nAchieve a rating of 1000."
  },
  {
    "id": 204170,
    "name": "WACCA Lily R 紫レート  達成！",
    "acquisition": "WACCA Lily R\r\nレーティング値1300達成",
    "acquisitionEnglish": "WACCA Lily R\r\nAchieve a rating of 1300."
  },
  {
    "id": 204171,
    "name": "WACCA Lily R 青レート  達成！",
    "acquisition": "WACCA Lily R\r\nレーティング値1600達成",
    "acquisitionEnglish": "WACCA Lily R\r\nAchieve a rating of 1600."
  },
  {
    "id": 204172,
    "name": "WACCA Lily R 銀レート  達成！",
    "acquisition": "WACCA Lily R\r\nレーティング値1900達成",
    "acquisitionEnglish": "WACCA Lily R\r\nAchieve a rating of 1900."
  },
  {
    "id": 204173,
    "name": "WACCA Lily R 金レート  達成！",
    "acquisition": "WACCA Lily R\r\nレーティング値2200達成",
    "acquisitionEnglish": "WACCA Lily R\r\nAchieve a rating of 2200."
  },
  {
    "id": 204174,
    "name": "WACCA Lily R 虹レート  達成！",
    "acquisition": "WACCA Lily R\r\nレーティング値2500達成",
    "acquisitionEnglish": "WACCA Lily R\r\nAchieve a rating of 2500."
  },
  {
    "id": 204175,
    "name": "国立ノタリウム研究所 の トンネル",
    "acquisition": "「Lanota × WACCA」\r\nイベントゲート達成報酬",
    "acquisitionEnglish": "\"Lanota X WACCA\"\r\nEvent Gate achievement reward."
  },
  {
    "id": 204176,
    "name": "果てしない  大空へ",
    "acquisition": "「Lanota × WACCA」\r\nイベントゲート達成報酬",
    "acquisitionEnglish": "\"Lanota X WACCA\"\r\nEvent Gate achievement reward."
  },
  {
    "id": 204177,
    "name": "神秘 との 邂逅",
    "acquisition": "「Lanota × WACCA」\r\nイベントゲート達成報酬",
    "acquisitionEnglish": "\"Lanota X WACCA\"\r\nEvent Gate achievement reward."
  },
  {
    "id": 204178,
    "name": "生命 の 音",
    "acquisition": "「Lanota × WACCA」\r\nイベントゲート達成報酬",
    "acquisitionEnglish": "\"Lanota X WACCA\"\r\nEvent Gate achievement reward."
  },
  {
    "id": 204179,
    "name": "なだめスかし Negotiation",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204180,
    "name": "非実在系女子たちはどうすりゃいいですか？",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204182,
    "name": "ホイホイ☆幻想ホロイズム",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204183,
    "name": "サクリファイス",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204184,
    "name": "sister's noise",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204185,
    "name": "ぺこみこ大戦争！！",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204186,
    "name": "Say!ファンファーレ!",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204187,
    "name": "NEXT COLOR PLANET",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204188,
    "name": "夢見る空へ",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204189,
    "name": "お願いマッスル",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204190,
    "name": "マッチョアネーム？",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204191,
    "name": "HELLO to DREAM",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204192,
    "name": "over and over",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204193,
    "name": "トロピカッ☆バケーション",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204194,
    "name": "秒針を噛む",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204195,
    "name": "ないものねだり",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204196,
    "name": "HOT LIMIT",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204197,
    "name": "キラメキライダー☆",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204198,
    "name": "ガヴリールドロップキック",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204199,
    "name": "This game",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204200,
    "name": "RAGE OF DUST",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204201,
    "name": "Make it！",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204202,
    "name": "Make it！ (DJ Genki Remix)",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204203,
    "name": "キラッとスタート",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204204,
    "name": "キラッとスタート (USAO Remix)",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204205,
    "name": "ハート♥イロ♥トリドリ〜ム",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204206,
    "name": "ダダダダ天使",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204207,
    "name": "青空のラプソディ",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204208,
    "name": "Bravely You",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204209,
    "name": "ぼなぺてぃーと♡S",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204210,
    "name": "デタラメなマイナスとプラスにおけるブレンド考",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204211,
    "name": "輪廻転生",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204212,
    "name": "ストライク・ザ・ブラッド",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204213,
    "name": "新宝島",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204214,
    "name": "U.S.A.",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204215,
    "name": "Shiny Smily Story",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204216,
    "name": "Dream☆Story",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204217,
    "name": "without U",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204218,
    "name": "シャルル",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204219,
    "name": "ドラマツルギー",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204220,
    "name": "オドループ",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204221,
    "name": "only my railgun",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204222,
    "name": "にめんせい☆ウラオモテライフ!",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204223,
    "name": "You Only Live Once",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204224,
    "name": "残酷な天使のテーゼ",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204225,
    "name": "ただ君に晴れ",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204226,
    "name": "The Light",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204227,
    "name": "AIAIAI (feat. 中田ヤスタカ)",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204228,
    "name": "Hello<comma> Morning",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204229,
    "name": "Raise Your Heart!!",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204230,
    "name": "SHINY DAYS",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204231,
    "name": "EXCITE",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204232,
    "name": "シュガーソングとビターステップ",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204233,
    "name": "ファティマ",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204234,
    "name": "回レ！雪月花",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204235,
    "name": "ピースサイン",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204236,
    "name": "徒花ネクロマンシー",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204237,
    "name": "ようこそジャパリパークへ",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204238,
    "name": "かくしん的☆めたまるふぉ～ぜっ!",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204239,
    "name": "POP TEAM EPIC",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204240,
    "name": "ファッとして桃源郷",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204241,
    "name": "Nameless Story",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204242,
    "name": "TOMORROW",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204243,
    "name": "五等分の気持ち",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204244,
    "name": "EZ DO DANCE -K.O.P. REMIX-",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204245,
    "name": "ギミチョコ!!",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204246,
    "name": "ウマーベラス",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204247,
    "name": "バレリーコ",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204248,
    "name": "フィクサー",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204249,
    "name": "だれかの心臓になれたなら",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204250,
    "name": "六兆年と一夜物語",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204251,
    "name": "テレキャスタービーボーイ",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204252,
    "name": "ワールドイズマイン",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204253,
    "name": "進捗どうですか！",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204254,
    "name": "ぼくらの16bit戦争",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204255,
    "name": "隔絶≡タナトス",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204256,
    "name": "アスノヨゾラ哨戒班",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204257,
    "name": "ヒビカセ",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204258,
    "name": "脳漿炸裂ガール",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204259,
    "name": "ポジティブ☆ダンスタイム",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204260,
    "name": "Gimme×Gimme feat. 初音ミク・鏡音リン",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204261,
    "name": "39みゅーじっく！",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204262,
    "name": "ブリキノダンス",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204263,
    "name": "チュルリラ・チュルリラ・ダッダッダ！",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204264,
    "name": "おばけのウケねらい",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204265,
    "name": "ベノム",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204266,
    "name": "リアル初音ミクの消失",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204267,
    "name": "セツナトリップ",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204268,
    "name": "カゲロウデイズ",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204269,
    "name": "天ノ弱",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204270,
    "name": "ゴーストルール",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204271,
    "name": "ロストワンの号哭",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204272,
    "name": "いーあるふぁんくらぶ",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204273,
    "name": "初音ミクの消失",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204274,
    "name": "劣等上等",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204275,
    "name": "アカリがやってきたぞっ",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204276,
    "name": "太陽系デスコ",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204277,
    "name": "気まぐれメルシィ feat. 初音ミク",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204278,
    "name": "幸せになれる隠しコマンドがあるらしい",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204279,
    "name": "千本桜",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204280,
    "name": "エイリアンエイリアン",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204281,
    "name": "砂の惑星 feat. 初音ミク",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204282,
    "name": "マトリョシカ",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204283,
    "name": "Seyana. ～何でも言うことを聞いてくれるアカネチャン～",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204284,
    "name": "フラジール",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204285,
    "name": "ロキ",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204286,
    "name": "ウミユリ海底譚",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204287,
    "name": "スクランブル交際",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204288,
    "name": "乙女解剖",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204289,
    "name": "Scream out!",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204290,
    "name": "Help me<comma> ERINNNNNN!!",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204291,
    "name": "進捗どうですか？",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204292,
    "name": "Sweet Requiem",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204293,
    "name": "明星ロケット",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204294,
    "name": "ゆけむり魂温泉 II",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204295,
    "name": "Calamity Fortune",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204296,
    "name": "ケロ⑨Destiny",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204297,
    "name": "風に乗せた願い",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204298,
    "name": "LOVE EAST",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204299,
    "name": "天狗の落とし文 feat. ytr",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204300,
    "name": "神寂",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204301,
    "name": "悪戯センセーション",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204302,
    "name": "ナイト・オブ・ナイツ (かめりあ’s“ワンス・アポン・ア・ナイト”Remix)",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204303,
    "name": "Mami Mami Zone",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204304,
    "name": "チルノのパーフェクトさんすう教室",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204305,
    "name": "待チ人ハ来ズ。",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204306,
    "name": "taboo tears you up 2017",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204307,
    "name": "Bad Apple!! feat. nomico",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204308,
    "name": "ナイト・オブ・ナイツ",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204309,
    "name": "WARNING×WARNING×WARNING",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204310,
    "name": "シャカリキ・ファイト・ブンブン",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204311,
    "name": "ニュー・ウェーブ",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204312,
    "name": "ガンガン・ドンドン",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204313,
    "name": "スマイル・アンド・ティアズ",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204314,
    "name": "STILL HOT IN MY HEART",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204315,
    "name": "Over the sweat and tears",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204316,
    "name": "Singin'☆Shine！",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204317,
    "name": "進捗WARS feat．ビートまりお",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204318,
    "name": "MAGENTA POTION",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204319,
    "name": "Apocalypse",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204320,
    "name": "You are the Miserable",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204321,
    "name": "Stasis",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204322,
    "name": "Rainmaker",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204323,
    "name": "Weg",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204324,
    "name": "From Zero feat. 利香",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204325,
    "name": "PRESS START!",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204326,
    "name": "TWISTSTEP",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204327,
    "name": "Future Cαndy",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204328,
    "name": "Fish Fight!",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204329,
    "name": "THERAPY",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204330,
    "name": "グルーヴ・ザ・ハート",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204331,
    "name": "Got more raves?",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204332,
    "name": "Good Night<comma> Bad Luck.",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204333,
    "name": "Grayed Out-Antifront-",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204334,
    "name": "インドア系ならトラックメイカー",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204335,
    "name": "ダンシング☆サムライ",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204336,
    "name": "WHITE",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204337,
    "name": "Brain Power",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204338,
    "name": "聖者の鼓動",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204339,
    "name": "BUCHiGiRE Berserker",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204340,
    "name": "君のStarlight Road",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204341,
    "name": "FUJIN Rumble",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204342,
    "name": "Eyes on me feat. Such",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204343,
    "name": "GOODWORLD",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204344,
    "name": "Altale",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204345,
    "name": "ベースラインやってる？笑",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204346,
    "name": "EU over Progress",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204347,
    "name": "燐廻",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204348,
    "name": "『エキセントリック少年ボウイ』のテーマ",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204349,
    "name": "Jägermeister",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204350,
    "name": "What's this?",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204351,
    "name": "FREEDOM DiVE↓",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204352,
    "name": "Honey Panic!",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204353,
    "name": "Pixel Galaxy",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204354,
    "name": "集結の華々",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204355,
    "name": "conflict",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204356,
    "name": "こんにちは、ARuFaです。",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204357,
    "name": "ぼくの夢、メチャクソ無限湧き",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204358,
    "name": "ゲームオーバー (feat. TORIENA)",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204359,
    "name": "ルーンファクトリー４スペシャルより「この想いを乗せて」",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204360,
    "name": "LIN NE KRO NE feat. Lasah",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204361,
    "name": "Lhaksha",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204362,
    "name": "フリーフォール",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204363,
    "name": "猫娘",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204364,
    "name": "QiXiN MAdN3ss 2153",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204365,
    "name": "ARTEMiS",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204366,
    "name": "with U",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204367,
    "name": "Tell Me",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204368,
    "name": "LETHAL;WEAPON",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204369,
    "name": "THE MUZZLE FACING",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204370,
    "name": "GASHATT",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204371,
    "name": "Demon's Rave",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204372,
    "name": "jacaranda",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204373,
    "name": "CHECKER FLAG",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204374,
    "name": "Stratoliner",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204375,
    "name": "Utopia feat. shully",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204376,
    "name": "Let you DIVE!",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204377,
    "name": "SHAKE!",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204378,
    "name": "ATAMA WARUI",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204379,
    "name": "Megaton Killer",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204380,
    "name": "DUAL BREAKER XX",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204381,
    "name": "Liberate",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204382,
    "name": "Animosity",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204383,
    "name": "Big Bang",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204384,
    "name": "恋メタル",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204385,
    "name": "はげしこの夜 -Psylent Crazy Night-",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204386,
    "name": "パニックポップ☆フェスティバル!!!",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204387,
    "name": "Stasis feat.motoko -WACCA EDiT- ",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204388,
    "name": "RAV#GIRL",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204389,
    "name": "KALACAKLA",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204390,
    "name": "Poppin' Shower",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204391,
    "name": "While Shining feat.Yukacco",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204392,
    "name": "ALiVE",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204393,
    "name": "ONOMATO Pairing!!!",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204394,
    "name": "SUPER REACTOR",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204395,
    "name": "GENOCIDER",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204396,
    "name": "ツアー・ファイナル",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204397,
    "name": "Metamorphose",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204398,
    "name": "MAGiC4LG1RL M3GA S7R1KE!",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204399,
    "name": "METEOR BURST",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204400,
    "name": "XTREME",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204401,
    "name": "天使光輪",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204402,
    "name": "Ultra Red",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204403,
    "name": "サイクルヒット",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204404,
    "name": "Strange Bar",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204405,
    "name": "Murasaki",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204406,
    "name": "Mazy Metroplex",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204407,
    "name": "LOSE CONTROL",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204408,
    "name": "†DOOF†SENC†",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204409,
    "name": "Shiny Memory feat.Yukacco",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204410,
    "name": "BLVST BEVT",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204411,
    "name": "JINGLE DEATH",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204412,
    "name": "Invisible Frenzy",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204413,
    "name": "VOX Diamond",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204414,
    "name": "Chariot",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204415,
    "name": "Akareram",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204416,
    "name": "Galaxy Friends",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204417,
    "name": "13 Donkeys",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204418,
    "name": "ADAM",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204419,
    "name": "ATARAX1A",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204420,
    "name": "HiGHER",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204421,
    "name": "Source of Creation",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204422,
    "name": "Exitium",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204423,
    "name": "Blaze",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204424,
    "name": "GRiDGALAXY",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204425,
    "name": "Jingle",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204426,
    "name": "BATTLE NO.1",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204427,
    "name": "LEVATEiN feat. 野宮あゆみ",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204428,
    "name": "BIG HEAD BANGING",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204429,
    "name": "Knight Rider",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204430,
    "name": "PARALLEL★PRISM",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204431,
    "name": "Rainbow Dream",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204432,
    "name": "Quon",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204433,
    "name": "Poseidon",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204434,
    "name": "HELL FLAME",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204435,
    "name": "Gate One",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204436,
    "name": "Over My Hand",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204437,
    "name": "Are You Ready",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204438,
    "name": "MEMORiZE",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204439,
    "name": "illanai-assorted",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204440,
    "name": "Sunshine",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204441,
    "name": "BOOM! BOOM!! BOOM!!!",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204442,
    "name": "Ever Free(Raw Edit)",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204443,
    "name": "Try again",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204444,
    "name": "BLUE SKY feat. 野宮あゆみ",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204445,
    "name": "Sound Chimera",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204446,
    "name": "Soldiers",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204447,
    "name": "Fight for the CORE feat. Daisuke",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204448,
    "name": "Shining Harmony",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204449,
    "name": "患部で止まってすぐ溶ける ～ 狂気の優曇華院",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204450,
    "name": "物凄い勢いでけーねが物凄いうた",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204451,
    "name": "PUPA",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204452,
    "name": "Destr0yer",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204453,
    "name": "もぺもぺ",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204454,
    "name": "Popping Happiness!",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204455,
    "name": "Madwing",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204456,
    "name": "TRICKL4SH 220",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204457,
    "name": "チルノは覚醒サマーデイズ！",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204458,
    "name": "エピクロスの虹はもう見えない",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204459,
    "name": "ARROW RAIN feat.ayame",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204460,
    "name": "四次元跳躍機関",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204461,
    "name": "Destructive Little Sister",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204462,
    "name": "運命を操る 程度の能力",
    "acquisition": "「東方紅魔郷 × WACCA」\r\nイベントゲート達成報酬",
    "acquisitionEnglish": "\"Touhou: Embodiment of Scarlet Devil X WACCA\"\r\nEvent Gate achievement reward."
  },
  {
    "id": 204463,
    "name": "ありとあらゆるものを破壊する 程度の能力",
    "acquisition": "「東方紅魔郷 × WACCA」\r\nイベントゲート達成報酬",
    "acquisitionEnglish": "\"Touhou: Embodiment of Scarlet Devil X WACCA\"\r\nEvent Gate achievement reward."
  },
  {
    "id": 204464,
    "name": "そーなのかー",
    "acquisition": "「東方紅魔郷 × WACCA」\r\nイベントゲート達成報酬",
    "acquisitionEnglish": "\"Touhou: Embodiment of Scarlet Devil X WACCA\"\r\nEvent Gate achievement reward."
  },
  {
    "id": 204465,
    "name": "ねぇねぇ 、 今どんな気持ち？",
    "acquisition": "4月1日～4月8日\r\nプレイで獲得",
    "acquisitionEnglish": "Play between\r\nApril 1st and April 8th."
  },
  {
    "id": 204466,
    "name": "連休 繋げるマン",
    "acquisition": "4月29日～5月5日\r\nプレイで獲得",
    "acquisitionEnglish": "Play between\r\nApril 29th and May 5th."
  },
  {
    "id": 204467,
    "name": "LOVE!HUG!GROOVY!!",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204468,
    "name": "Dig Delight!",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204469,
    "name": "電乱★カウントダウン",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204470,
    "name": "Photon Melodies",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204471,
    "name": "ぐるぐるDJ TURN!!",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204472,
    "name": "やけにインザレイン feat. 小林私",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204473,
    "name": "Traveller",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204474,
    "name": "FLVSH OUT",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204475,
    "name": "BSCS",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204479,
    "name": "Night Club Junkie",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204480,
    "name": "Cauliflower",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204481,
    "name": "Purple Skies",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204482,
    "name": "Happy Around!",
    "acquisition": "「D4DJ Groovy Mix × WACCA」\r\nイベントゲート達成報酬",
    "acquisitionEnglish": "\"D4DJ Groovy Mix X WACCA\"\r\nEvent Gate achievement reward."
  },
  {
    "id": 204483,
    "name": "Peaky P-key",
    "acquisition": "「D4DJ Groovy Mix × WACCA」\r\nイベントゲート達成報酬",
    "acquisitionEnglish": "\"D4DJ Groovy Mix X WACCA\"\r\nEvent Gate achievement reward."
  },
  {
    "id": 204484,
    "name": "Photon Maiden",
    "acquisition": "「D4DJ Groovy Mix × WACCA」\r\nイベントゲート達成報酬",
    "acquisitionEnglish": "\"D4DJ Groovy Mix X WACCA\"\r\nEvent Gate achievement reward."
  },
  {
    "id": 204485,
    "name": "Dで 始まる 新世界",
    "acquisition": "「D4DJ Groovy Mix × WACCA」\r\nイベントゲート達成報酬",
    "acquisitionEnglish": "\"D4DJ Groovy Mix X WACCA\"\r\nEvent Gate achievement reward."
  },
  {
    "id": 204486,
    "name": "ソロモン・ナイト",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204487,
    "name": "cœur",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204488,
    "name": "私はNo 1！",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204489,
    "name": "Eternal Ending",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204490,
    "name": "Lost Illusion",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204491,
    "name": "EVE",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204492,
    "name": "eden",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204493,
    "name": "Silentphobia",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204494,
    "name": "さんさーら！",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on \r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 204495,
    "name": "クロキッド",
    "acquisition": "「アズールレーン × WACCA」\r\nイベントゲート達成報酬",
    "acquisitionEnglish": "\"Azur Lane X WACCA\"\r\nEvent Gate achievement reward."
  },
  {
    "id": 204496,
    "name": "ヴィスカー",
    "acquisition": "「アズールレーン × WACCA」\r\nイベントゲート達成報酬",
    "acquisitionEnglish": "\"Azur Lane X WACCA\"\r\nEvent Gate achievement reward."
  },
  {
    "id": 204497,
    "name": "クラップ",
    "acquisition": "「アズールレーン × WACCA」\r\nイベントゲート達成報酬",
    "acquisitionEnglish": "\"Azur Lane X WACCA\"\r\nEvent Gate achievement reward."
  },
  {
    "id": 204498,
    "name": "蔵王重工",
    "acquisition": "「アズールレーン × WACCA」\r\nイベントゲート達成報酬",
    "acquisitionEnglish": "\"Azur Lane X WACCA\"\r\nEvent Gate achievement reward."
  },
  {
    "id": 204499,
    "name": "永遠 の 結末",
    "acquisition": "｢エクストラゲート2｣達成報酬",
    "acquisitionEnglish": "\"Extra Gate 2\" achievement reward."
  },
  {
    "id": 204500,
    "name": "失われた 幻想",
    "acquisition": "｢エクストラゲート2｣達成報酬",
    "acquisitionEnglish": "\"Extra Gate 2\" achievement reward."
  },
  {
    "id": 204501,
    "name": "禁断 の 果実",
    "acquisition": "｢エクストラゲート2｣達成報酬",
    "acquisitionEnglish": "\"Extra Gate 2\" achievement reward."
  },
  {
    "id": 204502,
    "name": "理想郷",
    "acquisition": "｢エクストラゲート2｣達成報酬",
    "acquisitionEnglish": "\"Extra Gate 2\" achievement reward."
  },
  {
    "id": 204503,
    "name": "畏怖なる 静寂",
    "acquisition": "｢エクストラゲート2｣達成報酬",
    "acquisitionEnglish": "\"Extra Gate 2\" achievement reward."
  },
  {
    "id": 204504,
    "name": "笹 食え",
    "acquisition": "7月7日～7月14日\r\nプレイで獲得",
    "acquisitionEnglish": "Play between\r\nJuly 7th and July 14th."
  },
  {
    "id": 204505,
    "name": "2周年 の お祝い",
    "acquisition": "WACCA2周年！\r\nいつもプレイしてくれてありがとう！\r\n期間中にプレイ",
    "acquisitionEnglish": "WACCA 2nd Anniversary!\r\nThank you for playing!\r\nEarned by playing during the period."
  },
  {
    "id": 304001,
    "name": "Avant Raze",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 304002,
    "name": "#1f1e33",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 304003,
    "name": "Arcahv",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 304004,
    "name": "最強STRONGER",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 304005,
    "name": "Sheriruth (Laur Remix)",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 304006,
    "name": "Let you DIVE! (nitro rmx)",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 304007,
    "name": "うっせぇわ",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 304008,
    "name": "Fam☆Fam☆Time!",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 304009,
    "name": "KING",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 304010,
    "name": "ダーリンダンス",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 304011,
    "name": "サマータイムレコード",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 304012,
    "name": "トリノコシティ",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 304013,
    "name": "Crime Wave",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 304014,
    "name": "Machinery of Avoid",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 304015,
    "name": "Datamania (tpz Overheat Remix)",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 304016,
    "name": "Ouvertüre",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 304017,
    "name": "Love Kills U",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 304018,
    "name": "超MANJIラッシュ",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 304019,
    "name": "Kira☆Kira☆Night",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 304020,
    "name": "YOG",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 304021,
    "name": "Meta-Mysteria",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 304022,
    "name": "透明声彩",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 304023,
    "name": "Fly to NEW WORLD",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 304024,
    "name": "叩ケ　叩ケ　手ェ叩ケ",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 304025,
    "name": "とんでもねぇ、  待ってたんだ。",
    "acquisition": "｢リバースボックス｣から獲得",
    "acquisitionEnglish": "Obtained from a \"Reverse Box\"."
  },
  {
    "id": 304026,
    "name": "ものすごく  すごい",
    "acquisition": "｢リバースボックス｣から獲得",
    "acquisitionEnglish": "Obtained from a \"Reverse Box\"."
  },
  {
    "id": 304027,
    "name": "姉妹 からの ありがたいおことば",
    "acquisition": "｢リバースボックス｣から獲得",
    "acquisitionEnglish": "Obtained from a \"Reverse Box\"."
  },
  {
    "id": 304028,
    "name": "譜面作る人しか取れない配置",
    "acquisition": "｢リバースボックス｣から獲得",
    "acquisitionEnglish": "Obtained from a \"Reverse Box\"."
  },
  {
    "id": 304029,
    "name": "おじごろ",
    "acquisition": "｢リバースボックス｣から獲得",
    "acquisitionEnglish": "Obtained from a \"Reverse Box\"."
  },
  {
    "id": 304030,
    "name": "食  神",
    "acquisition": "｢リバースボックス｣から獲得",
    "acquisitionEnglish": "Obtained from a \"Reverse Box\"."
  },
  {
    "id": 304031,
    "name": "あいつ  ダイブ",
    "acquisition": "｢リバースボックス｣から獲得",
    "acquisitionEnglish": "Obtained from a \"Reverse Box\"."
  },
  {
    "id": 304032,
    "name": "ダイエット が 必要？",
    "acquisition": "｢リバースボックス｣から獲得",
    "acquisitionEnglish": "Obtained from a \"Reverse Box\"."
  },
  {
    "id": 304033,
    "name": "私の 音を 聞け！",
    "acquisition": "｢リバースボックス｣から獲得",
    "acquisitionEnglish": "Obtained from a \"Reverse Box\"."
  },
  {
    "id": 304034,
    "name": "ぼく も 入りたいです",
    "acquisition": "｢リバースボックス｣から獲得",
    "acquisitionEnglish": "Obtained from a \"Reverse Box\"."
  },
  {
    "id": 304035,
    "name": "目覚める  食い気",
    "acquisition": "｢リバースボックス｣から獲得",
    "acquisitionEnglish": "Obtained from a \"Reverse Box\"."
  },
  {
    "id": 304036,
    "name": "さあ  出かけよう",
    "acquisition": "｢リバースボックス｣から獲得",
    "acquisitionEnglish": "Obtained from a \"Reverse Box\"."
  },
  {
    "id": 304037,
    "name": "本当 は scary girl",
    "acquisition": "｢リバースボックス｣から獲得",
    "acquisitionEnglish": "Obtained from a \"Reverse Box\"."
  },
  {
    "id": 304038,
    "name": "超  クール",
    "acquisition": "｢リバースボックス｣から獲得",
    "acquisitionEnglish": "Obtained from a \"Reverse Box\"."
  },
  {
    "id": 304039,
    "name": "サイン  ください！",
    "acquisition": "｢リバースボックス｣から獲得",
    "acquisitionEnglish": "Obtained from a \"Reverse Box\"."
  },
  {
    "id": 304040,
    "name": "何もないところで  なんでなんですか",
    "acquisition": "｢リバースボックス｣から獲得",
    "acquisitionEnglish": "Obtained from a \"Reverse Box\"."
  },
  {
    "id": 304041,
    "name": "… … …？",
    "acquisition": "｢リバースボックス｣から獲得",
    "acquisitionEnglish": "Obtained from a \"Reverse Box\"."
  },
  {
    "id": 304042,
    "name": "成分  補給",
    "acquisition": "｢リバースボックス｣から獲得",
    "acquisitionEnglish": "Obtained from a \"Reverse Box\"."
  },
  {
    "id": 304043,
    "name": "マフラー  トカゲ",
    "acquisition": "｢リバースボックス｣から獲得",
    "acquisitionEnglish": "Obtained from a \"Reverse Box\"."
  },
  {
    "id": 304044,
    "name": "筋肉 で 解決しよう",
    "acquisition": "｢リバースボックス｣から獲得",
    "acquisitionEnglish": "Obtained from a \"Reverse Box\"."
  },
  {
    "id": 304045,
    "name": "カレー に 操られている",
    "acquisition": "｢リバースボックス｣から獲得",
    "acquisitionEnglish": "Obtained from a \"Reverse Box\"."
  },
  {
    "id": 304046,
    "name": "大丈夫 な お肉",
    "acquisition": "｢リバースボックス｣から獲得",
    "acquisitionEnglish": "Obtained from a \"Reverse Box\"."
  },
  {
    "id": 304047,
    "name": "特技 は 音ゲーです。",
    "acquisition": "｢リバースボックス｣から獲得",
    "acquisitionEnglish": "Obtained from a \"Reverse Box\"."
  },
  {
    "id": 304048,
    "name": "いつもより  多く？",
    "acquisition": "｢リバースボックス｣から獲得",
    "acquisitionEnglish": "Obtained from a \"Reverse Box\"."
  },
  {
    "id": 304049,
    "name": "戦う  少年",
    "acquisition": "｢リバースボックス｣から獲得",
    "acquisitionEnglish": "Obtained from a \"Reverse Box\"."
  },
  {
    "id": 304050,
    "name": "守る  少女",
    "acquisition": "｢リバースボックス｣から獲得",
    "acquisitionEnglish": "Obtained from a \"Reverse Box\"."
  },
  {
    "id": 304051,
    "name": "WACCA Reverse ステージI  クリア！",
    "acquisition": "WACCA Reverse ステージアップ\r\nステージ I をクリアする",
    "acquisitionEnglish": "Clear Stage I in\r\nWACCA Reverse Stage Up."
  },
  {
    "id": 304052,
    "name": "WACCA Reverse ステージII  クリア！",
    "acquisition": "WACCA Reverse ステージアップ\r\nステージ II をクリアする",
    "acquisitionEnglish": "Clear Stage II in\r\nWACCA Reverse Stage Up."
  },
  {
    "id": 304053,
    "name": "WACCA Reverse ステージIII  クリア！",
    "acquisition": "WACCA Reverse ステージアップ\r\nステージ III をクリアする",
    "acquisitionEnglish": "Clear Stage III in\r\nWACCA Reverse Stage Up."
  },
  {
    "id": 304054,
    "name": "WACCA Reverse ステージIV  クリア！",
    "acquisition": "WACCA Reverse ステージアップ\r\nステージ IV をクリアする",
    "acquisitionEnglish": "Clear Stage IV in\r\nWACCA Reverse Stage Up."
  },
  {
    "id": 304055,
    "name": "WACCA Reverse ステージV  クリア！",
    "acquisition": "WACCA Reverse ステージアップ\r\nステージ V をクリアする",
    "acquisitionEnglish": "Clear Stage V in\r\nWACCA Reverse Stage Up."
  },
  {
    "id": 304056,
    "name": "WACCA Reverse ステージVI  クリア！",
    "acquisition": "WACCA Reverse ステージアップ\r\nステージ VI をクリアする",
    "acquisitionEnglish": "Clear Stage VI in\r\nWACCA Reverse Stage Up."
  },
  {
    "id": 304057,
    "name": "WACCA Reverse ステージVII  クリア！",
    "acquisition": "WACCA Reverse ステージアップ\r\nステージ VII をクリアする",
    "acquisitionEnglish": "Clear Stage VII in\r\nWACCA Reverse Stage Up."
  },
  {
    "id": 304058,
    "name": "WACCA Reverse ステージVIII  クリア！",
    "acquisition": "WACCA Reverse ステージアップ\r\nステージ VIII をクリアする",
    "acquisitionEnglish": "Clear Stage VIII in\r\nWACCA Reverse Stage Up."
  },
  {
    "id": 304059,
    "name": "WACCA Reverse ステージIX  クリア！",
    "acquisition": "WACCA Reverse ステージアップ\r\nステージ IX をクリアする",
    "acquisitionEnglish": "Clear Stage IX in\r\nWACCA Reverse Stage Up."
  },
  {
    "id": 304060,
    "name": "WACCA Reverse ステージX  クリア！",
    "acquisition": "WACCA Reverse ステージアップ\r\nステージ X をクリアする",
    "acquisitionEnglish": "Clear Stage X in\r\nWACCA Reverse Stage Up."
  },
  {
    "id": 304061,
    "name": "WACCA Reverse ステージXI  クリア！",
    "acquisition": "WACCA Reverse ステージアップ\r\nステージ XI をクリアする",
    "acquisitionEnglish": "Clear Stage XI in\r\nWACCA Reverse Stage Up."
  },
  {
    "id": 304062,
    "name": "WACCA Reverse ステージXII  クリア！",
    "acquisition": "WACCA Reverse ステージアップ\r\nステージ XII をクリアする",
    "acquisitionEnglish": "Clear Stage XII in\r\nWACCA Reverse Stage Up."
  },
  {
    "id": 304063,
    "name": "WACCA Reverse ステージXIII  クリア！",
    "acquisition": "WACCA Reverse ステージアップ\r\nステージ XIII をクリアする",
    "acquisitionEnglish": "Clear Stage XIII in\r\nWACCA Reverse Stage Up."
  },
  {
    "id": 304064,
    "name": "WACCA Reverse ステージXIV  クリア！",
    "acquisition": "WACCA Reverse ステージアップ\r\nステージ XIV をクリアする",
    "acquisitionEnglish": "Clear Stage XIV in\r\nWACCA Reverse Stage Up."
  },
  {
    "id": 304065,
    "name": "WACCA Reverse 紺レート  達成！",
    "acquisition": "WACCA Reverse\r\nレーティング値300達成",
    "acquisitionEnglish": "WACCA Reverse\r\nAchieve a rating of 300."
  },
  {
    "id": 304066,
    "name": "WACCA Reverse 黄レート  達成！",
    "acquisition": "WACCA Reverse\r\nレーティング値600達成",
    "acquisitionEnglish": "WACCA Reverse\r\nAchieve a rating of 600."
  },
  {
    "id": 304067,
    "name": "WACCA Reverse 赤レート  達成！",
    "acquisition": "WACCA Reverse\r\nレーティング値1000達成",
    "acquisitionEnglish": "WACCA Reverse\r\nAchieve a rating of 1000."
  },
  {
    "id": 304068,
    "name": "WACCA Reverse 紫レート  達成！",
    "acquisition": "WACCA Reverse\r\nレーティング値1300達成",
    "acquisitionEnglish": "WACCA Reverse\r\nAchieve a rating of 1300."
  },
  {
    "id": 304069,
    "name": "WACCA Reverse 青レート  達成！",
    "acquisition": "WACCA Reverse\r\nレーティング値1600達成",
    "acquisitionEnglish": "WACCA Reverse\r\nAchieve a rating of 1600."
  },
  {
    "id": 304070,
    "name": "WACCA Reverse 銀レート  達成！",
    "acquisition": "WACCA Reverse\r\nレーティング値1900達成",
    "acquisitionEnglish": "WACCA Reverse\r\nAchieve a rating of 1900."
  },
  {
    "id": 304071,
    "name": "WACCA Reverse 金レート  達成！",
    "acquisition": "WACCA Reverse\r\nレーティング値2200達成",
    "acquisitionEnglish": "WACCA Reverse\r\nAchieve a rating of 2200."
  },
  {
    "id": 304072,
    "name": "WACCA Reverse 虹レート  達成！",
    "acquisition": "WACCA Reverse\r\nレーティング値2500達成",
    "acquisitionEnglish": "WACCA Reverse\r\nAchieve a rating of 2500."
  },
  {
    "id": 304073,
    "name": "精神と 時の アレ",
    "acquisition": "シングルプレイ(フリータイム)\r\nを10回プレイ",
    "acquisitionEnglish": "Play Single Player (Free Time)\r\n10 times."
  },
  {
    "id": 304074,
    "name": "背中 は 任せた",
    "acquisition": "マルチプレイ COOP\r\nを1回プレイ",
    "acquisitionEnglish": "Play Multiplayer Co-op\r\n1 time."
  },
  {
    "id": 304075,
    "name": "WACCA Reverse  はじめました",
    "acquisition": "｢WACCA Reverse ゲート｣\r\n達成報酬",
    "acquisitionEnglish": "\"WACCA Reverse Gate\"\r\nachievement reward."
  },
  {
    "id": 304076,
    "name": "逆 に 考えよう",
    "acquisition": "｢WACCA Reverse ゲート｣\r\n達成報酬",
    "acquisitionEnglish": "\"WACCA Reverse Gate\"\r\nachievement reward."
  },
  {
    "id": 304077,
    "name": "円の中 にも 三年",
    "acquisition": "｢WACCA Reverse ゲート｣\r\n達成報酬",
    "acquisitionEnglish": "\"WACCA Reverse Gate\"\r\nachievement reward."
  },
  {
    "id": 304078,
    "name": "急がば  回せ",
    "acquisition": "｢WACCA Reverse ゲート｣\r\n達成報酬",
    "acquisitionEnglish": "\"WACCA Reverse Gate\"\r\nachievement reward."
  },
  {
    "id": 304079,
    "name": "回す門 には 福来る",
    "acquisition": "｢WACCA Reverse ゲート｣\r\n達成報酬",
    "acquisitionEnglish": "\"WACCA Reverse Gate\"\r\nachievement reward."
  },
  {
    "id": 304080,
    "name": "輪に入っては  輪に従え",
    "acquisition": "｢WACCA Reverse ゲート｣\r\n達成報酬",
    "acquisitionEnglish": "\"WACCA Reverse Gate\"\r\nachievement reward."
  },
  {
    "id": 304081,
    "name": "一級  穴掘師",
    "acquisition": "｢WACCA Reverse ゲート｣\r\n達成報酬",
    "acquisitionEnglish": "\"WACCA Reverse Gate\"\r\nachievement reward."
  },
  {
    "id": 304082,
    "name": "WACCA に 溺れる",
    "acquisition": "｢WACCA Reverse ゲート｣\r\n達成報酬",
    "acquisitionEnglish": "\"WACCA Reverse Gate\"\r\nachievement reward."
  },
  {
    "id": 304083,
    "name": "回せば  回すほど",
    "acquisition": "｢WACCA Reverse ゲート｣\r\n達成報酬",
    "acquisitionEnglish": "\"WACCA Reverse Gate\"\r\nachievement reward."
  },
  {
    "id": 304084,
    "name": "虹色  ドーナツ",
    "acquisition": "｢WACCA Reverse ゲート｣\r\n達成報酬",
    "acquisitionEnglish": "\"WACCA Reverse Gate\"\r\nachievement reward."
  },
  {
    "id": 304085,
    "name": "表 と 裏",
    "acquisition": "｢WACCA Reverse ゲート｣\r\n達成報酬",
    "acquisitionEnglish": "\"WACCA Reverse Gate\"\r\nachievement reward."
  },
  {
    "id": 304086,
    "name": "ハード コア 粘着",
    "acquisition": "｢WACCA Reverse ゲート｣\r\n達成報酬",
    "acquisitionEnglish": "\"WACCA Reverse Gate\"\r\nachievement reward."
  },
  {
    "id": 304087,
    "name": "新た な 存在",
    "acquisition": "｢WACCA Reverse ゲート｣\r\n達成報酬",
    "acquisitionEnglish": "\"WACCA Reverse Gate\"\r\nachievement reward."
  },
  {
    "id": 304088,
    "name": "敵か  味方か",
    "acquisition": "｢WACCA Reverse ゲート｣\r\n達成報酬",
    "acquisitionEnglish": "\"WACCA Reverse Gate\"\r\nachievement reward."
  },
  {
    "id": 304089,
    "name": "ゾクゾク  するねぇ",
    "acquisition": "｢WACCA Reverse ゲート｣\r\n達成報酬",
    "acquisitionEnglish": "\"WACCA Reverse Gate\"\r\nachievement reward."
  },
  {
    "id": 304090,
    "name": "激闘 の 末",
    "acquisition": "｢WACCA Reverse ゲート｣\r\n達成報酬",
    "acquisitionEnglish": "\"WACCA Reverse Gate\"\r\nachievement reward."
  },
  {
    "id": 304091,
    "name": "強者 に 魅入られる",
    "acquisition": "｢WACCA Reverse ゲート｣\r\n達成報酬",
    "acquisitionEnglish": "\"WACCA Reverse Gate\"\r\nachievement reward."
  },
  {
    "id": 304092,
    "name": "深淵 に 触れし者",
    "acquisition": "｢WACCA Reverse ゲート｣\r\n達成報酬",
    "acquisitionEnglish": "\"WACCA Reverse Gate\"\r\nachievement reward."
  },
  {
    "id": 304093,
    "name": "光 の 奏でる調和",
    "acquisition": "「Arcaea × WACCA」\r\nイベントゲート達成報酬",
    "acquisitionEnglish": "\"Arcaea X WACCA\"\r\nEvent Gate achievement reward."
  },
  {
    "id": 304094,
    "name": "音 が 対立する",
    "acquisition": "「Arcaea × WACCA」\r\nイベントゲート達成報酬",
    "acquisitionEnglish": "\"Arcaea X WACCA\"\r\nEvent Gate achievement reward."
  },
  {
    "id": 304095,
    "name": "WACCA を 極めし者",
    "acquisition": "プレイヤーレベルを\r\n６００にする",
    "acquisitionEnglish": "Reach Player Level\r\n600."
  },
  {
    "id": 304096,
    "name": "輪術  皆伝",
    "acquisition": "プレイヤーレベルを\r\n７００にする",
    "acquisitionEnglish": "Reach Player Level\r\n700."
  },
  {
    "id": 304097,
    "name": "WACCA  元帥",
    "acquisition": "プレイヤーレベルを\r\n８００にする",
    "acquisitionEnglish": "Reach Player Level\r\n800."
  },
  {
    "id": 304098,
    "name": "修羅 の 猛進",
    "acquisition": "プレイヤーレベルを\r\n９００にする",
    "acquisitionEnglish": "Reach Player Level\r\n900."
  },
  {
    "id": 304099,
    "name": "国士  無双",
    "acquisition": "プレイヤーレベルを\r\n９９９にする",
    "acquisitionEnglish": "Reach Player Level\r\n999."
  },
  {
    "id": 304100,
    "name": "Break Through Myself feat. Risa Yuzuki",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 304101,
    "name": "Chobit Flavor",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 304102,
    "name": "D3LTA QOMPLEX",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 304103,
    "name": "メニメニマニマニ",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 304104,
    "name": "ちがう!!!",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 304105,
    "name": "怪盗Fの台本（シナリオ）〜消えたダイヤの謎〜",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 304106,
    "name": "おねがいダーリン",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 304107,
    "name": "頼もしい  仲間たち",
    "acquisition": "「TANO*C EX*Stream」\r\nイベントゲート達成報酬",
    "acquisitionEnglish": "\"TANO*C EX*Stream\"\r\nEvent Gate achievement reward."
  },
  {
    "id": 304108,
    "name": "お金 が ない",
    "acquisition": "「TANO*C EX*Stream」\r\nイベントゲート達成報酬",
    "acquisitionEnglish": "\"TANO*C EX*Stream\"\r\nEvent Gate achievement reward."
  },
  {
    "id": 304109,
    "name": "戦い が 一番",
    "acquisition": "「TANO*C EX*Stream」\r\nイベントゲート達成報酬",
    "acquisitionEnglish": "\"TANO*C EX*Stream\"\r\nEvent Gate achievement reward."
  },
  {
    "id": 304110,
    "name": "あー  忙しい忙しい",
    "acquisition": "「TANO*C EX*Stream」\r\nイベントゲート達成報酬",
    "acquisitionEnglish": "\"TANO*C EX*Stream\"\r\nEvent Gate achievement reward."
  },
  {
    "id": 304111,
    "name": "逆  ゼウス",
    "acquisition": "「TANO*C EX*Stream」\r\nイベントゲート達成報酬",
    "acquisitionEnglish": "\"TANO*C EX*Stream\"\r\nEvent Gate achievement reward."
  },
  {
    "id": 304112,
    "name": "助けてくれー",
    "acquisition": "「TANO*C EX*Stream」\r\nイベントゲート達成報酬",
    "acquisitionEnglish": "\"TANO*C EX*Stream\"\r\nEvent Gate achievement reward."
  },
  {
    "id": 304113,
    "name": "ありえない  快感",
    "acquisition": "「TANO*C EX*Stream」\r\nイベントゲート達成報酬",
    "acquisitionEnglish": "\"TANO*C EX*Stream\"\r\nEvent Gate achievement reward."
  },
  {
    "id": 304114,
    "name": "ゴリゴリ の 縦社会",
    "acquisition": "「TANO*C EX*Stream」\r\nイベントゲート達成報酬",
    "acquisitionEnglish": "\"TANO*C EX*Stream\"\r\nEvent Gate achievement reward."
  },
  {
    "id": 304115,
    "name": "Requiem  …",
    "acquisition": "「TANO*C EX*Stream」\r\nイベントゲート達成報酬",
    "acquisitionEnglish": "\"TANO*C EX*Stream\"\r\nEvent Gate achievement reward."
  },
  {
    "id": 304116,
    "name": "炉心融解",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 304117,
    "name": "ワールズエンド・ダンスホール",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 304118,
    "name": "∞(2018Remake)",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 304119,
    "name": "Lights of Muse",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 304120,
    "name": "The 90's Decision",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 304121,
    "name": "粉骨砕身カジノゥ",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 304122,
    "name": "恋のMoonlight",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 304123,
    "name": "Comet Coaster",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 304124,
    "name": "XODUS",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 304125,
    "name": "いたずら  すんぞ",
    "acquisition": "10月31日～11月7日\r\nプレイで獲得",
    "acquisitionEnglish": "Play between\r\nOctober 31st and November 7th."
  },
  {
    "id": 304126,
    "name": "闘神祭2021 予選出場！",
    "acquisition": "「闘神祭2021」\r\n出場",
    "acquisitionEnglish": "\"Toushinsai 2021\"\r\nparticipation reward."
  },
  {
    "id": 304127,
    "name": "闘神祭2021 決勝出場！",
    "acquisition": "「闘神祭2021」\r\n決勝進出",
    "acquisitionEnglish": "Advance to the finals at\r\n\"Toushinsai 2021\"."
  },
  {
    "id": 304128,
    "name": "闘神 -2021-",
    "acquisition": "「闘神祭2021」\r\n優勝",
    "acquisitionEnglish": "Claim victory at\r\n\"Toushinsai 2021\"."
  },
  {
    "id": 304129,
    "name": "ベーシスト",
    "acquisition": "「Muse Dash × WACCA」\r\nイベントゲート達成報酬",
    "acquisitionEnglish": "\"Muse Dash X WACCA\"\r\nEvent Gate achievement reward."
  },
  {
    "id": 304130,
    "name": "不良  少女",
    "acquisition": "「Muse Dash × WACCA」\r\nイベントゲート達成報酬",
    "acquisitionEnglish": "\"Muse Dash X WACCA\"\r\nEvent Gate achievement reward."
  },
  {
    "id": 304131,
    "name": "夢遊  少女",
    "acquisition": "「Muse Dash × WACCA」\r\nイベントゲート達成報酬",
    "acquisitionEnglish": "\"Muse Dash X WACCA\"\r\nEvent Gate achievement reward."
  },
  {
    "id": 304132,
    "name": "パイロット",
    "acquisition": "「Muse Dash × WACCA」\r\nイベントゲート達成報酬",
    "acquisitionEnglish": "\"Muse Dash X WACCA\"\r\nEvent Gate achievement reward."
  },
  {
    "id": 304133,
    "name": "ジョーカー",
    "acquisition": "「Muse Dash × WACCA」\r\nイベントゲート達成報酬",
    "acquisitionEnglish": "\"Muse Dash X WACCA\"\r\nEvent Gate achievement reward."
  },
  {
    "id": 304134,
    "name": "アイドル",
    "acquisition": "「Muse Dash × WACCA」\r\nイベントゲート達成報酬",
    "acquisitionEnglish": "\"Muse Dash X WACCA\"\r\nEvent Gate achievement reward."
  },
  {
    "id": 304135,
    "name": "バイオリニスト",
    "acquisition": "「Muse Dash × WACCA」\r\nイベントゲート達成報酬",
    "acquisitionEnglish": "\"Muse Dash X WACCA\"\r\nEvent Gate achievement reward."
  },
  {
    "id": 304136,
    "name": "メイド",
    "acquisition": "「Muse Dash × WACCA」\r\nイベントゲート達成報酬",
    "acquisitionEnglish": "\"Muse Dash X WACCA\"\r\nEvent Gate achievement reward."
  },
  {
    "id": 304137,
    "name": "黒衣 の 女王",
    "acquisition": "「Muse Dash × WACCA」\r\nイベントゲート達成報酬",
    "acquisitionEnglish": "\"Muse Dash X WACCA\"\r\nEvent Gate achievement reward."
  },
  {
    "id": 304138,
    "name": "花たちに希望を",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 304139,
    "name": "NightTheater",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 304140,
    "name": "ヒトガタ",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 304141,
    "name": "DANGEROOOOUS JUNGLE",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 304142,
    "name": "Dimension Hacker",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 304143,
    "name": "EPHMR",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 304144,
    "name": "クリムゾン帝王",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 304145,
    "name": "メルト",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 304146,
    "name": "天樂",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 304147,
    "name": "吉原ラメント",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 304148,
    "name": "アゲナゲン",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 304149,
    "name": "ファムファタール",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 304150,
    "name": "cloud Ⅸ",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 304151,
    "name": "いつになく  寒いな",
    "acquisition": "12月24日～12月31日\r\nプレイで獲得",
    "acquisitionEnglish": "Play between\r\nDecember 24th and December 31."
  },
  {
    "id": 304152,
    "name": "こたつ de みかん",
    "acquisition": "1月1日～1月8日\r\nプレイで獲得",
    "acquisitionEnglish": "Play between\r\nJanuary 1st and January 11th."
  },
  {
    "id": 304153,
    "name": "福 は うち",
    "acquisition": "2月3日～2月10日\r\nプレイで獲得",
    "acquisitionEnglish": "Play between\r\nFebruary 3rd and February 10th."
  },
  {
    "id": 304154,
    "name": "そんなに  甘くない",
    "acquisition": "2月14日～2月21日\r\nプレイで獲得",
    "acquisitionEnglish": "Play between\r\nFebruary 14th and February 21st."
  },
  {
    "id": 304155,
    "name": "ひな  遊び",
    "acquisition": "3月3日～3月10日\r\nプレイで獲得",
    "acquisitionEnglish": "Play between\r\nMarch 3rd and March 10th."
  },
  {
    "id": 304156,
    "name": "嘘 で あってくれ",
    "acquisition": "4月1日～4月8日\r\nプレイで獲得",
    "acquisitionEnglish": "Play between\r\nApril 1st and April 8th."
  },
  {
    "id": 304157,
    "name": "五月病 の 元凶",
    "acquisition": "4月29日～5月5日\r\nプレイで獲得",
    "acquisitionEnglish": "Play between\r\nApril 29th and May 5th."
  },
  {
    "id": 304158,
    "name": "願うだけ なら タダ",
    "acquisition": "7月7日～7月14日\r\nプレイで獲得",
    "acquisitionEnglish": "Play between\r\nJuly 7th and July 14th."
  },
  {
    "id": 304159,
    "name": "儚き  存在",
    "acquisition": "｢エクストラゲート3｣達成報酬",
    "acquisitionEnglish": "\"Extra Gate 3\" achievement reward."
  },
  {
    "id": 304160,
    "name": "危険  地帯",
    "acquisition": "｢エクストラゲート3｣達成報酬",
    "acquisitionEnglish": "\"Extra Gate 3\" achievement reward."
  },
  {
    "id": 304161,
    "name": "次元 の 超越者",
    "acquisition": "｢エクストラゲート3｣達成報酬",
    "acquisitionEnglish": "\"Extra Gate 3\" achievement reward."
  },
  {
    "id": 304162,
    "name": "深紅 の 帝王",
    "acquisition": "｢エクストラゲート3｣達成報酬",
    "acquisitionEnglish": "\"Extra Gate 3\" achievement reward."
  },
  {
    "id": 304163,
    "name": "CENSORED!!",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTを\r\n各１回ずつクリアする",
    "acquisitionEnglish": "Clear each song\r\nlisted above on\r\nNORMAL/HARD/EXPERT."
  },
  {
    "id": 304164,
    "name": "Grip & Break down !!",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTを\r\n各１回ずつクリアする",
    "acquisitionEnglish": "Clear each song\r\nlisted above on\r\nNORMAL/HARD/EXPERT."
  },
  {
    "id": 304165,
    "name": "神",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTを\r\n各１回ずつクリアする",
    "acquisitionEnglish": "Clear each song\r\nlisted above on\r\nNORMAL/HARD/EXPERT."
  },
  {
    "id": 304166,
    "name": "Candy Star",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 304167,
    "name": "Onigami",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 304168,
    "name": "Invisible Frenzy (Camellia's \"593: Insanely Fluctuated\" Remix)",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 304169,
    "name": "GENOCIDER (Kobaryo's FTN-Remix)",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 304170,
    "name": "このまま  最後まで！",
    "acquisition": "ステージアップ\r\n｢SPURT Re:MIX Vol.1｣\r\nをクリアする",
    "acquisitionEnglish": "Clear Stage Up\r\n\"SPURT Re:MIX Vol.1\"."
  },
  {
    "id": 304171,
    "name": "姉さま には 近づけさせないから！",
    "acquisition": "ステージアップ\r\n｢SPURT Re:MIX Vol.2｣\r\nをクリアする",
    "acquisitionEnglish": "Clear Stage Up\r\n\"SPURT Re:MIX Vol.2\"."
  },
  {
    "id": 304172,
    "name": "キミの 力を 見せてくれ！",
    "acquisition": "ステージアップ\r\n｢SPURT Re:MIX Vol.3｣\r\nをクリアする",
    "acquisitionEnglish": "Clear Stage Up\r\n\"SPURT Re:MIX Vol.3\"."
  },
  {
    "id": 304173,
    "name": "天下  無双",
    "acquisition": "プレイヤーレベルを\r\n1000にする",
    "acquisitionEnglish": "Reach Player Level\r\n1000."
  },
  {
    "id": 304174,
    "name": "CENSORED!! ALL MARVELOUS!!",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 304175,
    "name": "Grip & Break down !! ALL MARVELOUS!!",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 304176,
    "name": "神 ALL MARVELOUS!!",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 304177,
    "name": "Möbius",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 304178,
    "name": "You & DIE",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 304179,
    "name": "Reach My Voice",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 304180,
    "name": "Ready Go feat. Yukacco",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 304181,
    "name": "Big Daddy",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 304182,
    "name": "N3XTAGE",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 304183,
    "name": "NIGHTWAVE FRAGMENTS",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 304184,
    "name": "GAKKY",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 304185,
    "name": "SUPER EMULATOR",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 304186,
    "name": "Brand New World feat. Yukacco",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 304187,
    "name": "T+ VS SHARK",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 304188,
    "name": "えくすとりーむ↑↑おんがくスクール feat. ななひら",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 304189,
    "name": "Avenue",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 304190,
    "name": "Middle",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 304191,
    "name": "Obtain An Unused Whale In The Abstract Sea",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 304192,
    "name": "EXTRA HARD",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 304193,
    "name": "Odin",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 304194,
    "name": "Viyella's Nightmare",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 304195,
    "name": "1BPM",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 304196,
    "name": "BPM=RT",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 304197,
    "name": "最先端坊将軍3",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 304198,
    "name": "We are the Massive New Krew (2020Edit)",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 304199,
    "name": "To the sky -wacca edit- feat.motoko",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 304200,
    "name": "Keep on Groovin' feat. mow*2",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 304201,
    "name": "Crush Out",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 304202,
    "name": "Everybody Say HARDCORE TANO*C",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 304203,
    "name": "Scramble TANO*C",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 304204,
    "name": "DIVE with Ü",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 404000,
    "name": "WA+ Developer",
    "acquisition": "Be on the WACCA PLUS Development Team.",
    "acquisitionEnglish": "Be on the WACCA PLUS Development Team."
  },
  {
    "id": 404001,
    "name": "WA+ Notes Designer",
    "acquisition": "Be on the WACCA PLUS Charting Team.",
    "acquisitionEnglish": "Be on the WACCA PLUS Charting Team."
  },
  {
    "id": 404002,
    "name": "WA+ Contributor",
    "acquisition": "Contribute to WACCA PLUS.",
    "acquisitionEnglish": "Contribute to WACCA PLUS."
  },
  {
    "id": 404003,
    "name": "ぼくの夢、メチャクソ無限湧き (ななひら ver.)",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 404004,
    "name": "Blossom",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 404005,
    "name": "BULK UP (GAME EXCLUSIVE EDIT)",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 404006,
    "name": "Caramelldansen (Speedycake Remix)",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 404007,
    "name": "春を告げる",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 404008,
    "name": "Rebuff",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 404009,
    "name": "君のせい",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 404010,
    "name": "青春コンプレックス",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 404011,
    "name": "Chakra",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 404012,
    "name": "Hainuwele",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 404013,
    "name": "ÅMARA(大未来電脳)",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 404014,
    "name": "caesura.",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 404015,
    "name": "ラグトレイン",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 404016,
    "name": "Gestalt",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 404017,
    "name": "Chasing Shadows",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 404018,
    "name": "Colors",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 404019,
    "name": "Joe Fight",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 404020,
    "name": "ラビットホール",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 404021,
    "name": "Make Up Your World",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 404022,
    "name": "why ? ? ?",
    "acquisition": "???",
    "acquisitionEnglish": "???"
  },
  {
    "id": 404023,
    "name": "Asteroid [feat. blaxervant]",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 404024,
    "name": "B.B.K.K.B.K.K.",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 404025,
    "name": "Cheatreal",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 404026,
    "name": "IMPULSE // WEAVER",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 404027,
    "name": "Internet Yamero",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 404028,
    "name": "Show",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 404029,
    "name": "Blows Up Everything",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 404030,
    "name": "Confessions of a Rotten Girl ft. Hatsune Miku",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 404031,
    "name": "Got It Bad",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 404032,
    "name": "強風オールバック (feat.歌愛ユキ)",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 404033,
    "name": "my flow",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 404034,
    "name": "N3V3R G3T OV3R",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 404035,
    "name": "POWER OF UNITY",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 404036,
    "name": "Straight into the lights",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 404037,
    "name": "Happy Synthesizer",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 404038,
    "name": "APRIL FOOLS!!!!",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 404039,
    "name": "Drop.",
    "acquisition": "「maimai  × WACCA」 イベントゲート\n達成報酬",
    "acquisitionEnglish": "\"maimai × Wacca\" Event Gate achievement award"
  },
  {
    "id": 404040,
    "name": "LEGEND",
    "acquisition": "Latent KingdomのINFERNOで\nレートSSS+以上をクリア",
    "acquisitionEnglish": "SSS+ Latent Kingdom Inferno"
  },
  {
    "id": 404041,
    "name": "N3V3R G3T OV3R DRiV3",
    "acquisition": "N3V3R G3T OV3R/ツアー・ファイナル/StratolinerのEXPERTで\nALL Marvelousを達成",
    "acquisitionEnglish": "N3V3R G3T OV3R / Tour Final / Stratoliner / EXPERT ALL Marvelous"
  },
  {
    "id": 404044,
    "name": "我草 maimai !",
    "acquisition": "「maimai  × WACCA」 イベントゲート\n達成報酬",
    "acquisitionEnglish": "\"maimai × Wacca\" Event Gate achievement award"
  },
  {
    "id": 404045,
    "name": "Latent Kingdom",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 404046,
    "name": "Distorted Fate",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 404047,
    "name": "Feels So Right feat. Renko",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 404048,
    "name": "How To Make 音ゲ~曲!",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 404049,
    "name": "ミラクルポップ☆アドベンチャー!!!!!",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 404050,
    "name": "Rrhar'il",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 404051,
    "name": "egoIST",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 404052,
    "name": "�",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 404053,
    "name": "WACCA Plus ステージI  クリア！",
    "acquisition": "WACCA Plus ステージアップ\r\nステージ I をクリアする",
    "acquisitionEnglish": "Clear Stage I in\r\nWACCA Plus Stage Up."
  },
  {
    "id": 404054,
    "name": "WACCA Plus ステージII  クリア！",
    "acquisition": "WACCA Plus ステージアップ\r\nステージ II をクリアする",
    "acquisitionEnglish": "Clear Stage II in\r\nWACCA Plus Stage Up."
  },
  {
    "id": 404055,
    "name": "WACCA Plus ステージIII  クリア！",
    "acquisition": "WACCA Plus ステージアップ\r\nステージ III をクリアする",
    "acquisitionEnglish": "Clear Stage III in\r\nWACCA Plus Stage Up."
  },
  {
    "id": 404056,
    "name": "WACCA Plus ステージIV  クリア！",
    "acquisition": "WACCA Plus ステージアップ\r\nステージ IV をクリアする",
    "acquisitionEnglish": "Clear Stage IV in\r\nWACCA Plus Stage Up."
  },
  {
    "id": 404057,
    "name": "WACCA Plus ステージV  クリア！",
    "acquisition": "WACCA Plus ステージアップ\r\nステージ V をクリアする",
    "acquisitionEnglish": "Clear Stage V in\r\nWACCA Plus Stage Up."
  },
  {
    "id": 404058,
    "name": "WACCA Plus ステージVI  クリア！",
    "acquisition": "WACCA Plus ステージアップ\r\nステージ VI をクリアする",
    "acquisitionEnglish": "Clear Stage VI in\r\nWACCA Plus Stage Up."
  },
  {
    "id": 404059,
    "name": "WACCA Plus ステージVII  クリア！",
    "acquisition": "WACCA Plus ステージアップ\r\nステージ VII をクリアする",
    "acquisitionEnglish": "Clear Stage VII in\r\nWACCA Plus Stage Up."
  },
  {
    "id": 404060,
    "name": "WACCA Plus ステージVIII  クリア！",
    "acquisition": "WACCA Plus ステージアップ\r\nステージ VIII をクリアする",
    "acquisitionEnglish": "Clear Stage VIII in\r\nWACCA Plus Stage Up."
  },
  {
    "id": 404061,
    "name": "WACCA Plus ステージIX  クリア！",
    "acquisition": "WACCA Plus ステージアップ\r\nステージ IX をクリアする",
    "acquisitionEnglish": "Clear Stage IX in\r\nWACCA Plus Stage Up."
  },
  {
    "id": 404062,
    "name": "WACCA Plus ステージX クリア！",
    "acquisition": "WACCA Plus ステージアップ\r\nステージ X をクリアする",
    "acquisitionEnglish": "Clear Stage X in\r\nWACCA Plus Stage Up."
  },
  {
    "id": 404063,
    "name": "WACCA Plus ステージXI クリア！",
    "acquisition": "WACCA Plus ステージアップ\r\nステージ XI をクリアする",
    "acquisitionEnglish": "Clear Stage XI in\r\nWACCA Plus Stage Up."
  },
  {
    "id": 404064,
    "name": "WACCA Plus ステージXII クリア！",
    "acquisition": "WACCA Plus ステージアップ\r\nステージ XII をクリアする",
    "acquisitionEnglish": "Clear Stage XII in\r\nWACCA Plus Stage Up."
  },
  {
    "id": 404065,
    "name": "WACCA Plus ステージXIII クリア！",
    "acquisition": "WACCA Plus ステージアップ\r\nステージ XIII をクリアする",
    "acquisitionEnglish": "Clear Stage XIII in\r\nWACCA Plus Stage Up."
  },
  {
    "id": 404066,
    "name": "WACCA Plus ステージXIV クリア！",
    "acquisition": "WACCA Plus ステージアップ\r\nステージ XIV をクリアする",
    "acquisitionEnglish": "Clear Stage XIV in\r\nWACCA Plus Stage Up."
  },
  {
    "id": 404067,
    "name": "Chronomia",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 404068,
    "name": "Get Your Wish",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 404069,
    "name": "Mãos para cima! ~手を上げな~",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 404070,
    "name": "Mujinku-Vacuum Track#ADD8E6-",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 404071,
    "name": "Twisted Drop Party ",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  },
  {
    "id": 404072,
    "name": "惑星ループ | Planet Loop",
    "acquisition": "上記楽曲の\r\nNORMAL / HARD / EXPERTで\r\nALL Marvelousを達成",
    "acquisitionEnglish": "Clear the above songs on\r\nNORMAL/HARD/EXPERT\r\nwith ALL Marvelous."
  }
]

export default waccaTitles;
