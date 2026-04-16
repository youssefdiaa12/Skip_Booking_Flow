const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const addressFixtures = {
  "SW1A 1AA": [
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
  "EC1A 1BB": [],
  "M1 1AE": [
    { id: "addr_m1_1", line1: "1 Piccadilly Gardens", city: "Manchester" },
  ],
  "BS1 4DJ": [
    { id: "addr_bs1_1", line1: "1 Bristol Broad Street", city: "Bristol" },
  ],
};

let bs1ErrorCount = 0;

const skipFixtures = {
  default: [
    { size: "4-yard", price: 120, disabled: false },
    { size: "6-yard", price: 180, disabled: false },
    { size: "8-yard", price: 240, disabled: false },
    { size: "10-yard", price: 300, disabled: false },
    { size: "12-yard", price: 360, disabled: false },
    { size: "14-yard", price: 420, disabled: false },
    { size: "16-yard", price: 480, disabled: false },
    { size: "20-yard", price: 600, disabled: false },
  ],
  heavyWaste: [
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

function normalizePostcode(postcode) {
  return postcode.replace(/\s/g, "").toUpperCase();
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

app.post("/api/postcode/lookup", async (req, res) => {
  const { postcode } = req.body;
  const normalized = normalizePostcode(postcode);
  const isRetry = req.body.retry || false;

  await delay(500);

  if (normalized === "SW1A1AA") {
    return res.json({
      postcode: postcode,
      addresses: addressFixtures["SW1A 1AA"],
    });
  }

  if (normalized === "EC1A1BB") {
    return res.json({
      postcode: postcode,
      addresses: [],
    });
  }

  if (normalized === "M11AE") {
    await delay(2000);
    return res.json({
      postcode: postcode,
      addresses: addressFixtures["M1 1AE"],
    });
  }

  if (normalized === "BS14DJ" && !isRetry) {
    return res.status(500).json({ error: "Internal Server Error" });
  }

  if (normalized === "BS14DJ" && isRetry) {
    return res.json({
      postcode: postcode,
      addresses: addressFixtures["BS1 4DJ"],
    });
  }

  if (addressFixtures[postcode]) {
    return res.json({
      postcode: postcode,
      addresses: addressFixtures[postcode] || [],
    });
  }

  return res.json({
    postcode: postcode,
    addresses: [
      { id: "addr_gen_1", line1: `${postcode} Address 1`, city: "City" },
    ],
  });
});

app.post("/api/waste-types", (req, res) => {
  const { heavyWaste, plasterboard, plasterboardOption } = req.body;
  console.log("Waste type API called:", { heavyWaste, plasterboard, plasterboardOption });
  res.json({ ok: true });
});

app.get("/api/skips", (req, res) => {
  const { postcode, heavyWaste, plasterboard } = req.query;

  let skips = skipFixtures.default;

  if (heavyWaste === "true") {
    skips = skipFixtures.heavyWaste;
  } else if (plasterboard === "true") {
    skips = skipFixtures.plasterboard;
  }

  res.json({ skips });
});

app.post("/api/booking/confirm", (req, res) => {
  const bookingId =
    "BK-" + Math.random().toString(36).substr(2, 9).toUpperCase();
  res.json({ status: "success", bookingId });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
