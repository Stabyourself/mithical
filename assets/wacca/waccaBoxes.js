// Exp = 1,
// WaccaPoint = 2,
// Music = 3,
// MusicDifficulty = 4,
// Title = 5,
// Icon = 6,
// Trophy = 7,
// Skill = 8,
// Ticket = 9,
// SymbolColor = 10,
// SoundEffect = 11,
// BoostItem = 13,
// GatePoint = 14,
// NavigatorCharacter = 15,
// UserPlateBackground = 16,
// TouchEffect = 17,

const waccaBoxes = [
  {
    id: 5,
    name: "VIP BOX",
    nameEnglish: "VIP BOX",
    price: 5000,
    color: "#3d8bae",
    image: "/wacca/img/gacha_vip.png",
    items: [

      {
        kind: 10,
        id: 203002,
        rarity: 4,
      },
      {
        kind: 10,
        id: 203009,
        rarity: 4,
      },
      {
        kind: 10,
        id: 303005,
        rarity: 4,
      },
      {
        kind: 11,
        id: 205008,
        rarity: 4,
      },
      {
        kind: 6,
        id: 302009,
        rarity: 4,
      },
      {
        kind: 11,
        id: 205002,
        rarity: 3,
      },
      {
        kind: 11,
        id: 305003,
        rarity: 3,
      },
      {
        kind: 6,
        id: 302046,
        rarity: 3,
      },
      {
        kind: 6,
        id: 302047,
        rarity: 3,
      },
      {
        kind: 6,
        id: 302048,
        rarity: 3,
      },

      {
        kind: 6,
        id: 202020,
        rarity: 2,
      },
      {
        kind: 6,
        id: 202063,
        rarity: 2,
      },
      {
        kind: 6,
        id: 202086,
        rarity: 2,
      },
      {
        kind: 6,
        id: 302014,
        rarity: 2,
      },
      {
        kind: 6,
        id: 302015,
        rarity: 2,
      },
      {
        kind: 6,
        id: 302045,
        rarity: 2,
      },



      {
        kind: 16,
        id: 211004,
        rarity: 2,
      },
      {
        kind: 16,
        id: 211018,
        rarity: 2,
      },
      {
        kind: 16,
        id: 211025,
        rarity: 2,
      },
      {
        kind: 16,
        id: 211026,
        rarity: 2,
      },
      {
        kind: 16,
        id: 311004,
        rarity: 2,
      },
      {
        kind: 16,
        id: 311005,
        rarity: 2,
      },
      {
        kind: 16,
        id: 311014,
        rarity: 2,
      },
      {
        kind: 16,
        id: 311015,
        rarity: 2,
      },
      {
        kind: 16,
        id: 311016,
        rarity: 2,
      },
      {
        kind: 16,
        id: 311017,
        rarity: 2,
      }

    ]
  },
  {
    id: 4,
    name: "チルノBOX",
    nameEnglish: "Cirno Box",
    price: 5000,
    color: "#b9f0f3",
    image: "/wacca/img/gacha_cirno.png",
    items: [
      {
        kind: 15,
        id: 210061,
        rarity: 5,
      },
      {
        kind: 10,
        id: 103007,
        rarity: 4,
      },
      {
        kind: 10,
        id: 203007,
        rarity: 4,
      },
      {
        kind: 16,
        id: 211038,
        rarity: 3,
      },
      {
        kind: 6,
        id: 202113,
        rarity: 3,
      },
      {
        kind: 6,
        id: 202114,
        rarity: 3,
      },
      {
        kind: 6,
        id: 102070,
        rarity: 2,
      },
      {
        kind: 6,
        id: 102071,
        rarity: 2,
      },
      {
        kind: 6,
        id: 102072,
        rarity: 2,
      },
      {
        kind: 6,
        id: 102096,
        rarity: 2,
      },
      {
        kind: 6,
        id: 202011,
        rarity: 2,
      },
      {
        kind: 6,
        id: 202012,
        rarity: 2,
      },
      {
        kind: 6,
        id: 202079,
        rarity: 2,
      },
      {
        kind: 6,
        id: 302044,
        rarity: 2,
      },
      // titles
      {
        kind: 5,
        id: 104125,
        rarity: 1,
      },
      {
        kind: 5,
        id: 104126,
        rarity: 1,
      },
      {
        kind: 5,
        id: 104127,
        rarity: 1,
      },
      {
        kind: 5,
        id: 104128,
        rarity: 1,
      },
      {
        kind: 5,
        id: 104129,
        rarity: 1,
      },
      {
        kind: 5,
        id: 104130,
        rarity: 1,
      },
      {
        kind: 5,
        id: 104131,
        rarity: 1,
      },
      {
        kind: 5,
        id: 104132,
        rarity: 1,
      },
      {
        kind: 5,
        id: 104133,
        rarity: 1,
      },
      {
        kind: 5,
        id: 104134,
        rarity: 1,
      },
      {
        kind: 5,
        id: 104135,
        rarity: 1,
      },
      {
        kind: 5,
        id: 104136,
        rarity: 1,
      },
      {
        kind: 5,
        id: 104138,
        rarity: 1,
      },
      {
        kind: 5,
        id: 104146,
        rarity: 1,
      },
      {
        kind: 5,
        id: 104147,
        rarity: 1,
      },
      {
        kind: 5,
        id: 104148,
        rarity: 1,
      },
      {
        kind: 5,
        id: 204147,
        rarity: 1,
      },
    ],
  },
  {
    id: 0,
    name: "リリィBOX",
    nameEnglish: "Lily Box",
    price: 500,
    color: "#0e706f",
    image: "/wacca/img/navigators/BP_Chara001_00.png",
    items: [
      {
        kind: 10,
        id: 203003,
        rarity: 4,
      },
      {
        kind: 11,
        id: 205003,
        rarity: 3,
      },
      {
        kind: 6,
        id: 202014,
        rarity: 2,
      },
      {
        kind: 6,
        id: 202015,
        rarity: 2,
      },
      {
        kind: 6,
        id: 202016,
        rarity: 2,
      },
      {
        kind: 6,
        id: 202017,
        rarity: 2,
      },
      {
        kind: 6,
        id: 202018,
        rarity: 2,
      },
      {
        kind: 6,
        id: 202019,
        rarity: 2,
      },
      {
        kind: 6,
        id: 202020,
        rarity: 2,
      },
      {
        kind: 6,
        id: 202021,
        rarity: 2,
      },
      {
        kind: 6,
        id: 202022,
        rarity: 2,
      },
      {
        kind: 6,
        id: 202023,
        rarity: 2,
      },
      {
        kind: 6,
        id: 202024,
        rarity: 2,
      },
      {
        kind: 6,
        id: 202025,
        rarity: 2,
      },
      {
        kind: 6,
        id: 202026,
        rarity: 2,
      },
      {
        kind: 6,
        id: 202027,
        rarity: 2,
      },
      {
        kind: 6,
        id: 202028,
        rarity: 2,
      },
      {
        kind: 6,
        id: 202029,
        rarity: 2,
      },
      {
        kind: 6,
        id: 202030,
        rarity: 2,
      },
      {
        kind: 6,
        id: 202031,
        rarity: 2,
      },
      {
        kind: 6,
        id: 202032,
        rarity: 2,
      },
      {
        kind: 6,
        id: 202033,
        rarity: 2,
      },
      {
        kind: 6,
        id: 202034,
        rarity: 2,
      },
      {
        kind: 6,
        id: 202035,
        rarity: 2,
      },
      {
        kind: 6,
        id: 202036,
        rarity: 2,
      },
      {
        kind: 6,
        id: 202037,
        rarity: 2,
      },
      {
        kind: 6,
        id: 202038,
        rarity: 2,
      },
      {
        kind: 5,
        id: 204062,
        rarity: 2,
      },
      {
        kind: 5,
        id: 204065,
        rarity: 2,
      },
      {
        kind: 5,
        id: 204067,
        rarity: 2,
      },
      {
        kind: 5,
        id: 204068,
        rarity: 2,
      },
      {
        kind: 5,
        id: 204069,
        rarity: 2,
      },
      {
        kind: 5,
        id: 204070,
        rarity: 2,
      },
      {
        kind: 5,
        id: 204071,
        rarity: 2,
      },
      {
        kind: 5,
        id: 204083,
        rarity: 2,
      },
      {
        kind: 5,
        id: 204085,
        rarity: 2,
      },
      {
        kind: 5,
        id: 204086,
        rarity: 2,
      },
      {
        kind: 5,
        id: 204043,
        rarity: 1,
      },
      {
        kind: 5,
        id: 204044,
        rarity: 1,
      },
      {
        kind: 5,
        id: 204045,
        rarity: 1,
      },
      {
        kind: 5,
        id: 204046,
        rarity: 1,
      },
      {
        kind: 5,
        id: 204047,
        rarity: 1,
      },
      {
        kind: 5,
        id: 204048,
        rarity: 1,
      },
      {
        kind: 5,
        id: 204049,
        rarity: 1,
      },
      {
        kind: 5,
        id: 204050,
        rarity: 1,
      },
      {
        kind: 5,
        id: 204051,
        rarity: 1,
      },
      {
        kind: 5,
        id: 204052,
        rarity: 1,
      },
      {
        kind: 5,
        id: 204053,
        rarity: 1,
      },
      {
        kind: 5,
        id: 204054,
        rarity: 1,
      },
      {
        kind: 5,
        id: 204055,
        rarity: 1,
      },
      {
        kind: 5,
        id: 204056,
        rarity: 1,
      },
      {
        kind: 5,
        id: 204057,
        rarity: 1,
      },
      {
        kind: 5,
        id: 204058,
        rarity: 1,
      },
      {
        kind: 5,
        id: 204059,
        rarity: 1,
      },
      {
        kind: 5,
        id: 204060,
        rarity: 1,
      },
      {
        kind: 5,
        id: 204061,
        rarity: 1,
      },
      {
        kind: 5,
        id: 204072,
        rarity: 1,
      },
      {
        kind: 5,
        id: 204073,
        rarity: 1,
      },
      {
        kind: 5,
        id: 204074,
        rarity: 1,
      },
      {
        kind: 5,
        id: 204075,
        rarity: 1,
      },
      {
        kind: 5,
        id: 204077,
        rarity: 1,
      },
      {
        kind: 5,
        id: 204078,
        rarity: 1,
      },
      {
        kind: 5,
        id: 204079,
        rarity: 1,
      },
      {
        kind: 5,
        id: 204080,
        rarity: 1,
      },
      {
        kind: 5,
        id: 204081,
        rarity: 1,
      },
      {
        kind: 5,
        id: 204082,
        rarity: 1,
      },
      {
        kind: 5,
        id: 204084,
        rarity: 1,
      },
    ],
  },
  {
    id: 1,
    name: "アールBOX",
    nameEnglish: "R Box",
    price: 500,
    color: "#d52e6c",
    image: "/wacca/img/navigators/BP_Chara000_00.png",
    items: [
      {
        kind: 10,
        id: 203006,
        rarity: 4,
      },
      {
        kind: 16,
        id: 211019,
        rarity: 4,
      },
      {
        kind: 11,
        id: 205006,
        rarity: 3,
      },
      {
        kind: 6,
        id: 202067,
        rarity: 2,
      },
      {
        kind: 6,
        id: 202068,
        rarity: 2,
      },
      {
        kind: 6,
        id: 202069,
        rarity: 2,
      },
      {
        kind: 6,
        id: 202070,
        rarity: 2,
      },
      {
        kind: 6,
        id: 202071,
        rarity: 2,
      },
      {
        kind: 6,
        id: 202072,
        rarity: 2,
      },
      {
        kind: 6,
        id: 202073,
        rarity: 2,
      },
      {
        kind: 6,
        id: 202074,
        rarity: 2,
      },
      {
        kind: 6,
        id: 202075,
        rarity: 2,
      },
      {
        kind: 6,
        id: 202076,
        rarity: 2,
      },
      {
        kind: 5,
        id: 204116,
        rarity: 2,
      },
      {
        kind: 5,
        id: 204117,
        rarity: 2,
      },
      {
        kind: 5,
        id: 204118,
        rarity: 2,
      },
      {
        kind: 5,
        id: 204119,
        rarity: 2,
      },
      {
        kind: 5,
        id: 204120,
        rarity: 2,
      },
      {
        kind: 5,
        id: 204121,
        rarity: 2,
      },
      {
        kind: 5,
        id: 204122,
        rarity: 2,
      },
      {
        kind: 5,
        id: 204123,
        rarity: 2,
      },
      {
        kind: 5,
        id: 204124,
        rarity: 2,
      },
      {
        kind: 5,
        id: 204125,
        rarity: 2,
      },
      {
        kind: 5,
        id: 104069,
        rarity: 1,
      },
      {
        kind: 5,
        id: 104070,
        rarity: 1,
      },
      {
        kind: 5,
        id: 104071,
        rarity: 1,
      },
      {
        kind: 5,
        id: 104072,
        rarity: 1,
      },
      {
        kind: 5,
        id: 104073,
        rarity: 1,
      },
      {
        kind: 5,
        id: 104074,
        rarity: 1,
      },
      {
        kind: 5,
        id: 104075,
        rarity: 1,
      },
      {
        kind: 5,
        id: 104076,
        rarity: 1,
      },
      {
        kind: 5,
        id: 104077,
        rarity: 1,
      },

      {
        kind: 5,
        id: 204126,
        rarity: 1,
      },
      {
        kind: 5,
        id: 204127,
        rarity: 1,
      },
      {
        kind: 5,
        id: 204128,
        rarity: 1,
      },
      {
        kind: 5,
        id: 204129,
        rarity: 1,
      },
      {
        kind: 5,
        id: 204130,
        rarity: 1,
      },
      {
        kind: 5,
        id: 204131,
        rarity: 1,
      },
      {
        kind: 5,
        id: 204132,
        rarity: 1,
      },
      {
        kind: 5,
        id: 204133,
        rarity: 1,
      },
      {
        kind: 5,
        id: 204134,
        rarity: 1,
      },
      {
        kind: 5,
        id: 204135,
        rarity: 1,
      },
      {
        kind: 5,
        id: 204136,
        rarity: 1,
      },
      {
        kind: 5,
        id: 204137,
        rarity: 1,
      },
      {
        kind: 5,
        id: 204138,
        rarity: 1,
      },
      {
        kind: 5,
        id: 204139,
        rarity: 1,
      },
      {
        kind: 5,
        id: 204140,
        rarity: 1,
      },
      {
        kind: 5,
        id: 204141,
        rarity: 1,
      },
      {
        kind: 5,
        id: 204142,
        rarity: 1,
      },
      {
        kind: 5,
        id: 204143,
        rarity: 1,
      },
      {
        kind: 5,
        id: 204144,
        rarity: 1,
      },
      {
        kind: 5,
        id: 204145,
        rarity: 1,
      },
      {
        kind: 5,
        id: 204146,
        rarity: 1,
      },
    ],
  },
  {
    id: 2,
    name: "リバースBOX",
    nameEnglish: "Reverse Box",
    price: 1500,
    color: "#651888",
    image: "/wacca/img/navigators/BP_Chara002_00.png",
    items: [
      {
        kind: 16,
        id: 311006,
        rarity: 4,
      },
      {
        kind: 16,
        id: 311007,
        rarity: 4,
      },
      {
        kind: 5,
        id: 304025,
        rarity: 3,
      },
      {
        kind: 5,
        id: 304026,
        rarity: 3,
      },
      {
        kind: 5,
        id: 304027,
        rarity: 3,
      },
      {
        kind: 11,
        id: 105012,
        rarity: 3,
      },
      {
        kind: 11,
        id: 305001,
        rarity: 3,
      },
      {
        kind: 10,
        id: 303004,
        rarity: 3,
      },
      {
        kind: 6,
        id: 302001,
        rarity: 2,
      },
      {
        kind: 6,
        id: 302002,
        rarity: 2,
      },
      {
        kind: 6,
        id: 302003,
        rarity: 2,
      },
      {
        kind: 6,
        id: 302004,
        rarity: 2,
      },
      {
        kind: 6,
        id: 302005,
        rarity: 2,
      },
      {
        kind: 6,
        id: 302006,
        rarity: 2,
      },
      {
        kind: 6,
        id: 302007,
        rarity: 2,
      },
      {
        kind: 6,
        id: 302008,
        rarity: 2,
      },
      {
        kind: 6,
        id: 302009,
        rarity: 2,
      },
      {
        kind: 6,
        id: 302010,
        rarity: 2,
      },
      {
        kind: 6,
        id: 102067,
        rarity: 2,
      },
      {
        kind: 6,
        id: 102074,
        rarity: 2,
      },

      {
        kind: 5,
        id: 304028,
        rarity: 2,
      },
      {
        kind: 5,
        id: 304029,
        rarity: 2,
      },

      {
        kind: 5,
        id: 104139,
        rarity: 1,
      },
      {
        kind: 5,
        id: 104140,
        rarity: 1,
      },
      {
        kind: 5,
        id: 104141,
        rarity: 1,
      },
      {
        kind: 5,
        id: 104142,
        rarity: 1,
      },
      {
        kind: 5,
        id: 104143,
        rarity: 1,
      },
      {
        kind: 5,
        id: 304030,
        rarity: 1,
      },
      {
        kind: 5,
        id: 304031,
        rarity: 1,
      },
      {
        kind: 5,
        id: 304032,
        rarity: 1,
      },
      {
        kind: 5,
        id: 304033,
        rarity: 1,
      },
      {
        kind: 5,
        id: 304034,
        rarity: 1,
      },
      {
        kind: 5,
        id: 304035,
        rarity: 1,
      },
      {
        kind: 5,
        id: 304036,
        rarity: 1,
      },
      {
        kind: 5,
        id: 304037,
        rarity: 1,
      },
      {
        kind: 5,
        id: 304038,
        rarity: 1,
      },
      {
        kind: 5,
        id: 304039,
        rarity: 1,
      },
      {
        kind: 5,
        id: 304040,
        rarity: 1,
      },
      {
        kind: 5,
        id: 304041,
        rarity: 1,
      },
      {
        kind: 5,
        id: 304042,
        rarity: 1,
      },
      {
        kind: 5,
        id: 304043,
        rarity: 1,
      },
      {
        kind: 5,
        id: 304044,
        rarity: 1,
      },
      {
        kind: 5,
        id: 304045,
        rarity: 1,
      },
      {
        kind: 5,
        id: 304046,
        rarity: 1,
      },
      {
        kind: 5,
        id: 304047,
        rarity: 1,
      },
      {
        kind: 5,
        id: 304048,
        rarity: 1,
      },
      {
        kind: 5,
        id: 304049,
        rarity: 1,
      },
      {
        kind: 5,
        id: 304050,
        rarity: 1,
      },
    ],
  },
  {
    id: 3,
    name: "ラストスパートイベントBOX",
    nameEnglish: "Last Spurt Event Box",
    price: 30000,
    color: "#232228",
    image: "/wacca/img/navigators/BP_Chara003_00.png",
    items: [
      {
        kind: 6,
        id: 302040,
        rarity: 4,
      },
      {
        kind: 6,
        id: 302041,
        rarity: 4,
      },
      {
        kind: 6,
        id: 302042,
        rarity: 4,
      },
      {
        kind: 6,
        id: 302043,
        rarity: 4,
      },
      {
        kind: 16,
        id: 311012,
        rarity: 4,
      },
      {
        kind: 16,
        id: 311013,
        rarity: 4,
      },
    ],
  },
];

export default waccaBoxes;
