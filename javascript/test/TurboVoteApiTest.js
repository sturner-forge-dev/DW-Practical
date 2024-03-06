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
    "https://fakeapi.example.com/elections/upcoming";
  t.equal(
    turboVoteAPI.getUrl(),
    "https://fakeapi.example.com/elections/upcoming/country:us/state:ny/place:new_york",
    "getUrl returns the correct value"
  );

  t.end();
});

tap.test("TurboVoteAPI.getOcdId - with city", (t) => {
  const req = {
    body: {
      city: "Test City",
      state: "TX",
    },
  };
  const turboVoteAPI = new TurboVoteAPI(req);
  const ocdId = turboVoteAPI.getOcdId();

  t.equal(
    ocdId,
    "/country:us/state:tx/place:test_city",
    "OCD ID is correct with city"
  );
  t.end();
});

tap.test("TurboVoteAPI.getOcdId - without city", (t) => {
  const req = {
    body: {
      state: "TX",
    },
  };
  const turboVoteAPI = new TurboVoteAPI(req);
  const ocdId = turboVoteAPI.getOcdId();

  t.equal(ocdId, "/country:us/state:tx", "OCD ID is correct without city");
  t.end();
});
