const axios = require("axios");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, ".env") });

const lat = 30.0444;
const lng = 31.2357;
const key = process.env.GOOGLE_API_KEY;
console.log("key", key ? "present" : "missing");

axios
  .post(
    "https://places.googleapis.com/v1/places:searchNearby",
    {
      includedTypes: ["gas_station"],
      locationRestriction: {
        circle: {
          center: {
            latitude: lat,
            longitude: lng,
          },
          radius: 5000.0,
        },
      },
      maxResultCount: 5,
    },
    {
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": key,
        "X-Goog-FieldMask":
          "places.id,places.displayName,places.location,places.formattedAddress,places.rating,places.photos",
      },
    },
  )
  .then((res) => {
    console.log("status", res.status);
    console.log(
      "places",
      res.data.places ? res.data.places.length : "undefined",
    );
    console.log(
      "first",
      res.data.places && res.data.places[0]
        ? res.data.places[0].displayName?.text
        : "none",
    );
  })
  .catch((err) => {
    console.error("err", err.toString());
    if (err.response) {
      console.error("resp", err.response.status, err.response.data);
    }
  });
