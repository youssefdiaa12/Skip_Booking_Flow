export interface Address {
  id: string;
  line1: string;
  city: string;
}

export interface Skip {
  size: string;
  price: number;
  disabled: boolean;
}

export interface PostcodeFixture {
  postcode: string;
  addresses: Address[];
  delay?: number;
  shouldFail?: boolean;
}

export interface SkipFixture {
  wasteType: "general" | "heavy" | "plasterboard";
  skips: Skip[];
}

export const postcodeFixtures: Record<string, PostcodeFixture> = {
  "SW1A 1AA": {
    postcode: "SW1A 1AA",
    addresses: [
      { id: "addr_1", line1: "10 Downing Street", city: "London" },
      { id: "addr_2", line1: "11 Downing Street", city: "London" },
      { id: "addr_3", line1: "12 Downing Street", city: "London" },
      { id: "addr_4", line1: "13 Downing Street", city: "London" },
      { id: "addr_5", line1: "14 Downing Street", city: "London" },
      { id: "addr_6", line1: "15 Downing Street", city: "London" },
      { id: "addr_7", line1: "16 Downing Street", city: "London" },
      { id: "addr_8", line1: "17 Downing Street", city: "London" },
      { id: "addr_9", line1: "18 Downing Street", city: "London" },
      { id: "addr_10", line1: "19 Downing Street", city: "London" },
      { id: "addr_11", line1: "20 Downing Street", city: "London" },
      { id: "addr_12", line1: "21 Downing Street", city: "London" },
    ],
  },
  "EC1A 1BB": {
    postcode: "EC1A 1BB",
    addresses: [],
  },
  "M1 1AE": {
    postcode: "M1 1AE",
    addresses: [
      { id: "addr_m1_1", line1: "1 Piccadilly Gardens", city: "Manchester" },
    ],
    delay: 2000,
  },
  "BS1 4DJ": {
    postcode: "BS1 4DJ",
    addresses: [
      { id: "addr_bs1_1", line1: "1 Bristol Broad Street", city: "Bristol" },
    ],
    shouldFail: true,
  },
};

export const skipFixtures: Record<string, Skip[]> = {
  general: [
    { size: "4-yard", price: 120, disabled: false },
    { size: "6-yard", price: 180, disabled: false },
    { size: "8-yard", price: 240, disabled: false },
    { size: "10-yard", price: 300, disabled: false },
    { size: "12-yard", price: 360, disabled: false },
    { size: "14-yard", price: 420, disabled: false },
    { size: "16-yard", price: 480, disabled: false },
    { size: "20-yard", price: 600, disabled: false },
  ],
  heavy: [
    { size: "4-yard", price: 150, disabled: false },
    { size: "6-yard", price: 210, disabled: false },
    { size: "8-yard", price: 280, disabled: true },
    { size: "10-yard", price: 350, disabled: true },
    { size: "12-yard", price: 410, disabled: true },
    { size: "14-yard", price: 470, disabled: true },
    { size: "16-yard", price: 530, disabled: true },
    { size: "20-yard", price: 650, disabled: true },
  ],
  plasterboard: [
    { size: "4-yard", price: 130, disabled: false },
    { size: "6-yard", price: 190, disabled: false },
    { size: "8-yard", price: 250, disabled: false },
    { size: "10-yard", price: 310, disabled: false },
    { size: "12-yard", price: 370, disabled: false },
    { size: "14-yard", price: 430, disabled: true },
    { size: "16-yard", price: 490, disabled: true },
    { size: "20-yard", price: 610, disabled: true },
  ],
};

export const testData = {
  validPostcodes: ["SW1A 1AA", "M1 1AE", "BS1 4DJ"],
  emptyPostcodes: ["EC1A 1BB"],
  errorPostcodes: ["BS1 4DJ"],
  latendcyPostcodes: ["M1 1AE"],

  wasteTypes: ["General Waste", "Heavy Waste", "Plasterboard"] as const,
  plasterboardOptions: ["separate", "mixed", "bagged"] as const,

  skipSizes: [
    "4-yard",
    "6-yard",
    "8-yard",
    "10-yard",
    "12-yard",
    "14-yard",
    "16-yard",
    "20-yard",
  ],

  disabledSizes: {
    heavy: ["8-yard", "10-yard", "12-yard", "14-yard", "16-yard", "20-yard"],
    plasterboard: ["14-yard", "16-yard", "20-yard"],
  },
};
