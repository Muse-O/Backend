const request = require("supertest");
const app = require("../../../app");

describe.skip("Search API", () => {
  const sendRequest = async (method, path, data = null) => {
    let req = request(app)[method](path);
    if (data) req = req.send(data);
    const res = await req;
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("data");
    return res.body.data;
  };

  it.skip("should return search result", async () => {
    const data = await sendRequest("get", "/search?q=test");
    expect(data).toEqual(expect.any(Array));
  });

  it.skip("should save search record", async () => {
    const data = await sendRequest("post", "/search", { q: "test" });
    expect(data).toHaveProperty("search_id");
  });

  it.skip("should return recent search history", async () => {
    const data = await sendRequest("get", "/search/recent");
    expect(data).toEqual(expect.any(Array));
  });

  it.skip("should return search result by category", async () => {
    const data = await sendRequest("get", "/search/category?type=test");
    expect(data).toEqual(expect.any(Array));
  });

  it.skip("should return top 10 search keywords", async () => {
    const data = await sendRequest("get", "/search/rank");
    expect(data).toHaveLength(10);
  });
});
