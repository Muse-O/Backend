const {
  getPendingExhibitionsSchemaByService,
  processReportMockdata,
} = require("../../fixtures/admin.fixtures");
const AdminService = require("../../../services/admin.service");
const Boom = require("boom");

const mockAdminRepository = {
  approveExhibition: jest.fn(() => Promise.resolve()),
  getPendingExhibitions: jest.fn(() => Promise.resolve()),
  getAllReports: jest.fn(() => Promise.resolve()),
  processReportExhibition: jest.fn(() =>
    Promise.resolve(processReportExhibitionResultSchema)
  ),
  processReportReview: jest.fn(() =>
    Promise.resolve(processReportReviewResultSchema)
  ),
  processReportArtgram: jest.fn(() =>
    Promise.resolve(processReportArtgramResultSchema)
  ),
  processReportComment: jest.fn(() =>
    Promise.resolve(processReportCommentResultSchema)
  ),
  processReportCommentParent: jest.fn(() =>
    Promise.resolve(processReportCommentParentResultSchema)
  ),
  processReportUserEmail: jest.fn(() =>
    Promise.resolve(processReportUserEmailResultSchema)
  ),
  return: jest.fn(() => Promise.resolve(returnSchema)),
};

describe("adminService test", function () {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  let adminService = new AdminService();
  adminService.adminRepository = mockAdminRepository;

  test("어드민 기본 테스트", async () => {
    let adminService = new AdminService();

    adminService.adminRepository = Object.assign({}, mockAdminRepository);
    adminService.adminRepository.getPendingExhibitions = jest.fn();
    adminService.adminRepository.approveExhibition = jest.fn(
      () => getPendingExhibitionsSchemaByService
    );
    adminService.adminRepository.processReport = jest.fn(
      () => processReportMockdata
    );
    adminService.adminRepository.getAllReports = jest.fn();
  });

  test("전시회 신고처리 (articleType: RP000001)", async () => {
    try {
      const report = await adminService.processReport(
        undefined, // reportEmail
        "170ef333-6518-486b-94aa-dcfec533b574", // exhibitionId
        undefined, // exhibitionReviewId
        undefined, // artgramId
        undefined, // commentId
        undefined, // commentParent
        "RP000001" // articleType
      );

      expect(report).toEqual(processReportExhibitionResultSchema);
      expect(
        adminService.adminRepository.processReportExhibition
      ).toHaveBeenCalled();
    } catch (error) {
      expect(error).toEqual(Boom.notFound("존재하지 않는 전시회입니다."));
    }
  });
  test("리뷰 신고처리 (articleType: RP000002)", async () => {
    try {
      const report = await adminService.processReport(
        undefined, // reportEmail
        undefined, // exhibitionId
        "170ef333-6518-486b-94aa-dcfec533b574", // exhibitionReviewId
        undefined, // artgramId
        undefined, // commentId
        undefined, // commentParent
        "RP000002" // articleType
      );

      expect(report).toEqual(processReportExhibitionResultSchema);
      expect(
        adminService.adminRepository.processReportExhibition
      ).toHaveBeenCalled();
    } catch (error) {
      expect(error).toEqual(Boom.notFound("존재하지 않는 리뷰입니다."));
    }
  });
  test("아트그램 신고처리 (articleType: RP000003)", async () => {
    try {
      const report = await adminService.processReport(
        undefined, // reportEmail
        undefined, // exhibitionId
        undefined, // exhibitionReviewId
        "170ef333-6518-486b-94aa-dcfec533b574", // artgramId
        undefined, // commentId
        undefined, // commentParent
        "RP000003" // articleType
      );

      expect(report).toEqual(processReportExhibitionResultSchema);
      expect(
        adminService.adminRepository.processReportExhibition
      ).toHaveBeenCalled();
    } catch (error) {
      expect(error).toEqual(Boom.notFound("존재하지 않는 아트그램입니다."));
    }
  });
  test("댓글 신고처리 (articleType: RP000004)", async () => {
    try {
      const report = await adminService.processReport(
        undefined, // reportEmail
        undefined, // exhibitionId
        undefined, // exhibitionReviewId
        undefined, // artgramId
        "170ef333-6518-486b-94aa-dcfec533b574", // commentId
        undefined, // commentParent
        "RP000004" // articleType
      );

      expect(report).toEqual(processReportExhibitionResultSchema);
      expect(
        adminService.adminRepository.processReportExhibition
      ).toHaveBeenCalled();
    } catch (error) {
      expect(error).toEqual(Boom.notFound("존재하지 않는 댓글입니다."));
    }
  });
  test("답글 신고처리 (articleType: RP000005)", async () => {
    try {
      const report = await adminService.processReport(
        undefined, // reportEmail
        undefined, // exhibitionId
        undefined, // exhibitionReviewId
        undefined, // artgramId
        "170ef333-6518-486b-94aa-dcfec533b574", // commentId
        "170ef333-6518-486b-94aa-dcfec533b574", // commentParent
        "RP000005" // articleType
      );

      expect(report).toEqual(processReportExhibitionResultSchema);
      expect(
        adminService.adminRepository.processReportExhibition
      ).toHaveBeenCalled();
    } catch (error) {
      expect(error).toEqual(Boom.notFound("존재하지 않는 답글입니다."));
    }
  });
  test("유저 신고처리 (articleType: RP000006)", async () => {
    try {
      const report = await adminService.processReport(
        "170ef333-6518-486b-94aa-dcfec533b574", // reportEmail
        undefined, // exhibitionId
        undefined, // exhibitionReviewId
        undefined, // artgramId
        undefined, // commentId
        undefined, // commentParent
        "RP000006" // articleType
      );

      expect(report).toEqual(processReportExhibitionResultSchema);
      expect(
        adminService.adminRepository.processReportExhibition
      ).toHaveBeenCalled();
    } catch (error) {
      expect(error).toEqual(Boom.notFound("존재하지 않는 유저입니다."));
    }
  });
  test("존재하지 않는 전시회 (articleType: RP000001)", async () => {
    adminService.adminRepository.processReportExhibition.mockReturnValueOnce(
      Promise.resolve(null)
    );

    try {
      await adminService.processReport(
        undefined, // reportEmail
        undefined, // exhibitionId
        undefined, // exhibitionReviewId
        undefined, // artgramId
        undefined, // commentId
        undefined, // commentParent
        "RP000001" // articleType
      );
    } catch (error) {
      expect(error).toEqual(Boom.notFound("존재하지 않는 전시회입니다."));
    }
  });
  test("존재하지 않는 리뷰 (articleType: RP000002)", async () => {
    adminService.adminRepository.processReportExhibition.mockReturnValueOnce(
      Promise.resolve(null)
    );

    try {
      await adminService.processReport(
        undefined, // reportEmail
        undefined, // exhibitionId
        "nonexistent-exhibitionReview-id", // exhibitionReviewId
        undefined, // artgramId
        undefined, // commentId
        undefined, // commentParent
        "RP000002" // articleType
      );
    } catch (error) {
      expect(error).toEqual(Boom.notFound("존재하지 않는 리뷰입니다."));
    }
  });
  test("존재하지 않는 아트그램 (articleType: RP000003)", async () => {
    adminService.adminRepository.processReportExhibition.mockReturnValueOnce(
      Promise.resolve(null)
    );

    try {
      await adminService.processReport(
        undefined, // reportEmail
        undefined, // exhibitionId
        undefined, // exhibitionReviewId
        "nonexistent-artgram-id", // artgramId
        undefined, // commentId
        undefined, // commentParent
        "RP000003" // articleType
      );
    } catch (error) {
      expect(error).toEqual(Boom.notFound("존재하지 않는 아트그램입니다."));
    }
  });
  test("존재하지 않는 댓글 (articleType: RP000004)", async () => {
    adminService.adminRepository.processReportExhibition.mockReturnValueOnce(
      Promise.resolve(null)
    );

    try {
      await adminService.processReport(
        undefined, // reportEmail
        undefined, // exhibitionId
        undefined, // exhibitionReviewId
        undefined, // artgramId
        "nonexistent-comment-id", // commentId
        undefined, // commentParent
        "RP000004" // articleType
      );
    } catch (error) {
      expect(error).toEqual(Boom.notFound("존재하지 않는 댓글입니다."));
    }
  });
  test("존재하지 않는 답글 (articleType: RP000005)", async () => {
    adminService.adminRepository.processReportExhibition.mockReturnValueOnce(
      Promise.resolve(null)
    );

    try {
      await adminService.processReport(
        undefined, // reportEmail
        undefined, // exhibitionId
        undefined, // exhibitionReviewId
        undefined, // artgramId
        "nonexistent-comment-id", // commentId
        "nonexistent-commentParent-id", // commentParent
        "RP000005" // articleType
      );
    } catch (error) {
      expect(error).toEqual(Boom.notFound("존재하지 않는 답글입니다."));
    }
  });
  test("존재하지 않는 유저 (articleType: RP000006)", async () => {
    adminService.adminRepository.processReportExhibition.mockReturnValueOnce(
      Promise.resolve(null)
    );

    try {
      await adminService.processReport(
        "nonexistent-reportEmail-id", // reportEmail
        undefined, // exhibitionId
        undefined, // exhibitionReviewId
        undefined, // artgramId
        undefined, // commentId
        undefined, // commentParent
        "RP000006" // articleType
      );
    } catch (error) {
      expect(error).toEqual(Boom.notFound("존재하지 않는 유저입니다."));
    }
  });
  test("삭제할 게시글이 존재하지 않을 경우", async () => {
    try {
      await adminService.processReport(
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        "invalidArticleType"
      );
    } catch (error) {
      expect(error).toEqual(new Error("삭제할 게시글이 존재하지 않습니다."));
    }
  });
});
