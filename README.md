[![Node.js CI](https://github.com/Muse-O/Backend/actions/workflows/release.yml/badge.svg)](https://github.com/Muse-O/Backend/actions/workflows/release.yml)
# 국내 전시 커뮤니티 - Muse-O

![MUSE-O브로셔](https://user-images.githubusercontent.com/51357635/236382171-b6eff0b3-c993-4243-876e-b8ac096f507b.png)
## 🏠 [Home Page](https://www.antsori.com)
---
## 🗂️ 목차

### 1. [프로젝트 소개](#-프로젝트-소개)

### 2. [팀 구성](#-팀-구성)

### 3. [기술 스텍](#-기술스택-why)

### 4. [라이브러리](#-라이브러리-why)

### 5. [주요 기능](#️-주요-기능)

### 6. [아키텍쳐](#-백엔드-아키텍처)

### 7. [트러블 슈팅](#트러블-슈팅)
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
    <td colspan='2'></td>
    </tr>
</table>

---
## 🛠 기술스택 ([WHY?](https://spark-stove-6bf.notion.site/cf6de263fec844ba8c989b4c9a6dd32e))

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

## 📖 라이브러리 ([WHY?](https://spark-stove-6bf.notion.site/9064e96f94854aaca56925f80d978bdb))

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
<img src='https://img.shields.io/badge/cross--env-7.0.3-lightgrey'> | 운영체제 관계없이 환경변수설정
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
## 🕹️ 주요 기능

### 로그인 / 회원가입 - 서아님 정리
- 이메일 인증

- 카카오 / 네이버 / 구글 OAuth 인증 기반
### 마이페이지 / 알림 - 서아님 정리
- 내가 좋아요, 스크랩한 아트그램/전시 게시물을 좋아요와 스크랩한 순으로 그리고 작성한 게시글은 최신순으로 조회
- 프로필 사진, 닉네임, 소개글 수정 기능
- 작가 권한 신청 기능
- 알림목록 조회: 내가 작성한 아트그램에 좋아요 댓글이 작성될 시, 내가 작성한 아트그램 댓글에 답글이 달릴 시, 내가 작성한 전시 게시글에 후기가 작성될 시 알림 생성

  &rarr; 회원가입 시 id 별로 stream key 생성

  &rarr; 알림 저장 시 알림 받을 회원의 스트림에 생성시간 타임스탬프가 id인 엔트리를 추가하고 XREADGROUP 호출하여 consumer(알림받을 회원)에게 할당

  &rarr; 알림 조회시 XACK 처리하고 알림 목록 제공 시 XPENDING으로 읽지 않은 알림과 읽은 알림을 구분한 데이터를 제공


### 아트그램 - 다빈님 정리
- 아트그램 조회  

  &rarr; 아트그램사진, 작성한유저의 프로필이미지, 닉네임조회

  &rarr; 아트그램의 likeCount, scrapCount, imageCount(여러장일경우 이미지에 표시해줌) 조회

  &rarr; 현재 로그인한 유저의 like/scrap 유무확인

  &rarr; 오프셋기반 페이지네이션 구현. 무한스크롤 구현.

- 아트그램 상세 조회

  &rarr; 아트그램사진(여러장일 경우 슬라이더), 프로필이미지, 닉네임, 태그, 제목, 설명, 작성날짜 조회.

  &rarr; 아트그램id에 일치하는 댓글, 답글조회(있을경우엔 ---답글보기를 눌러서 조회가능).  
  해당 유저의 프로필이미지, 닉네임, 작성날짜조회(오늘기준으로 n일전으로 표기).

  &rarr; 댓글/답글 작성가능. 수정/삭제가능(삭제는 softDelete를 사용해 논리삭제해줌)

  &rarr; 현재 로그인한 유저의 아이디를 기준으로 아트그램의 like/scrap 유무확인.

- 아트그램 작성

  &rarr; 이미지 s3를 이용해서 1개 이상 최대 6장저장.

  &rarr; 전시제목, 설명작성가능. #을 이용해서 태그기능가능. 

### 검색 - 다빈님 정리  

- 검색시 전시, 아트그램, 유저별로 검색기록이 출력된다.  
카테고리 별 조회도 가능. 초성검색( 정규표현식이용 )가능.

- 전시 title, engtitle, desc 검색가능.  

  &rarr; 전시제목, 전시시작일, 지역 조회.

- 아트그램 title, desc 검색가능. 

  &rarr; 아트그램사진, 작성한 유저의 프로필사진,닉네임,현재유저의 like/scrap 유무 확인

- 유저 email, nickname 검색가능. 

- 모든 유저가 검색후 클릭한 게시글을 db에 저장하여 인기게시글로 10개 정렬해줌.

- 현재 로그인한 유저가 검색후 최근 본 게시글 기준으로 10개를 출력해줌

### 관리자페이지 - 서아,다빈님 정리
- 
### 메인 배너 - 임건 정리
- 
### 전시 - 임건 정리
- 
### 메시지 - 임건 정리
- 
---

## 🧱 백엔드 아키텍처
![Backend-Architecture](https://user-images.githubusercontent.com/51357635/236399953-4caefd53-2e73-40a9-9e71-4ea8b66273db.png)
## 🧱 API LIST
![API-FLOW](https://user-images.githubusercontent.com/51357635/236438491-decb96cd-0039-41d5-b25f-828c7151652d.png)
## 🧱 ERD LIST
![image](https://user-images.githubusercontent.com/51357635/236434831-869de97c-1620-486e-a59f-7aac8984b6ea.png)
[ERD 자세히 보러가기](https://www.erdcloud.com/d/ySuCsb3e7Bf3DmYp3)
