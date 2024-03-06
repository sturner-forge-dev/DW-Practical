const tap = require("tap");
const TurboVoteAPI = require("../classes/TurboVoteApi");

tap.test("TurboVoteAPI", (t) => {
  const req = {
    body: {
      city: "New York",
      state: "NY",
    },
  };
  const turboVoteAPI = new TurboVoteAPI(req);

  t.equal(
    turboVoteAPI.getFormattedCity(),
    "new_york",
    "getFormattedCity returns the correct value"
  );
  t.equal(
    turboVoteAPI.getFormattedState(),
    "ny",
    "getFormattedState returns the correct value"
  );
  t.equal(
    turboVoteAPI.getOcdId(),
    "/country:us/state:ny/place:new_york",
    "getOcdId returns the correct value"
  );

  // Set the TURBOVOTE_API_ENDPOINT environment variable for testing
  process.env.TURBOVOTE_API_ENDPOINT =
    "https://api.turbovote.org/elections/upcoming?district-divisions=ocd-division";
  t.equal(
    turboVoteAPI.getUrl(),
    "https://api.turbovote.org/elections/upcoming?district-divisions=ocd-division/country:us/state:ny/place:new_york",
    "getUrl returns the correct value"
  );

  t.end();
});
