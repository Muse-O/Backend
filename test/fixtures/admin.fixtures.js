// //사용하기전에 mockReq를 초기화해줌
// //독립적인 실행이 가능해짐
// beforeEach(() => {
const mockReq = {
  body: {
    reportEmail: "ekqls6812@dd.com",
    exhibitionId: "170ef333-6518-486b-94aa-dcfec533b574",
    exhibitionReviewId: "0aec8369-f455-45c2-8c23-ea7fc1520b96e",
    artgramId: "01312afb-cfee-4e8d-ae51-2a438fd5b423",
    commentId: "08d8c17e-a36f-40bb-9a10-724bd674bbd9",
    commentParent: "2e86cccb-f2d0-453a-b2a1-8ea065198f23",
    articleType: "RP000001",
    articleType: "RP000002",
    articleType: "RP000003",
    articleType: "RP000004",
    articleType: "RP000005",
    articleType: "RP000006",
  },
};
// });

const mockRes = {
  locals: {
    user: {
      userEmail: "ekqls6812@dd.com",
    },
  },
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};

const mockNext = jest.fn();

const mockPendingExhibitionsData = [
  {
    exhibitionId: "170ef333-6518-486b-94aa-dcfec533b574",
    userEmail: "back@naver.com",
    exhibitionTitle:
      "[코리아나미술관 & 코리아나 화장박물관] 시간/물질 : 생동하는 뮤지엄",
    exhibitionEngTitle: "Infinite Numeral",
    exhibitionDesc:
      "수복한 작가의 초기 조각상부터 비누 도자기에 은박, 동박을 씌워 시간의 흔적을 표현한 <화석화된 시간 시리즈>(2018), 투명한 유리 도자기를 번역한 <고스트 시리즈>(2007~2013), 앤틱 프레임과 비누가 대조를 이루는 <페인팅 시리즈>(2014~) 등 작가의 기존 작업세계를 구성해 온 작품을 총망라하는 동시에, 모더니즘 추상회화를 떠올리게 하는 대형 비누회화조각 및 코리아나미술관의 소장품에서 영감을 받아 제작한 <낭만주의 조각 시리즈>가 새롭게",
    postImage:
      "http://www.art114.kr/files/attach/images/1337/294/031/035/08c842d843e5f8004033cc949eb3c121.png",
    exhibitionStatus: "ES05",
  },
];

const mockGetAllReports = [
  {
    reportId: "7d0e1c47-b653-4292-b57e-91ae74cf4c4e",
    userEmail: "ekqls6812@dd.com",
    artgramId: null,
    exhibitionId: null,
    exhibitionReviewId: null,
    commentParent: "d96f8c72-bab9-4520-9f90-1914d920cdd0",
    commentId: "04c4718b-10db-40ac-9037-c0083cad3bf1",
    reportEmail: null,
    articleType: "RP000005",
    reportMessage: "???",
    reportComplete: "clear",
    createdAt: "2023-04-27T17:03:55.000Z",
    updatedAt: "2023-04-28T07:29:42.000Z",
  },
];

const userRoles = [
  { role: "UR01", description: "관리자아이디로만 접근이 가능합니다." },
  { role: "UR02", description: "관리자아이디로만 접근이 가능합니다." },
  { role: "UR03", description: "어드민입니다." },
];

module.exports = {
  mockReq,
  mockRes,
  mockNext,
  mockPendingExhibitionsData,
  mockGetAllReports,
  userRoles,
};
