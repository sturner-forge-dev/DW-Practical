var tap = require("tap");
var TurboVoteApi = require("../classes/TurboVoteApi");
var fs = require("fs");
var csv = require("csv-parser");
var async = require("async");

// Stubbing the process.env.TURBOVOTE_API_ENDPOINT variable
process.env.TURBOVOTE_API_ENDPOINT = "https://sometesturl.com/ocd-division";

tap.test("TurboVoteAPI", (t) => {
  const req = {
    body: {
      city: "New York",
      state: "NY",
    },
  };
  const turboVoteAPI = new TurboVoteApi(req);

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
    "ocd-division/country:us/state:ny,ocd-division/country:us/state:ny/place:new_york",
    "getOcdId returns the correct value"
  );

  t.equal(
    turboVoteAPI.getUrl(),
    "https://sometesturl.com/ocd-division/elections/upcoming?district-divisions=ocd-division/country:us/state:ny,ocd-division/country:us/state:ny/place:new_york",
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
  const turboVoteAPI = new TurboVoteApi(req);
  const ocdId = turboVoteAPI.getOcdId();

  t.equal(
    ocdId,
    "ocd-division/country:us/state:tx,ocd-division/country:us/state:tx/place:test_city",
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
  const turboVoteAPI = new TurboVoteApi(req);
  const ocdId = turboVoteAPI.getOcdId();

  t.equal(
    ocdId,
    "ocd-division/country:us/state:tx",
    "OCD ID is correct without city"
  );
  t.end();
});

tap.test("TurboVoteApi.getOcdId - with addresses from CSV", (t) => {
  const addresses = [];

  fs.createReadStream("./test/data/Addresses.csv")
    .pipe(csv())
    .on("data", (row) => {
      addresses.push(row);
    })
    .on("end", () => {
      async.eachSeries(
        addresses,
        (address, callback) => {
          const req = {
            body: {
              city: address.City,
              state: address.State,
            },
          };
          const turboVoteApi = new TurboVoteApi(req);
          const url = turboVoteApi.getUrl();
          const expectedUrl = `${
            process.env.TURBOVOTE_API_ENDPOINT
          }/elections/upcoming?district-divisions=ocd-division/country:us/state:${address.State.toLowerCase()},ocd-division/country:us/state:${address.State.toLowerCase()}/place:${address.City.toLowerCase().replace(
            / /g,
            "_"
          )}`;

          t.equal(url, expectedUrl, "URL is correct for address from CSV");
          callback();
        },
        (err) => {
          if (err) {
            t.fail(err);
          }
          t.end();
        }
      );
    });
});
