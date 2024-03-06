var tap = require("tap");
var sinon = require("sinon");
var FetchData = require("../classes/FetchData");

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
const mockTemplate = "testTemplate";
const mockTitle = "Test Title";

tap.test("FetchData.fetchData - failure", async (t) => {
  // Set up the fetch stub to return a mock unsuccessful response
  const mockResponse = {
    ok: false,
    statusText: "Not Found",
  };
  global.fetch.resolves(mockResponse);

  const fetchData = new FetchData(fakeUrl, mockTemplate, mockTitle, mockRes);
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
      error: { status: undefined, stack: undefined },
    }),
    "res.render was called with the correct arguments"
  );

  mockRes.render.reset();
});

tap.test("FetchData.fetchData - no data", async (t) => {
  const mockData = [];
  const mockResponse = {
    ok: true,
    json: () => Promise.resolve(mockData),
  };
  global.fetch.resolves(mockResponse);

  const fetchData = new FetchData(fakeUrl, mockTemplate, mockTitle, mockRes);
  await fetchData.fetchData();

  t.ok(global.fetch.calledOnce, "fetch was called once");
  t.ok(
    global.fetch.calledWith(fakeUrl, {
      headers: {
        Accept: "application/json",
      },
    }),
    "fetch was called with the correct arguments"
  );

  t.ok(mockRes.render.calledOnce, "res.render was called once");
  t.ok(
    mockRes.render.calledWith("error", {
      message:
        "No election data found for given location. Please enter a different location.",
    }),
    "res.render was called with the correct arguments"
  );

  mockRes.render.reset();
});

tap.test("FetchData.fetchData - success", async (t) => {
  // Set up the fetch stub to return a mock successful response
  const mockData = { someKey: "someValue" };
  const mockResponse = {
    ok: true,
    json: () => Promise.resolve(mockData),
  };
  global.fetch.resolves(mockResponse);

  const fetchData = new FetchData(fakeUrl, mockTemplate, mockTitle, mockRes);
  await fetchData.fetchData();

  t.ok(
    global.fetch.calledWith(fakeUrl, {
      headers: {
        Accept: "application/json",
      },
    }),
    "fetch was called with the correct URL and headers"
  );

  t.same(
    // Access the arguments of the first call to res.render
    mockRes.render.firstCall.args[1],
    {
      title: mockTitle,
      data: mockData,
    },
    "res.render was called with the correct arguments for success"
  );

  mockRes.render.reset();
});
