const express = require("express");
const router = express.Router();
const supertest = require("supertest");

jest.mock("../middlewares/authMiddleware");
jest.mock("../middlewares/authMiddleware_public");

const authMiddleware = require("../middlewares/authMiddleware");
const artgramAuthMiddleware = require("../middlewares/authMiddleware_public");
const ArtgramController = require("../controllers/artgram.controller");
const artgramController = new ArtgramController();

describe.skip("Artgram Router", () => {
  test.skip("GET / should return a list of all artgrams", async () => {
    const artgrams = [
      { id: 1, title: "Artgram 1" },
      { id: 2, title: "Artgram 2" },
    ];
    artgramController.allArtgrams.mockResolvedValueOnce(artgrams);

    const response = await supertest(router)
      .get("/")
      .set("Authorization", "Bearer TOKEN")
      .expect(200);

    expect.skip(response.body).toEqual(artgrams);
    expect.skip(authMiddleware).toHaveBeenCalledTimes(0);
    expect.skip(artgramAuthMiddleware).toHaveBeenCalledTimes(1);
  });
});
