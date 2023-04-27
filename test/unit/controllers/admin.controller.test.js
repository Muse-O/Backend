const AdminController = require("../../../controllers/admin.controller");

const adminController = new AdminController();

const res = {
  status: jest.fn(() => res),
  send: jest.fn(),
};
const next = jest.fn();

describe("전시회 리스트", () => {
  test("로그인되어있으면 리스트를 받아옴", async () => {
    const req = {
      isAuthenticated: jest.fn(() => true),
    };
    const mockExhibitions = [
      { id: 1, name: "Exhibition 1", status: "pending" },
      { id: 2, name: "Exhibition 2", status: "approved" },
      { id: 3, name: "Exhibition 3", status: "rejected" },
    ];
    adminController.getPendingExhibitions = jest.fn(() => mockExhibitions);
    await adminController.getPendingExhibitions(req, res, next);
    expect(adminController.getPendingExhibitions).toBeCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(mockExhibitions);
  });
});
