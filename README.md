# ALLREVIEW
![ALLREVIEW 메인 로고 이미지](https://user-images.githubusercontent.com/89020079/232500769-a2f07a20-28c4-43c5-990f-9dd538c96228.png)

- [1.프로젝트 소개](#프로젝트-소개)
  - [1-1.프로젝트 기간](#프로젝트-기간)
  - [1-2.개발 인원](#개발-인원)
  - [1-3.협업 툴 및 개발환경](#개발-환경)
- [2.담당 기능](#담당-기능)
  - [2-1.기획](#기획)
  - [2-2.디자인](#디자인)
  - [2-3.개발](#개발)
- [3.기능 소개](#기능-소개)
  - [3-1.로그인 및 회원가입](#로그인-및-회원가입)
    - [3-1-1.로그인](#로그인)
    - [3-1-2.회원가입](#회원가입)
  - [3-2.메인페이지](#메인페이지)
  - [3-3.게시글 작성페이지](#게시글-작성페이지)
  - [3-4.임시저장 리스트 페이지](#임시저장-리스트-페이지)
  - [3-5.상세페이지](#상세페이지)
  - [3-6.검색](#검색)
  - [3-7.채널 페이지](#채널-페이지)
  - [3-8.개인 정보 수정 페이지](#개인-정보-수정-페이지)
  - [3-9.비밀번호 찾기](#비밀번호-찾기)
  - [3-10.좋아요 목록](#좋아요-목록)


## 😎프로젝트 소개
- [ALLREVIEW로 이동](http://43.202.40.32:3000/)
- 분야 상관없이 카테고리로 분류하여 리뷰를 올리고, 댓글과 대댓글로 소통할 수 있는 리뷰 전용 사이트
- 회고록 : <a href="https://velog.io/@dacircle/4%EC%B0%A8-ALLREVIEW-%EB%AF%B8%EB%8B%88-%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8-%ED%9A%8C%EA%B3%A0" target="_blank">4차 ALLREVIEW 미니 프로젝트 회고</a>
### 프로젝트 기간
- 1차 : 2023.01.09 ~ 2023.04.13 (실 개발 약 2개월 2주)
- 2차 추가 기능 개발 : ~ 2023.6.16
- **리팩토링 : 2023.11 ~ 현재(Redux, Tailwind CSS)**

### 개발 인원
- Front-end : 1명 (<a href="https://github.com/DawonOh" target="_blank">DawonOh</a>)
- Back-end : 1명 (<a href="https://github.com/inchanS" target="_blank">inchanS (Song Inchan)</a>)

### 개발 환경
- OS : Windows, Ubuntu
- 언어 및 라이브러리 : HTML, CSS, TypeScript, Styled-Components, React.js
- 개발 툴 : Visual Studio Code
- 디자인 툴 : Figma
- 형상관리 : Git/Github
- 문서관리 : Notion
- 협업 : Slack


## ⛏담당 기능
### 기획
- 와이어프레임 제작
- 기획문서 제작

### 디자인
- 전체 디자인
  - 반응형 레이아웃

### 개발
(1차 개발)
- 회원관리
  - 로그인
  - 회원가입
    
- 메인페이지
  - 무한스크롤
  - 카테고리 필터링

- 상세페이지
  - 게시글 상세 정보
  - 댓글 / 대댓글(답글)

- 게시글 작성
  - 파일 업로드
  - 파일 미리보기
  - 수동 / 자동 임시저장

- 임시저장 리스트
  - 임시저장 된 글 목록
  - 임시저장 게시글 삭제 가능
  - 리스트에서 게시글 클릭 시 수정 가능

- 검색
  - 페이지 상단 Header 검색창 입력 시 실시간 검색 내용 모달창
  - 검색페이지

- 반응형 웹
  - 1024px, 767px 기준
  - 767px 이하일 경우 모바일 레이아웃으로 반응형 웹 구현
  - 모바일 메뉴
    - 검색 / 리뷰쓰기 / 임시저장 목록

(2차 추가 기능)
- 채널
  - 해당 사용자의 작성한 리뷰, 댓글 조회
  - 본인 채널 : 댓글 관리(삭제)
  - 페이지네이션, 무한스크롤

- 개인 정보 수정
  - 닉네임, 이메일, 비밀번호 수정
  - 탈퇴

- 비밀번호 찾기
  - 이메일 전송을 통한 비밀번호 재설정
 
- 좋아요 목록
  - 좋아요 목록 조회

# ✔기능 소개
## 로그인 및 회원가입
### 로그인
- 코드 위치 : src/Components/Login/index.tsx
- 이메일, 비밀번호를 받습니다.
![로그인 페이지 이미지](https://user-images.githubusercontent.com/89020079/232508348-3a5c281a-f829-4e7a-8e1c-41be85eae0c5.png)

### 회원가입
- 코드 위치 : src/pages/Join/index.tsx
- 이메일, 이름, 비밀번호, 닉네임을 받습니다.
- 이메일, 닉네임은 중복확인을 진행합니다.
![회원가입 페이지 이미지](https://user-images.githubusercontent.com/89020079/232508367-5eb8273a-1004-4f01-a6d6-52498c3c567f.png)

## 메인페이지
- 코드 위치
  - 헤더 : src/Components/Header/index.tsx
  - 카드 : src/Components/Card/index.tsx
  - 카드리스트 : src/Components/CardList/index.tsx
  - 무한스크롤 : src/hooks/useCardList.tsx
  - 페이지 : src/pages/Main/index.tsx
  - 모바일메뉴 : src/Components/MobileMenu/index.tsx
- 게시글이 없는 경우
![메인페이지 게시글 없을 때 이미지](https://user-images.githubusercontent.com/89020079/232508622-049ce5a5-b535-412c-8625-8d68ea5aa1a5.png)
![mobileMenu](https://user-images.githubusercontent.com/89020079/232509751-702a6750-4638-4a60-93df-0798c2a1e56e.gif)

- 게시글이 있는 경우
  - 무한스크롤
![infiniteScroll](https://user-images.githubusercontent.com/89020079/232509315-656ce817-3f4b-496c-a4f4-43e11310bcbe.gif)

- 첨부파일 있는 게시글
  - 카드 오른쪽 상단에 클립 아이콘이 나타납니다.
![첨부파일 있는 게시글 이미지](https://user-images.githubusercontent.com/89020079/232509463-74786d62-c937-4817-9997-9b90b28f8b5f.png)

- 카테고리 필터링
  - 카테고리 별로 게시물을 조회할 수 있습니다.
![categoryFilter](https://user-images.githubusercontent.com/89020079/232509910-f6a64df2-f6ba-424f-b864-0578d54c4a39.gif)

## 게시글 작성페이지
- 코드 위치
  - 게시물 작성 : src/Components/WriteFeed/index.tsx
  - 페이지 : src/pages/Write/index.tsx
- 파일 업로드 1회 당 최대 5개까지 업로드할 수 있습니다.(최대 파일 갯수 제한 없음)
  - 이미지 확장자 제한 : jpg, jpeg, png, gif
- 파일 미리보기가 가능합니다.
  - 미리보기 목록에서 파일 클릭 시 삭제할 수 있습니다.
- 임시저장
  - 자동 : 1분마다 자동 임시저장을 진행합니다.
  - 수동 : 페이지 하단 임시저장 버튼으로 직접 임시저장이 가능합니다.
  - 게시글 작성에서만 임시저장이 작동합니다.
![게시글 작성 페이지 이미지](https://user-images.githubusercontent.com/89020079/232510179-64de82c5-f7e4-431d-8672-01d4fd521094.png)

## 임시저장 리스트 페이지
- 코드 위치 : src/pages/TempList/index.tsx
- 임시저장 된 글 목록을 조회합니다.
- 임시저장 게시글을 삭제할 수 있습니다.
- 리스트에서 게시글 클릭 시 수정할 수 있습니다.
![임시저장 리스트 페이지 이미지](https://user-images.githubusercontent.com/89020079/232510301-a42326b7-6bf6-4044-a43d-37154358c86b.png)

## 상세페이지
- 코드 위치
  - 게시물 상세 : src/Components/FeedDetail/index.tsx
  - 페이지 : src/pages/Feed/index.tsx
- 좋아요 / 제목 / 내용 / 이미지 / 첨부파일 / 조회수 / 작성자 닉네임을 보여줍니다.
  - 좋아요 기능 : 로그인이 되어있고, 다른 사람의 게시글만 좋아요를 누를 수 있습니다.
- 로그인 한 사용자 본인 게시글은 수정 / 삭제 버튼이 나타납니다.
![상세페이지 상단 이미지](https://user-images.githubusercontent.com/89020079/232510394-93ed31ab-3453-4482-bcbb-4dc8b043b5d2.png)

- 댓글
  - 코드 위치
    - 댓글 전체 영역 : src/Components/CommentContainer/index.tsx
    - 댓글 : src/Components/MainComment/index.tsx
    - 댓글 + 대댓글 + 댓글 입력창 (한 댓글에 여러개의 대댓글과 답글 입력창을 묶은 묶음입니다.) : src/Components/CommentList/index.tsx
    - 댓글 입력창 : src/Components/CommentTextarea/index.tsx
  - 작성 / 수정 / 삭제가 가능합니다.
  - 대댓글을 달 수 있습니다.
  - 댓글 작성 / 수정 시 자물쇠 버튼을 클릭하면 비밀댓글을 달 수 있습니다.
![상세페이지 하단 이미지](https://user-images.githubusercontent.com/89020079/232510455-be679a3d-39f8-4f23-8b6f-c81f64211750.png)

## 검색
- 코드 위치 : src/pages/Search/index.tsx
- 모든 페이지 상단의 검색창에서 실시간 검색이 가능합니다.
- 검색 시 모달창에 뜬 결과를 클릭하면 해당 게시물로 이동합니다.
- 모달창의 '더보기' 버튼을 클릭하거나 엔터키를 누르면 검색페이지로 이동합니다.
- 모바일 창에서는 모바일 메뉴에서 '검색'을 선택하면 검색 페이지로 이동합니다.
- 검색페이지에서 검색창을 통해 검색 결과를 카드 리스트로 확인할 수 있습니다.
![search](https://user-images.githubusercontent.com/89020079/232510575-11f2278f-dde2-43ad-b9a6-96d8657e840d.gif)

## 채널 페이지
- 코드 위치
  - 작성한 리뷰 : src/Components/MyFeeds/index.tsx
  - 작성한 댓글 : src/Components/MyComments/index.tsx
  - 페이지 : src/pages/MyPage/index.tsx
- 내 정보 / 작성한 리뷰 / 작성한 댓글을 조회할 수 있습니다.
  - 작성한 리뷰
    - 페이지네이션
    - 리뷰 클릭 시 해당 게시물로 이동합니다.
  - 작성한 댓글
    - 무한스크롤
    - 해당 페이지에서 바로 댓글을 삭제할 수 있습니다.
  - 상세페이지에서 작성자 닉네임 클릭 시 해당 작성자의 채널 페이지로 이동합니다.
    - 본인 채널이 아닌 경우 : 이메일, 정보 수정버튼, 댓글 삭제 버튼이 없습니다.
![내 채널 페이지 - 작성한 리뷰](https://github.com/DawonOh/review-board/assets/89020079/1055d308-7361-40f1-9ba8-c46310ec940c)
![내 채널 페이지 - 작성한 댓글](https://github.com/DawonOh/review-board/assets/89020079/3994ef7b-f877-4a92-a769-a4413a6b5a8b)

## 개인 정보 수정 페이지
- 코드 위치 : src/pages/ModifyInfo/index.tsx
- 채널 페이지에서 수정하기 버튼을 통해 개인 정보 페이지로 이동합니다.
  - 닉네임과 이메일을 수정할 수 있습니다.
![개인정보 수정 페이지](https://github.com/DawonOh/review-board/assets/89020079/75909d7c-e2de-40b1-80bb-f5719910171f)

- 비밀번호 수정은 현재 비밀번호가 확인되어야 수정할 수 있습니다.
- 코드 위치
  - 현재 비밀번호 확인 : src/Components/CheckPassword/index.tsx
  - 비밀번호 수정 : src/pages/ModifyPw/index.tsx
![비밀번호 수정 페이지 - 현재 비밀번호 확인](https://github.com/DawonOh/review-board/assets/89020079/6031608a-2257-4aa1-b231-0539215fe596)
  - 새 비밀번호와 새 비밀번호 확인 값을 입력받습니다.
  ![비밀번호 수정 페이지](https://github.com/DawonOh/review-board/assets/89020079/dabec2e0-3dbf-41e8-89ce-1188ecfdb37e)

- 탈퇴 시 역시 현재 비밀번호를 입력받고, 확인이 되면 탈퇴 과정이 진행됩니다.
- 코드 위치
  - 알림창 : src/Components/AlertModal/index.tsx
  - 탈퇴 페이지 : src/pages/Quit/index.tsx
![탈퇴 페이지](https://github.com/DawonOh/review-board/assets/89020079/c34455ad-b468-49a2-85f1-2f9c3a75a68c)

## 비밀번호 찾기
- 코드 위치 : src/pages/FindPw/index.tsx
- 로그인 화면에서 비밀번호 찾기 페이지로 이동할 수 있습니다.<br/>
![로그인 화면](https://github.com/DawonOh/review-board/assets/89020079/0643ef60-1a5e-4f89-93b0-427b5a95976f)

- 가입한 이메일을 입력하면 해당 메일로 비밀번호 재설정 링크를 전송합니다.
![이메일 찾기 gif](https://github.com/DawonOh/review-board/assets/89020079/a5b8142d-3522-4e81-8419-a17533feed9e)
![받은 메일 화면](https://github.com/DawonOh/review-board/assets/89020079/69fad145-37b2-4449-a1ee-59696fd6a9b8)

- 해당 링크로 접속해 비밀번호를 재설정할 수 있습니다.
![비밀번호 재설정 화면](https://github.com/DawonOh/review-board/assets/89020079/cf8bec9f-3b89-4f59-8eba-31dca8a745a4)

## 좋아요 목록
- 코드 위치 : src/pages/LikeList/index.tsx
- 헤더 메뉴에서 좋아요 목록 페이지로 이동할 수 있습니다.
![헤더 메뉴](https://github.com/DawonOh/review-board/assets/89020079/9a93feef-bf09-4078-b4c7-ca4a0d995c3c)

- 좋아요를 누른 게시물의 목록을 확인할 수 있으며, 페이지네이션을 제공합니다.
![좋아요 목록 페이지](https://github.com/DawonOh/review-board/assets/89020079/dd931a5b-aa1b-495a-bc62-897dbc825499)
