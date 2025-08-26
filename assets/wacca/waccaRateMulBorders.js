const ratingBordersReverse = [
  {
    min: 990000,
    multiplier: 4,
  },
  {
    min: 980000,
    multiplier: 3.75,
  },
  {
    min: 970000,
    multiplier: 3.5,
  },
  {
    min: 960000,
    multiplier: 3.25,
  },
  {
    min: 950000,
    multiplier: 3,
  },
  {
    min: 940000,
    multiplier: 2.75,
  },
  {
    min: 920000,
    multiplier: 2.5,
  },
  {
    min: 900000,
    multiplier: 2,
  },
  {
    min: 850000,
    multiplier: 1.5,
  },
  {
    min: 800000,
    multiplier: 1,
  },
  {
    min: 700000,
    multiplier: 0.8,
  },
  {
    min: 600000,
    multiplier: 0.7,
  },
  {
    min: 500000,
    multiplier: 0.6,
  },
  {
    min: 400000,
    multiplier: 0.5,
  },
  {
    min: 300000,
    multiplier: 0.4,
  },
  {
    min: 200000,
    multiplier: 0.3,
  },
  {
    min: 100000,
    multiplier: 0.2,
  },
  {
    min: 1,
    multiplier: 0.1,
  },
  {
    min: 0,
    multiplier: 0,
  },
];

const ratingBordersPlus = [
  {
    min: 995000,
    multiplier: 4.05
  },
  {
    min: 994000,
    multiplier: 4.04
  },
  {
    min: 993000,
    multiplier: 4.03
  },
  {
    min: 992000,
    multiplier: 4.02
  },
  {
    min: 991000,
    multiplier: 4.01
  },
  {
    min: 990000,
    multiplier: 4,
  },
  {
    min: 985000,
    multiplier: 3.875,
  },
  {
    min: 980000,
    multiplier: 3.75,
  },
  {
    min: 975000,
    multiplier: 3.625,
  },
  {
    min: 970000,
    multiplier: 3.5,
  },
  {
    min: 965000,
    multiplier: 3.375,
  },
  {
    min: 960000,
    multiplier: 3.25,
  },
  {
    min: 955000,
    multiplier: 3.125,
  },
  {
    min: 950000,
    multiplier: 3,
  },
  {
    min: 940000,
    multiplier: 2.75,
  },
  {
    min: 920000,
    multiplier: 2.5,
  },
  {
    min: 900000,
    multiplier: 2,
  },
  {
    min: 850000,
    multiplier: 1.5,
  },
  {
    min: 800000,
    multiplier: 1,
  },
  {
    min: 700000,
    multiplier: 0.8,
  },
  {
    min: 600000,
    multiplier: 0.7,
  },
  {
    min: 500000,
    multiplier: 0.6,
  },
  {
    min: 400000,
    multiplier: 0.5,
  },
  {
    min: 300000,
    multiplier: 0.4,
  },
  {
    min: 200000,
    multiplier: 0.3,
  },
  {
    min: 100000,
    multiplier: 0.2,
  },
  {
    min: 1,
    multiplier: 0.1,
  },
  {
    min: 0,
    multiplier: 0,
  },
];

function getRatingBorders(version) {
  if (version <= 300) {
    return ratingBordersReverse;
  } else {
    return ratingBordersPlus;
  }
}

export default getRatingBorders;
