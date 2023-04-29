const request = require("supertest");
const app = require("../../../app");

// const { describe } = require("../../../schemas/userReqSchema");

describe("어드민 전시회승인", () => {
  it("승인되지않은 전시회목록", async () => {
    const response = await request(app).get("/admin/approvalList");
    expect(response.status).toBe(200);
    expect(response.text).toBe("승인되지않은 전시회목록.");
  });
  it("전시회 승인", async () => {
    const response = await request(app).patch("/admin/approvalList");
    expect(response.status).toBe(200);
    expect(response.text).toBe("전시회가 승인되었습니다.");
  });
});
describe("어드민신고", () => {
  it("신고게시글 목록", async () => {
    const response = await request(app).get("admin/reportList");
    expect(response.status).toBe(200);
    expect(response.text).toBe("신고된 목록");
  });
  it("신고처리", async () => {
    const response = await request(app).patch("admin/reportList");
    expect(response.status).toBe(200);
    expect(response.text).toBe("신고처리가 되었습니다.");
  });
});
