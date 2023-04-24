// const express = require("express");
// const router = express.Router();
// const supertest = require("supertest");
// const ArtgramController = require("../controllers/artgram.controller");
// const artgramController = new ArtgramController();
// const authMiddleware = require("../middlewares/authMiddleware");
// const artgramAuthMiddleware = require("../middlewares/authMiddleware_public");

// jest.mock("../middlewares/authMiddleware");
// jest.mock("../middlewares/authMiddleware_public");

// describe("Artgram Router", () => {
//   test("GET / should return a list of all artgrams", async () => {
//     const artgrams = [
//       { id: 1, title: "Artgram 1" },
//       { id: 2, title: "Artgram 2" },
//     ];
//     artgramController.allArtgrams.mockResolvedValueOnce(artgrams);

//     const response = await supertest(router)
//       .get("/")
//       .set("Authorization", "Bearer TOKEN")
//       .expect(200);

//     expect(response.body).toEqual(artgrams);
//     expect(authMiddleware).toHaveBeenCalledTimes(0);
//     expect(artgramAuthMiddleware).toHaveBeenCalledTimes(1);
//   });
// });
