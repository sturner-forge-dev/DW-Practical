// Importing required libraries and classes
const tap = require("tap");
const sinon = require("sinon");
const FetchData = require("../classes/FetchData");

// Stubbing the global fetch function before all tests
tap.beforeEach(() => {
  sinon.stub(global, "fetch");
});

// Restoring the global fetch function to its original state after each test
tap.afterEach(() => {
  global.fetch.restore();
});

// Mocking the res object
const mockRes = {
  render: sinon.stub(),
};

// Using a fake URL for testing purposes
const fakeUrl = "https://fakeapi.example.com/elections/upcoming";
const mockTitle = "Test Title";

tap.test("FetchData.fetchData - failure", async (t) => {
  // Set up the fetch stub to return a mock unsuccessful response
  const mockResponse = {
    ok: false,
    statusText: "Not Found",
  };
  global.fetch.resolves(mockResponse);

  const fetchData = new FetchData(fakeUrl, mockTitle, mockRes);
  await fetchData.fetchData();

  // Assertions to check if fetch was called correctly
  t.ok(global.fetch.calledOnce, "fetch was called once");
  t.ok(
    global.fetch.calledWith(fakeUrl, {
      headers: {
        Accept: "application/json",
      },
    }),
    "fetch was called with the correct arguments"
  );

  // Assertions to check if res.render was called correctly
  t.ok(mockRes.render.calledOnce, "res.render was called once");
  t.ok(
    mockRes.render.calledWith("error", {
      message: "Not Found",
    }),
    "res.render was called with the correct arguments"
  );

  mockRes.render.reset();
});

tap.test("FetchData.fetchData - success", async (t) => {
  // Set up the fetch stub to return a mock successful response
  const mockData = { someKey: "someValue" }; // Adjust to match expected format
  const mockResponse = {
    ok: true,
    json: () => Promise.resolve(mockData),
  };
  global.fetch.resolves(mockResponse);

  const fetchData = new FetchData(fakeUrl, mockTitle, mockRes);
  await fetchData.fetchData();

  // Assertions to check if fetch was called correctly
  t.ok(
    global.fetch.calledWith(fakeUrl, {
      headers: {
        Accept: "application/json",
      },
    }),
    "fetch was called with the correct URL and headers"
  );

  // Assertions to check if res.render was called correctly for success
  t.same(
    mockRes.render.firstCall.args[1], // Access the arguments of the first call
    {
      title: mockTitle,
      data: mockData,
    },
    "res.render was called with the correct arguments for success"
  );

  mockRes.render.reset();
});
