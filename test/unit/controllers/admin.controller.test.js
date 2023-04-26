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
      inAuthenticated: jest.fn(() => true),
    };
    await adminController.getPendingExhibitions(req, res, next);
    expect(adminController.getPendingExhibitions).toBeCalledTimes(1);
  });
});
