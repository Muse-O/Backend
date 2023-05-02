// require("dotenv").config();
// const config = require("../../../config/config");
const {
  mockReq,
  mockRes,
  mockNext,
  mockPendingExhibitionsData,
  mockGetAllReports,
} = require("../../fixtures/admin.fixtures");
const AdminController = require("../../../controllers/admin.controller");

describe("어드민 컨트롤러 테스트", () => {
  let server;

  beforeEach(() => {
    server = require("../server");
  });

  afterEach(() => {
    server.close();
  });

  const mockAdminService = {
    approveExhibition: jest.fn(() => Promise.resolve()),
    getPendingExhibitions: jest.fn(() =>
      Promise.resolve(mockPendingExhibitionsData)
    ),
    getAllReports: jest.fn(() => Promise.resolve(mockGetAllReports)),
    processReport: jest.fn(() => Promise.resolve()),
  };

  const adminController = new AdminController();
  adminController.adminService = mockAdminService;

  test("전시회 승인요청 목록조회", async () => {
    await adminController.getPendingExhibitions(mockReq, mockRes, mockNext);

    expect(mockAdminService.getPendingExhibitions).toHaveBeenCalledWith(
      mockRes.locals.user.userEmail
    );
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      findApprovalList: mockPendingExhibitionsData,
    });
  });
  test("전시회 승인", async () => {
    await adminController.approveExhibition(mockReq, mockRes, mockNext);

    expect(mockAdminService.approveExhibition).toHaveBeenCalledWith(
      mockRes.locals.user.userEmail,
      mockReq.body.exhibitionId
    );
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "전시글이 승인되었습니다.",
    });
  });
  test("신고목록 조회", async () => {
    await adminController.getAllReports(mockReq, mockRes, mockNext);

    expect(mockAdminService.getAllReports).toHaveBeenCalledWith(
      mockRes.locals.user.userEmail
    );
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      reportList: mockGetAllReports,
    });
  });
  describe("신고처리", () => {
    test("유저신고처리", async () => {
      mockReq.body = {
        articleType: "RP000006",
      };
      await adminController.processReport(mockReq, mockRes, mockNext);

      //케이스별로 테스트코드만들기
      expect(mockAdminService.processReport).toHaveBeenCalledWith(
        mockRes.locals.user.userEmail,
        mockReq.body.reportEmail,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        mockReq.body.articleType
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "신고글이 처리되었습니다.",
      });
    });
    test("전시회신고처리", async () => {
      mockReq.body = {
        articleType: "RP000001",
      };
      await adminController.processReport(mockReq, mockRes, mockNext);
      expect(mockAdminService.processReport).toHaveBeenCalledWith(
        mockRes.locals.user.userEmail,
        undefined,
        mockReq.body.exhibitionId,
        undefined,
        undefined,
        undefined,
        undefined,
        mockReq.body.articleType
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "신고글이 처리되었습니다.",
      });
    });

    test("전시회리뷰신고처리", async () => {
      mockReq.body = {
        articleType: "RP000002",
      };
      await adminController.processReport(mockReq, mockRes, mockNext);
      expect(mockAdminService.processReport).toHaveBeenCalledWith(
        mockRes.locals.user.userEmail,
        undefined,
        undefined,
        mockReq.body.exhibitionReviewId,
        undefined,
        undefined,
        undefined,
        mockReq.body.articleType
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "신고글이 처리되었습니다.",
      });
    });
    test("아트그램신고처리", async () => {
      mockReq.body = {
        articleType: "RP000003",
      };
      await adminController.processReport(mockReq, mockRes, mockNext);
      expect(mockAdminService.processReport).toHaveBeenCalledWith(
        mockRes.locals.user.userEmail,
        undefined,
        undefined,
        undefined,
        mockReq.body.artgramId,
        undefined,
        undefined,
        mockReq.body.articleType
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "신고글이 처리되었습니다.",
      });
    });
    test("아트그램 댓글신고처리", async () => {
      mockReq.body = {
        articleType: "RP000004",
      };
      await adminController.processReport(mockReq, mockRes, mockNext);
      expect(mockAdminService.processReport).toHaveBeenCalledWith(
        mockRes.locals.user.userEmail,
        undefined,
        undefined,
        undefined,
        undefined,
        mockReq.body.commentId,
        undefined,
        mockReq.body.articleType
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "신고글이 처리되었습니다.",
      });
    });
    test("아트그램 답글신고처리", async () => {
      mockReq.body = {
        articleType: "RP000005",
      };
      await adminController.processReport(mockReq, mockRes, mockNext);
      expect(mockAdminService.processReport).toHaveBeenCalledWith(
        mockRes.locals.user.userEmail,
        undefined,
        undefined,
        undefined,
        undefined,
        mockReq.body.commentId,
        mockReq.body.commentParent,
        mockReq.body.articleType
      );
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        message: "신고글이 처리되었습니다.",
      });
    });
  });
});
