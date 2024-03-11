# ALLREVIEW
![ALLREVIEW 메인 로고 이미지](https://user-images.githubusercontent.com/89020079/232500769-a2f07a20-28c4-43c5-990f-9dd538c96228.png)
분야 상관없이 카테고리로 분류하여 리뷰를 올리고, 댓글과 대댓글로 소통할 수 있는 리뷰 전용 사이트<br />
**DEMO**
https://all-review.site/

- styled-components 사용한 코드는 <a href='https://github.com/DawonOh/review-board/tree/ver.styled-components'>ver.styled-components</a> 브랜치에서 확인할 수 있습니다.<br />(프론트엔드, 백엔드 리팩토링 전 코드입니다.)

[1.프로젝트 소개](#프로젝트-소개)<br />
[2.페이지 구성](#페이지-구성)<br />
[3.기능 소개](#기능-소개)

## 프로젝트 소개

### 프로젝트 기간
- 1차 : 2023.01.09 ~ 2023.04.13 (실 개발 약 2개월 2주)
- 2차 추가 기능 개발 : ~ 2023.6.16
- **리팩토링 : 2023.11 ~ 2021.02**

### 개발 인원
|<img src="https://github.com/DawonOh/review-board/assets/89020079/a388da55-4bbd-4b29-8fbe-976864363b31" width="80">|<img src="https://github.com/DawonOh/review-board/assets/89020079/54e900e9-7b8c-4493-be21-66ea5d58ff6c" width="80">|
|---|---|
|[DawonOh](https://github.com/DawonOh)|[inchanS](https://github.com/inchanS)|
|Front-end|Back-end|
- 백엔드 레포지토리 : https://github.com/inchanS/project-review-ts

### 개발 환경
- OS : <img src="https://img.shields.io/badge/Windows10-0078D4?style=for-the-badge&logo=windows10&logoColor=white"> <img src="https://img.shields.io/badge/ubuntu(WSL2)-E95420?style=for-the-badge&logo=ubuntu&logoColor=white">
- 언어 및 라이브러리 : <img src="https://img.shields.io/badge/typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=white"> <img src="https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=white"> <img src="https://img.shields.io/badge/tailwind css-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white"> <img src="https://img.shields.io/badge/redux-764ABC?style=for-the-badge&logo=redux&logoColor=white"> <img src="https://img.shields.io/badge/react query-FF4154?style=for-the-badge&logo=reactquery&logoColor=white">
- 배포 : <img src="https://img.shields.io/badge/aws s3-569A31?style=for-the-badge&logo=amazons3&logoColor=white"> <img src="https://img.shields.io/badge/aws route 53-8C4FFF?style=for-the-badge&logo=amazonroute53&logoColor=white"> <img src="https://img.shields.io/badge/aws cloudfront-7A49D7?style=for-the-badge&logo=amazonaws&logoColor=white">
- 개발 툴 : <img src="https://img.shields.io/badge/visual studio code-007ACC?style=for-the-badge&logo=visualstudiocode&logoColor=white">
- 디자인 툴 : <img src="https://img.shields.io/badge/figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white">
- 형상관리 : <img src="https://img.shields.io/badge/git-F05032?style=for-the-badge&logo=git&logoColor=white"> <img src="https://img.shields.io/badge/github-181717?style=for-the-badge&logo=github&logoColor=white">
- 문서관리 : <img src="https://img.shields.io/badge/notion-000000?style=for-the-badge&logo=notion&logoColor=white">
- 협업 : <img src="https://img.shields.io/badge/slack-4A154B?style=for-the-badge&logo=slack&logoColor=white">

## 페이지 구성
|메인 페이지|로그인|
|:---:|:---:|
|<img src="https://github.com/DawonOh/review-board/assets/89020079/19e1d6ed-6ca9-4fd2-8595-e82560386653" width="600">|<img src="https://github.com/DawonOh/review-board/assets/89020079/1cba0f20-0883-401c-af04-00f7b68b9e9e" width="600">|

|상세페이지|게시글 작성 페이지|
|:---:|:---:|
|<img src="https://github.com/DawonOh/review-board/assets/89020079/de8a4f2b-a0f4-4efe-b096-87741d6752d5" width="600">|<img src="https://github.com/DawonOh/review-board/assets/89020079/7a64291e-c153-48e9-bd8b-b6183ce9c3d2" width="600">|

|임시저장 리스트|좋아요 목록|
|:---:|:---:|
|<img src="https://github.com/DawonOh/review-board/assets/89020079/9b9fbfc5-8550-4bbb-82a1-5e5c0d009131" width="600">|<img src="https://github.com/DawonOh/review-board/assets/89020079/7730800b-ad93-4638-9ed8-d98acb02cc3a" width="600">|

|검색|채널|
|:---:|:---:|
|<img src="https://github.com/DawonOh/review-board/assets/89020079/687fa07b-3b56-49ab-85df-7d40660fb274" width="600">|<img src="https://github.com/DawonOh/review-board/assets/89020079/d885f4d3-6745-44d8-be15-8821c2c007bc" width="600">|

## 기능 소개
- 회원관리
  - 로그인 (src/pages/Login/index.tsx)
  - 회원가입 (src/pages/Join/index.tsx)
    
- 메인페이지 (src/pages/Main/index.tsx)
  - 무한스크롤
  - 카테고리 필터링 (무한스크롤과 동일)

- 상세페이지 (src/pages/Feed/index.tsx)
  - 게시글 상세 정보
  - 댓글 / 대댓글(답글)

- 게시글 작성 (src/Components/FeedCRUD)
  - 파일 업로드
  - 파일 미리보기
  - 수동 / 자동 임시저장

- 임시저장 리스트 (src/pages/TempList/index.tsx)
  - 임시저장 된 글 목록
  - 임시저장 게시글 삭제 가능
  - 리스트에서 게시글 클릭 시 수정 가능

- 검색
  - 페이지 상단 Header 검색창 입력 시 실시간 검색 내용 모달창(src/Components/Header/index.tsx)
  - 검색페이지 (src/pages/Search/index.tsx)

- 반응형 웹
  - 1024px, 767px 기준
  - 767px 이하일 경우 모바일 레이아웃으로 반응형 웹 구현
  - 모바일 메뉴
    - 검색 / 임시저장 목록 / 좋아요 목록 / 마이페이지 / 로그인, 로그아웃

- 채널 (src/pages/MyPage/index.tsx)
  - 해당 사용자의 작성한 리뷰, 댓글 조회
  - 본인 채널 : 댓글 관리(삭제)
  - 페이지네이션, 무한스크롤

- 개인 정보 수정
  - 닉네임, 이메일 수정 (src/pages/ModifyInfo/index.tsx)
  - 비밀번호 수정 (src/pages/ModifyPw/index.tsx)
  - 탈퇴 (src/pages/Quit/index.tsx)

- 현재 비밀번호 확인 (src/Components/CheckPassword/index.tsx)
  - 비밀번호 수정, 탈퇴 시 현재 비밀번호 확인

- 비밀번호 찾기 (src/pages/FindPw/index.tsx)
  - 이메일 전송을 통한 비밀번호 재설정
 
- 좋아요 목록 (src/pages/LikeList/index.tsx)
  - 좋아요 목록 조회
