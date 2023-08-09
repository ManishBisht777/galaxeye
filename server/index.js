const express = require("express");
const app = express();
const cors = require("cors");
const turf = require("@turf/turf");
const geoJson = require("./data/geo.json");

app.use(cors());
app.use(express.json());

app.put("/intersect", async (req, res) => {
  try {
    const AOIObject = req.body.AOIGeoJSONObject.geometry;

    var intersections = {
      type: "FeatureCollection",
      features: [],
    };

    geoJson.features.forEach(function (feature) {
      var intersection = turf.intersect(feature, AOIObject);
      if (intersection) {
        intersections.features.push(intersection);
      }
    });

    res.json(intersections);
  } catch (err) {
    console.error(err.message);
  }
});

app.listen(5000, () => {
  console.log("Server started on port 5000");
});
