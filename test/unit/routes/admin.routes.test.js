require("dotenv").config();
const config = require("../../../config/config");
const {
  mockReq,
  mockRes,
  mockNext,
  mockPendingExhibitionsData,
  mockGetAllReports,
} = require("../../fixtures/admin.fixtures");
const request = require("supertest");
const env = process.env.NODE_ENV || "development";
const AdminController = require("../../../controllers/admin.controller");

describe("어드민 라우터 테스트", () => {
  let server;

  beforeEach(() => {
    server = require("../server");
  });

  afterEach(() => {
    server.close();
  });

  // const adminController = new AdminController();
  // adminController.adminService = mockAdminService;

  describe("전시회 승인", () => {
    test("전시회 승인요청 리스트", async () => {
      const response = await request(server).get("/admin/approvalList");
      expect(response.status).toBe(200);
      expect(response.text).toEqual({
        findApprovalList: mockPendingExhibitionsData,
      });
      expect(response.status).toBe(403);
    });
    it("전시회 승인 요청처리", async () => {
      const response = await request(server).patch("/admin/approvalList");
      expect(response.status).toBe(200);
      expect(response.text).toEqual({ message: "전시글이 승인되었습니다." });
    });
  });
  describe("신고", () => {
    it("신고 리스트", async () => {
      const response = await request(server).get("/admin/reportList");
      expect(response.status).toBe(200);
      expect(response.text).toEqual({ reportList: mockGetAllReports });
    });
    it("신고 반영", async () => {
      const response = await request(server).patch("/admin/reportList");
      expect(response.status).toBe(200);
      expect(response.text).toEqual({ message: "신고글이 처리되었습니다." });
    });
  });
});
