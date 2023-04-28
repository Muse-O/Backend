const res = {
  status: jest.fn(() => res),
  send: jest.fn(),
};
const next = jest.fn();

//class를 선언해서 함수에 해당하는 mock데이터를 만들어서 사용
class AdminController {
  async getPendingExhibitions(req, res, next) {
    try {
      // 데이터베이스 쿼리 대신 모의 데이터를 사용
      const mockExhibitions = [
        { id: 1, name: "Exhibition 1", status: "pending" },
        { id: 2, name: "Exhibition 2", status: "approved" },
        { id: 3, name: "Exhibition 3", status: "rejected" },
      ];

      return res.status(200).send(mockExhibitions);
    } catch (error) {
      next(error);
    }
  }
}
