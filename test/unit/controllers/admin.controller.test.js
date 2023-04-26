const AdminController = require("../../../controllers/admin.controller");
// const { describe } = require("../../../schemas/userReqSchema");
const adminService = require("../../../services/admin.service");

jest.mock("../../../services/admin.service");

describe("전시회 승인", () => {
  it("승인되지 않은 전시회목록", async () => {
    const req = {};
    const res = {
      locals: { user: { userEmail: "ekqls6812@naver.com" } },
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    const findApprovalList = [
      {
        exhibitionId: "04df277c-c8e7-4b83-a424-a2991c437e1a",
        exhibitionTitle:
          "[코리아나미술관 & 코리아나 화장박물관] 시간/물질 : 생동하는 뮤지엄",
        exhibitionDesc:
          "수복한 작가의 초기 조각상부터 비누 도자기에 은박, 동박",
        postImage:
          "http://www.art114.kr/files/attach/images/1337/294/031/035/08c842d843e5f8004033cc949eb3c121.png",
        exhibitionStatus: "ES05",
      },
    ];
    adminService.getPendingExhibitions.mockResolvedValue(findApprovalList);

    await new AdminController().getPendingExhibitions(req, res, next);

    expect(
      adminService.getPendingExhibitions.toHaveBeenCalledWith(
        "ekqls6812@naver.com"
      )
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ findApprovalList });
    expect(next).not.toHaveBeenCalledWith();
  });

  it("에러 핸들러", async () => {
    const req = {};
    const res = {
      locals: { user: { userEmail: "ekqls6812@naver.com" } },
    };
    const next = jest.fn();

    const error = new Error("error");
    adminService.getPendingExhibitions.mockRejectedValue(error);

    await new AdminController().getPendingExhibitions(req, res, next);

    expect(adminService.getPendingExhibitions).toHaveBeenCalledWith(
      "ekqls6812@naver.com"
    );
    expect(next).toHaveBeenCalledWith(error);
    expect(res.status).not.toHaveBeenCalledWith();
    expect(res.json).not.toHaveBeenCalledWith();
  });
});
