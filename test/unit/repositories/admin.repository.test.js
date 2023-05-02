const AdminRepository = require("../../../repositories/admin.repository");
const {
  Exhibitions,
  ArticleReport,
  ExhibitionReviews,
  Artgrams,
  ArtgramsComment,
  Users,
} = require("../../../models");
const {
  getPendingExhibitionsSchemaByService,
  processReportMockdata,
} = require("../../fixtures/admin.fixtures");

jest.mock("../../../models", () => ({
  Exhibitions: {
    findAll: jest.fn(),
    update: jest.fn(),
    findOne: jest.fn(),
  },
  ArticleReport: {
    findAll: jest.fn(),
    update: jest.fn(),
  },
  ExhibitionReviews: {
    findOne: jest.fn(),
    update: jest.fn(),
  },
  Artgrams: {
    findOne: jest.fn(),
    update: jest.fn(),
  },
  ArtgramsComment: {
    findOne: jest.fn(),
    update: jest.fn(),
  },
  Users: {
    findOne: jest.fn(),
    update: jest.fn(),
  },
  exhibitionId: jest.fn(),
  exhibitionReviewId: jest.fn(),
  artgramId: jest.fn(),
  commentId: jest.fn(),
  commentParent: jest.fn(),
  userEmail: jest.fn(),
}));

describe("AdminRepository", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  const adminRepository = new AdminRepository();

  it("전시회 승인리스트", async () => {
    Exhibitions.findAll.mockResolvedValue("exhibitions");

    const result = await adminRepository.getPendingExhibitions();

    expect(Exhibitions.findAll).toHaveBeenCalledWith({
      attributes: [
        "exhibitionId",
        "userEmail",
        "exhibitionTitle",
        "exhibitionEngTitle",
        "exhibitionDesc",
        "postImage",
        "exhibitionStatus",
      ],
      where: { exhibitionStatus: "ES05" },
    });
    expect(result).toBe("exhibitions");
  });

  it("전시회 승인", async () => {
    Exhibitions.update.mockResolvedValue([1]);
    const exhibitionId = "170ef333-6518-486b-94aa-dcfec533b574";
    const result = await adminRepository.approveExhibition(exhibitionId);

    expect(Exhibitions.update).toHaveBeenCalledWith(
      {
        exhibitionStatus: "ES01",
      },
      {
        where: { exhibitionId },
      }
    );
    expect(result).toEqual([1]);
  });

  it("신고 리스트", async () => {
    Exhibitions.findAll.mockResolvedValue();

    const result = await adminRepository.getAllReports();

    expect(ArticleReport.findAll).toHaveBeenCalledWith({});
    expect(result).toBe();
  });

  it("전시회 신고처리", async () => {
    Exhibitions.findOne.mockResolvedValue();
    const exhibitionId = "170ef333-6518-486b-94aa-dcfec533b574";
    const result = await adminRepository.processReportExhibition(exhibitionId);

    expect(Exhibitions.findOne).toHaveBeenCalledWith({
      where: { exhibitionId },
    });
    expect(ArticleReport.update).toHaveBeenCalledWith(
      {
        reportComplete: "clear",
      },
      {
        where: { exhibitionId },
      }
    );
    expect(Exhibitions.update).toHaveBeenCalledWith(
      {
        exhibitionStatus: "ES04",
      },
      {
        where: { exhibitionId },
      }
    );
    expect(result).toBe();
  });
  it("리뷰 신고처리", async () => {
    ExhibitionReviews.findOne.mockResolvedValue();
    const exhibitionReviewId = "1";
    const result = await adminRepository.processReportReview(
      exhibitionReviewId
    );

    expect(ExhibitionReviews.findOne).toHaveBeenCalledWith({
      where: { exhibitionReviewId },
    });
    expect(ArticleReport.update).toHaveBeenCalledWith(
      {
        reportComplete: "clear",
      },
      {
        where: { exhibitionReviewId },
      }
    );
    expect(ExhibitionReviews.update).toHaveBeenCalledWith(
      {
        reviewStatus: "RS04",
      },
      {
        where: { exhibition_review_id: exhibitionReviewId },
      }
    );
    expect(result).toBe();
  });
  it("아트그램 신고처리", async () => {
    Artgrams.findOne.mockResolvedValue();
    const artgramId = "1";
    const result = await adminRepository.processReportArtgram(artgramId);

    expect(Artgrams.findOne).toHaveBeenCalledWith({
      where: { artgramId },
    });
    expect(ArticleReport.update).toHaveBeenCalledWith(
      {
        reportComplete: "clear",
      },
      {
        where: { artgramId },
      }
    );
    expect(Artgrams.update).toHaveBeenCalledWith(
      {
        artgramStatus: "AS04",
      },
      {
        where: { artgramId },
      }
    );
    expect(result).toBe();
  });
  it("댓글 신고처리", async () => {
    ArtgramsComment.findOne.mockResolvedValue();
    const commentId = "1";
    const result = await adminRepository.processReportComment(commentId);

    expect(ArtgramsComment.findOne).toHaveBeenCalledWith({
      where: { commentId },
    });
    expect(ArticleReport.update).toHaveBeenCalledWith(
      {
        reportComplete: "clear",
      },
      {
        where: { commentId },
      }
    );
    expect(ArtgramsComment.update).toHaveBeenCalledWith(
      {
        commentStatus: "CS04",
      },
      {
        where: { commentId },
      }
    );
    expect(result).toBe();
  });
  it("답글 신고처리", async () => {
    ArtgramsComment.findOne.mockResolvedValue();
    const commentId = "1";
    const commentParent = undefined;
    const result = await adminRepository.processReportCommentParent(
      commentId,
      commentParent
    );

    expect(ArtgramsComment.findOne).toHaveBeenCalledWith({
      where: { commentId, commentParent },
    });
    expect(ArticleReport.update).toHaveBeenCalledWith(
      {
        reportComplete: "clear",
      },
      {
        where: { commentId, commentParent },
      }
    );
    expect(ArtgramsComment.update).toHaveBeenCalledWith(
      {
        commentStatus: "CS04",
      },
      {
        where: { commentId, commentParent },
      }
    );
    expect(result).toBe();
  });
  it("유저 신고처리", async () => {
    Users.findOne.mockResolvedValue();
    const userEmail = "t";
    const result = await adminRepository.processReportUserEmail(userEmail);

    expect(Users.findOne).toHaveBeenCalledWith({
      where: { userEmail },
    });
    expect(ArticleReport.update).toHaveBeenCalledWith(
      {
        reportComplete: "clear",
      },
      {
        where: { userEmail },
      }
    );
    expect(Users.update).toHaveBeenCalledWith(
      {
        userStatus: "US04",
      },
      {
        where: { userEmail },
      }
    );
    expect(result).toBe();
  });
});
