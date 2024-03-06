var process = require("process");

class TurboVoteAPI {
  constructor(req) {
    this.state = req.body.state;
    this.city = req.body.city;
  }

  getFormattedCity() {
    return this.city?.toLowerCase().replace(/ /g, "_");
  }

  getFormattedState() {
    return this.state?.toLowerCase();
  }

  getOcdId() {
    const stateOcdId = `ocd-division/country:us/state:${this.getFormattedState()}`;
    if (!this.city) {
      return stateOcdId;
    }
    const placeOcdId = `${stateOcdId}/place:${this.getFormattedCity()}`;
    return `${stateOcdId},${placeOcdId}`;
  }

  getUrl() {
    const ocdId = this.getOcdId();
    return `${process.env.TURBOVOTE_API_ENDPOINT}/elections/upcoming?district-divisions=${ocdId}`;
  }
}

module.exports = TurboVoteAPI;
