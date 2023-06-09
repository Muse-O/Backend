[![Node.js CI](https://github.com/Muse-O/Backend/actions/workflows/release.yml/badge.svg)](https://github.com/Muse-O/Backend/actions/workflows/release.yml)
# 국내 전시 커뮤니티 - Muse-O

![MUSE-O브로셔](https://user-images.githubusercontent.com/51357635/236382171-b6eff0b3-c993-4243-876e-b8ac096f507b.png)
## 🏠 [Home Page](https://museoh.shop/)
---
## 🗂️ 목차

### 1. [프로젝트 소개](#-프로젝트-소개)

### 2. [팀 구성](#-팀-구성)

### 3. [기술 스택](#-기술스택-도입-목적)

### 4. [라이브러리](#-라이브러리-도입-목적)

### 5. [주요 기능 및 역할](#️-주요-기능-및-역할)

### 6. [아키텍쳐](#-백엔드-아키텍처)

### 7. [트러블 슈팅](#-트러블-슈팅)
---
## 👨🏻‍🎨 프로젝트 소개
#### 국내 유명 전시부터 찾기 힘든 개인전까지 볼 수 있는 전시 커뮤니티!

- MUSE-O는 전시회를 즐기는 사람들을 위해 전시회 기반 커뮤니티 서비스를 제공합니다.
- 개인전을 홍보하기 힘든 작가들을 위해 개인전을 적극적으로 홍보해줍니다.
- 전시에 방문했던 경험을 사람들과 공유할 수 있고 전시에 대한 리뷰를 공유할 수 있습니다.
- 내 전시에 대한 반응, 내 게시글에 대한 반응을 알람을 통해 확인할 수 있습니다.
- 특정 작가와 대화를 나눌 수 있도록 1:1 메시지를 남길 수 있습니다.
---
## 🗓 프로젝트 기간

- 2023년 03월 31일 ~ 2023년 05월 12일 (이후 계속될 예정)
---
## 🧑‍💻 팀 구성

[팀 노션 페이지](https://www.notion.so/seungho-white/9-MUSE-O-SA-f7e236258c4f4eb7aa8acff482357f60)

<table>
  <tr>
  <td colspan='2' align="center">
  Backend
  </td>
  <td colspan='2' align="center">
  Frontend
  </td>
  <td colspan='2' align="center">
  Designer
  </td>
  </tr>
  <tr>
  <td align="center"><img src="https://avatars.githubusercontent.com/u/124576278?v=4" width="60px;" alt=""/>
    </td>
    <td align="center" >
    <b>김다빈</b><br/>
    <a href="https://github.com/dabeenkim">Github</a>
    <br/>
    <img src="https://img.shields.io/badge/Node.js-339933?style=flat&logo=Node.js&logoColor=white"/><br/>
    </td>
    <td align="center"><img src="https://avatars.githubusercontent.com/u/107828870?v=4" width="60px;" alt=""/>
    </td>
    <td align="center">
    <b>김재란</b><br/>
    <a href="https://github.com/gitjaeran" >Github</a>
    <br/><img src="https://img.shields.io/badge/React-61DAFB?style=flat&logo=React&logoColor=white"/><br/>
    </td>
    <td align="center"><img src="https://woog-s3-bucket.s3.amazonaws.com/profile/4e714112-0958-4693-806c-f264f77907a4.png" width="60px;" alt=""/>
    </td>
    <td align="center">
    <b>강혜린</b><br/>
    </td>
    </tr>
    <tr>
    <td align="center"><img src="https://avatars.githubusercontent.com/u/111281798?v=4" width="60px;" alt=""/>
    </td>
    <td align="center">
    <b>문서아</b><br/> 
    <a href="https://github.com/mseoa">Github</a>
    <br/><img src="https://img.shields.io/badge/Node.js-339933?style=flat&logo=Node.js&logoColor=white"/><br/>
    </td>
    <td align="center"><img src="https://avatars.githubusercontent.com/u/111627625?v=4" width="60px;" alt=""/>
    </td>
    <td align="center">
    <b>박영찬</b><br/> 
    <a href="https://github.com/19Edwin92">Github</a>
    <br/><img src="https://img.shields.io/badge/React-61DAFB?style=flat&logo=React&logoColor=white"/><br/>
    </td>
    </tr>
    <tr>
    <td align="center"><img src="https://avatars.githubusercontent.com/u/51357635?s=400&u=36fd01b69ccd7729620c086927f9c0847ffdb0e1&v=4" width="60px;" alt=""/>
    </td>
    <td align="center">
    <b>임건</b><br/> 
    <a href="https://github.com/WoogLim">Github</a>
    <br/><img src="https://img.shields.io/badge/Node.js-339933?style=flat&logo=Node.js&logoColor=white"/><br/>
    </td>
    <td align="center"><img src="https://avatars.githubusercontent.com/u/105100315?v=4" width="60px;" alt=""/>
    </td>
    <td align="center">
    <b>백승호</b><br/> 
    <a href="https://github.com/seunghowhite">Github</a>
    <br/><img src="https://img.shields.io/badge/React-61DAFB?style=flat&logo=React&logoColor=white"/><br/>
    </td>
    </tr>
</table>

---
## 🛠 기술스택 ([도입 목적](https://www.notion.so/6a6f13386ed543afb9da18a282edc2d7))

기술스택 | 설명
---|:---:
Node.js | 자바스크립트 런타임
Express | 웹 프레임워크
MySQL | MySQL
Redis | Redis
GitHub Action | CI/CD 툴
Nginx | Proxy 서버
AWS Lambda | S3 이미지 리사이징
CloudFlare Images | 서브 이미지 업로드(메인은 S3)
Socket.io | 소켓 통신
---

## 📖 라이브러리 ([도입 목적](https://seungho-white.notion.site/8a486c22d7b94ef2b2f5a38e17c637aa))

## Dependencies
라이브러리 | 설명
---|:---:
<img src='https://img.shields.io/badge/artillery-2.0.0-lightgrey'> | 서버 부하 테스트
<img src="https://img.shields.io/badge/axios-1.4.0-lightgrey"> | 서버에서 클라이언트로 HTTP 요청/응답
<img src='https://img.shields.io/badge/bcrypt-5.1.0-lightgrey'>  | 비밀번호 암호화
<img src='https://img.shields.io/badge/boom-7.3.0-lightgrey'> | HTTP 에러 처리
<img src='https://img.shields.io/badge/cookie--parser-1.4.6-lightgrey'>  | 쿠키 파싱 미들웨어
<img src='https://img.shields.io/badge/cors-2.8.5-lightgrey'> | Cross-Origin Resource Sharing
<img src='https://img.shields.io/badge/dayjs-1.11.7-lightgrey'> | 날짜와 시간 처리
<img src='https://img.shields.io/badge/dayjs--ext-2.2.0-lightgrey'>  | dayjs의 확장 라이브러리
<img src='https://img.shields.io/badge/dotenv-16.0.3-lightgrey'>  | 환경 변수 설정
<img src='https://img.shields.io/badge/express-4.18.2-lightgrey'>  | 웹 애플리케이션 프레임워크
<img src='https://img.shields.io/badge/http--proxy--middleware-2.0.6-lightgrey'>  | 프록시 설정
<img src='https://img.shields.io/badge/joi-17.9.1-lightgrey'>  | 객체 스키마 유효성 검사
<img src='https://img.shields.io/badge/jsonwebtoken-9.0.0-lightgrey'> | JWT 생성 검증
<img src='https://img.shields.io/badge/lodash-4.17.21-lightgrey'> | HTTP Log 기록
<img src='https://img.shields.io/badge/morgan-1.10.0-lightgrey'> | HTTP 요청 로깅
<img src='https://img.shields.io/badge/mysql2-3.2.0-lightgrey'> | MySQL
<img src='https://img.shields.io/badge/node--schedule-2.1.1-lightgrey'> | 스케쥴 업무 자동화
<img src='https://img.shields.io/badge/nodemailer-6.9.1-lightgrey'>  | 이메일 전송
<img src='https://img.shields.io/badge/passport-0.6.0-lightgrey'> | Oauth 지원
<img src='https://img.shields.io/badge/passport--google--oauth20-2.0.0-lightgrey'> | passport 구글 전략
<img src='https://img.shields.io/badge/passport--kakao-1.0.1-lightgrey'> | passport 카카오 전략
<img src='https://img.shields.io/badge/passport--naver--v2-2.0.8-lightgrey'> | passport 네이버 전략
<img src='https://img.shields.io/badge/request--ip-3.3.0-lightgrey'> | 요청 IP 주소를 파싱
<img src='https://img.shields.io/badge/sequelize-6.30.0-lightgrey'> | ORM(Object-Relational Mapping) 라이브러리
<img src='https://img.shields.io/badge/socket--io-4.6.1-lightgrey'> | WebSocket 프로토콜
<img src='https://img.shields.io/badge/winston-3.8.2-lightgrey'> | Log 파일 관리
<img src='https://img.shields.io/badge/winston--daily--rotate--file-4.7.1-lightgrey'> | Winston 전용 로그 파일을 일별로 저장
<img src='https://img.shields.io/badge/winston--loggly--bulk-3.2.1-lightgrey'> | Winston 로그를 Loggly 서비스로 전송
<img src='https://img.shields.io/badge/helmet-6.1.5-lightgrey'> | HTTP 헤더 보안
<img src='https://img.shields.io/badge/redis-4.6.5-lightgrey'> | Redis Node.js 클라이언트
<img src='https://img.shields.io/badge/ioredis-5.3.1-lightgrey'> | Redis Node.js 클라이언트
## DevDependencies

라이브러리 | 설명
---|:---:
<img src='https://img.shields.io/badge/jest-29.5.0-lightgrey'> | 테스트 프레임워크
<img src='https://img.shields.io/badge/supertest-6.3.3-lightgrey'> | HTTP 요청을 테스트
<img src='https://img.shields.io/badge/nodemon-2.0.22-lightgrey'> | 서버 자동 재시작
<img src='https://img.shields.io/badge/prettier-2.8.7-lightgrey'> | 코드 스타일 자동정리
<img src='https://img.shields.io/badge/sequelize--cli-6.6.0-lightgrey'> | Sequelize 명령줄 인터페이스
<img src='https://img.shields.io/badge/swagger--autogen-2.23.1-lightgrey'> | Swagger 문서를 자동 생성
<img src='https://img.shields.io/badge/swagger--jsdoc-6.2.8-lightgrey'> | JSDoc을 사용하여 Swagger 문서 생성
<img src='https://img.shields.io/badge/swagger--ui--express-4.6.2-lightgrey'> | Swagger UI를 Express에서 사용
<img src='https://img.shields.io/badge/yamljs-0.3.0-lightgrey'> | YAML 파일 로드

---

## 🧱 백엔드 아키텍처
![Backend-Architecture](https://user-images.githubusercontent.com/51357635/236399953-4caefd53-2e73-40a9-9e71-4ea8b66273db.png)
## 🧱 API LIST
![API-FLOW](https://user-images.githubusercontent.com/51357635/236438491-decb96cd-0039-41d5-b25f-828c7151652d.png)
## 🧱 ERD LIST
![image](https://user-images.githubusercontent.com/51357635/236434831-869de97c-1620-486e-a59f-7aac8984b6ea.png)
[ERD 자세히 보러가기](https://www.erdcloud.com/d/ySuCsb3e7Bf3DmYp3)

---
## 🕹️ 주요 기능 및 역할

### 역할 및 기능 담당
| 역할 | 이름 | GitHub | 분담 |
| --- | --- | --- | --- |
| BE | 임건 | https://github.com/WoogLim |메인 배너 API, 전시 API, 메시지 API 및 + 페이지 구현, 인프라 구성 |
| BE | 문서아 | https://github.com/mseoa | 로그인, 회원가입, 마이페이지, 관리자 API 일부  |
| BE | 김다빈 | https://github.com/dabeenkim | 아트그램API,통합검색API,관리자API,스웨거 |

### 로그인 / 회원가입
- 이메일 인증

- 카카오 / 네이버 / 구글 OAuth 인증 기반
### 마이페이지 / 알림
- 내가 좋아요, 스크랩한 아트그램/전시 게시물을 좋아요와 스크랩한 순으로 그리고 작성한 게시글은 최신순으로 조회
- 프로필 사진, 닉네임, 소개글 수정 기능
- 작가 권한 신청 기능
- 알림목록 조회: 내가 작성한 아트그램에 좋아요 댓글이 작성될 시, 내가 작성한 아트그램 댓글에 답글이 달릴 시, 내가 작성한 전시 게시글에 후기가 작성될 시 알림 생성
  - 회원가입 시 id 별로 stream key 생성
  - 알림 저장 시 알림 받을 회원의 스트림에 생성시간 타임스탬프가 id인 엔트리를 추가하고 XREADGROUP 호출하여 consumer(알림받을 회원)에게 할당
  - 알림 조회시 XACK 처리하고 알림 목록 제공 시 XPENDING으로 읽지 않은 알림과 읽은 알림을 구분한 데이터를 제공


### 아트그램
- 아트그램 조회  
  - 아트그램사진, 작성한유저의 프로필이미지, 닉네임조회
  - 아트그램의 likeCount, scrapCount, imageCount(여러장일경우 이미지에 표시해줌) 조회
  - 현재 로그인한 유저의 like/scrap 유무확인
  - 오프셋기반 페이지네이션 구현. 무한스크롤 구현.

- 아트그램 상세 조회
  - 아트그램사진(여러장일 경우 슬라이더), 프로필이미지, 닉네임, 태그, 제목, 설명, 작성날짜 조회.
  - 아트그램id에 일치하는 댓글, 답글조회(있을경우엔 ---답글보기를 눌러서 조회가능).  
  해당 유저의 프로필이미지, 닉네임, 작성날짜조회(오늘기준으로 n일전으로 표기).
  - 댓글/답글 작성가능. 수정/삭제가능(삭제는 softDelete를 사용해 논리삭제해줌)
  - 현재 로그인한 유저의 아이디를 기준으로 아트그램의 좋아요/스크랩 유무 확인.

- 아트그램 작성
  - 이미지 s3를 이용해서 1개 이상 최대 6장저장.
  - 전시제목, 설명작성가능. #을 이용해서 태그기능가능. 

### 검색

- 검색시 전시, 아트그램, 유저별로 검색기록이 출력. 
  - 카테고리 별 조회 및 초성검색( 정규표현식이용 )가능.

- 전시 title, engtitle, desc 검색 가능.  
  - 전시제목, 전시시작일, 지역 조회.

- 아트그램 title, desc 검색가능. 
  - 아트그램사진, 작성한 유저의 프로필사진,닉네임,현재유저의 좋아요/스크랩 유무 확인

- 유저 email, nickname 검색가능. 

- 모든 유저가 검색후 클릭한 게시글을 db에 저장하여 인기게시글 10개 정렬.

- 현재 로그인한 유저가 검색후 최근 본 게시글 기준으로 10개 표시.

### 관리자페이지
- 전시회 승인요청 리스트
  - 전시회 생성 시 관리자의 승인 후 전시 목록에 게시됨. 승인 이전 전시 목록 조회

- 전시회 승인
  - 승인 대기로 설정되어있는 전시 확인 후 승인 상태로 변경해주어 일반 사용자가 열람할 수 있도록 해줌.

- 신고
  - 악성유저, 글, 댓글, 리뷰등을 신고하는 용도 신고하게되면 신고 테이블에 데이터 저장.

- 신고 리스트
  - 신고 테이블에 데이터가 존재할 경우 조회.  

- 신고 반영
  - 리스트에서 신고내용과 해당 게시글의 문제를 확인후 관리자가 처리. 신고 처리시 해당 게시글이 일반 사용자에게 조회되지 않도록 설정.

- 작가 승인 대기자 리스트
  - 작가 승인대기 상태인 User 목록과 승인 대기 상태로 변경된 일자 조회

- 작가 권한 승인
  - 작가 승인대기 상태 인 사용자를 공식 작가로 변경

### 메인 배너
- 메인 홈페이지에 표시될 전시 배너 및 전시 방문 내용을 공유하는 아트그램 배너 조회. 아래와 같은 순으로 조회 가능.
  - 한국 시간 기준 현재 전시중인 전시 중 작성 시간 순 개인 전시 목록
  - 한국 시간 기준 현재 전시중인 전시 중 좋아요 순 전시 목록
  - 한국 시간 기준 현재 전시중인 전시회 중 작성 시간 순 전시 목록
  - 한국 시간 기준 예정된 전시회 중 가장 가까운 날짜 순 전시 목록
  - 한국 시간 기준 일주일간 작성된 아트그램 중 좋아요 순 아트그램 목록

### 전시
- 전시 리스트
  - 전시회 위치(시군구), 전시 카테고리, 전시 태그, 검색 기능으로 전시 목록 조회 가능
- 전시
  - 오프라인/온라인 전시 및 개인전 전시 등록 가능. 전시회 작품 미리보기 사진의 경우 10개까지 저장 가능. 관리자의 승인 이후 목록에 표시됨.
  - 수정한 전시의 경우 상태코드가 수정된 전시로 변경됨. 관리자가 확인 가능하도록 페이지 구성중.  
  - 해당 전시에 좋아요 및 스크립, 리뷰 작성 및 평점 등록 가능

### 메시지
- 메시지 페이지에서 사용자 검색 후 선택된 상대방과의 채팅방이 생성됨. 해당 채팅방에서 실시간으로 대화 가능(Socket.io 이용) 향후 메시지 내용을 양방향 암호화 설정 필요.

---
## 🧐 트러블 슈팅
**[BE] 전체 트러블슈팅**
<details> 
<summary>Sequelize 트랜잭션 문제</summary>

- ### 문제
  - Sequelize는 기본적으로 자동 커밋 모드로 동작합니다. 등록/수정/삭제 비즈니스 로직에서 여러 쿼리를 수행하게 되는데, 중간에 에러 발생 시 쿼리 결과가 롤백이 되지 않아, 데이터의 일관성에서 문제가 발생합니다.
- ### 해결
  - 3계층 구조를 사용하므로, 여러 데이터 엑세스 메서드를 호출하는 비즈니스 로직단에서 트랜잭션을 직접 처리하도록 변경했습니다. 데이터 엑세스 계층에서 해당 트랜잭션을 인자로 넘겨 받아 sequelize 쿼리 수행 시 트랜잭션으로 넘겨주었습니다.
    ```js
    createExhibition = async (mode, userEmail, exhibitionReq) => {
    let updateInfo = {};
    const t = await sequelize.transaction();

    
    try {
      // 전시회 생성 데이터 엑세스 계층 호출하여 create, update 수행
      const updateExhibitionItem = await this.exhibitionRepository.updateExhibition(
        mode,
        userEmail,
        exhibitionObj,
        { transaction: t }
      );

      if (artImage.length > 0) {
        // 이미지
        const writeImageStatus =
          await this.exhibitionRepository.updateExhibitionImg(
            mode,
            updateExhibitionItem.exhibitionId,
            delImage,
            artImage,
            { transaction: t }
          );

        // 이미지 수정 정보
        updateInfo.imgUpdate = writeImageStatus;
      }

      await t.commit();
      return updateInfo;
    } catch (error) {
      await t.rollback();
      throw error;
    }
    };
    ```
</details>
<br>

**[BE] 임건**
<details> 
<summary>메시지 기능 HTTPS 적용 후 소켓 통신 불가</summary>

- ### 문제
  - 클라이언트에서 기존 HTTP 프로토콜을 사용한 웹소캣 방식에서 HTTPS 적용 시 웹소켓 커넥션이 이뤄지지 않는 문제 발생.
- ### 해결
  - 다음과 같이 Nginx서버의 default파일을 수정. Upgrade와 Connection 헤더를 추가하여 HTTPS프로토콜에서도 웹소켓 요청을 지원하도록 설정하였습니다.
    ```shell
    location /socket.io/ {
        proxy_pass server_url;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
    }
    ```
</details>
<br>

**[BE] 문서아**
<details> 
<summary>passport 전략 실행 후  콜백 라우터에서 프론트도메인으로 redirect 시 쿠키값 안담기는 현상</summary>

- ### 문제
  - 클라이언트에서 기존 HTTP 프로토콜을 사용한 웹소캣 방식에서 HTTPS 적용 시 웹소켓 커넥션이 이뤄지지 않는 문제 발생.
- ### 해결방안
  - 쿼리스트링에 토큰값을 담아 프론트에 보낸다. 쿼리스트링으로 보내면 보안관련한 이슈가 있을 수 있지만 레디스에 토큰값을 임시저장하고 token_key만 쿼리스트링으로 보낸다면 극복가능하다 판단
  - http-proxy-middleware로 프록시를 설정해서 cors 정책을 우회
- ### 2번 선택 이유
  - 쿼리스트링으로 토큰값을 보내면 보안상 안전하지 못할 수 있고 http-proxy-middleware를 사용하는것이 수월할 수 있다는 기술매니저님의 조언
  - 프론트는 버셀에서 자동배포와 ssl 인증을 적용할 예정이었기 때문에 최대한 프론트는 계획한 예정대로 진행되게 하고 싶었음
  - 프록시를 설정해서 cors 정책을 우회하면 프론트에서 추가적으로 쿼리스트링값을 처리해야할 필요가 없어서 프론트 작업량이 줄 것이라 생각
- ### 2번 선택
  ```js
  controllers/user.controller.js

  /**
    * Strategy 성공시
    */
    socialCallback = async (req, res, next) => {
      try {
      const email = req.user.userEmail
      const token = await this.userService.generateToken(email);

      res
        .cookie("access_token", token)
        .redirect(301, `https://museoh.shop/`);
      } catch (error){
      logger.error(error.message);
      next(error);
      }
    };
  ```
  ```js
  app.js

  // frontend proxy
  app.use(
    "/",
    createProxyMiddleware({
      target: '프론트배포주소',
      changeOrigin: true,
    })
  );
  ```
- ### 추후 추가적으로 발생한 문제
  - 프록시 설정 후 /exhibition, /mypage, /artgram처럼 백엔드 api uri와 프론트엔드 주소가 겹칠 경우 새로고침 시 json값이 보이는 상황 발생
- ### 해결
  - 백엔드 api uri 앞에 /api를 추가하여 겹치지 않게 설정함
  
</details>
<br>

**[BE] 김다빈**
<details> 
<summary>환경변수로 인한 에러해결</summary>

- ### 고민
  - jest연결 시도중 환경변수 적용안되는 에러발생.
- ### 접근
  1. config에 use_env_variable을 작성해줌
  2. 환경변수를 컴퓨터설정에서 직접적으로 설정해줌
  3. config를 참조하지 못해서 models의 index에서 조건문을 설정해줌
  4. config의 dialect가 연결되어있지않다는 에러가 발생해 위처럼 조건문을 작성해줌
- ### 해결
  - 3번과 4번을 통해 문제해결이 되었다.
- ### 배운점
  - 처음으로 환경변수에 대한 에러가 발생해서 많은 자료들을 찾아봤고 공부할 수 있었다.

</details>
<details> 
<summary>협업</summary>

- ### 고민
  - 실전프로젝트에 들어오기 전에도 작은 프로젝트를 두번정도 진행하고 api명세서를 작성했었지만 매번 진행도중 백엔드에서 명세서가 업데이트되지않아서 에러가 발생하는 경우가 잦았다.
- ### 접근
  더 나은 방향으로 가기위해 소통을 하는것은 좋지만 가벼운 실수로 인한 에러로 자주 소통을 하는것은 좋지 않다고 판단했다.
- ### 해결
  - 이번 프로젝트에는 간단하게 api를 만들고 바로 스웨거를 도입하였다.
- ### 배운점
  - 스웨거를 도입한 뒤엔 직관적인 소통이 이루어질 수 있도록 하여 효율적인 작업을 진행할 수 있었다.

</details>
