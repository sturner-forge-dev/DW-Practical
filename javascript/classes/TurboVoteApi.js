var process = require("process");

class TurboVoteAPI {
  constructor(req) {
    this.city = req.body.city;
    this.state = req.body.state;
  }

  getFormattedCity() {
    return this.city.toLowerCase().replace(/ /g, "_");
  }

  getFormattedState() {
    return this.state.toLowerCase();
  }

  getOcdId() {
    return `/country:us/state:${this.getFormattedState()}/place:${this.getFormattedCity()}`;
  }

  getUrl() {
    return `${process.env.TURBOVOTE_API_ENDPOINT}${this.getOcdId()}`;
  }
}

module.exports = TurboVoteAPI;
