var express = require("express");
var router = express.Router();
var postalAbbreviations = require("../us_state.js");
var TurboVoteAPI = require("../classes/TurboVoteApi");
var FetchData = require("../classes/FetchData");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", {
    title: "Find My Election",
    states: postalAbbreviations,
  });
});

router.post("/search", function (req, res, next) {
  const api = new TurboVoteAPI(req);
  const fetchData = new FetchData(api.getUrl(), "Find My Election", res);

  fetchData.fetchData();
});

module.exports = router;
