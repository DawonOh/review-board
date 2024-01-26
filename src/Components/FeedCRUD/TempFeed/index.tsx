import axios from 'axios';
import { useState } from 'react';

interface SaveResultType {
  message: string;
  result: {
    id: number;
    created_at: string;
    updated_at: string;
    user: {
      id: number;
      created_at: string;
      updated_at: string;
      deleted_at: string;
      nickname: string;
      email: string;
    };
    title: string;
    content: string;
    category: number;
    posted_at: string;
    feedSymbol: [];
    uploadFiles: [
      [
        {
          id: 1;
          created_at: string;
          updated_at: string;
          deleted_at: string;
          is_img: boolean;
          file_link: string;
        }
      ]
    ];
  };
}

const TempFeed = () => {
  // 임시저장 성공 여부
  const [isSaveSuccess, setIsSaveSuccess] = useState(false);

  // 저장 알림 메세지
  const [saveMessage, setSaveMessage] = useState('');

  // 임시저장 두 번째 저장 이후부터 필요한 게시물id
  const [feedId, setFeedId] = useState<string | null>('0');

  const BACK_URL = process.env.REACT_APP_BACK_URL;

  let token = sessionStorage.getItem('token');

  // 임시저장 POST
  // const saveFeedPost = (
  //   titleValue: string,
  //   contentValue: string,
  //   selectCategory: number | undefined
  // ) => {
  //   axios
  //     .post<SaveResultType>(
  //       `${BACK_URL}/feeds/temp`,
  //       {
  //         title: titleValue,
  //         content: contentValue,
  //         estimation: selectedLike,
  //         category: selectCategory,
  //         // fileLinks: fileLink,
  //       },
  //       {
  //         timeout: 5000,
  //         headers: { Accept: `application/json`, Authorization: token },
  //       }
  //     )
  //     .then(response => {
  //       setIsFirstSave(false);
  //       setIsSaveSuccess(true);
  //       saveAlertMessage();
  //       setFeedId(response.data.result.id.toString());
  //       return;
  //     })
  //     .catch(error => {
  //       setIsSaveSuccess(false);
  //       saveAlertMessage();
  //     });
  // };

  // 임시저장 PATCH
  // const saveFeedPatch = (
  //   titleValue: string,
  //   contentValue: string,
  //   selectCategory: number | undefined
  // ) => {
  //   axios
  //     .patch<SaveResultType>(
  //       `${BACK_URL}/feeds/temp`,
  //       {
  //         feedId: feedId,
  //         title: titleValue,
  //         content: contentValue,
  //         estimation: selectedLike,
  //         category: selectCategory,
  //         // fileLinks: fileLink,
  //       },
  //       {
  //         timeout: 5000,
  //         headers: { Accept: `application/json`, Authorization: token },
  //       }
  //     )
  //     .then(response => {
  //       setIsFirstSave(false);
  //       setIsSaveSuccess(true);
  //       saveAlertMessage();
  //       return;
  //     })
  //     .catch(error => {
  //       setIsFirstSave(false);
  //       setIsSaveSuccess(false);
  //       saveAlertMessage();
  //     });
  // };

  // 임시저장(saveFeed)
  // const saveFeed = (
  //   inputValueRef: HTMLInputElement | null,
  //   textareaValueRef: HTMLTextAreaElement | null,
  //   selectValueRef: HTMLLIElement | null
  // ) => {
  //   // 제목, 내용 공백 아닌지 확인하고 값 가져오기 + 카테고리 선택값
  //   const titleValue = inputValueRef?.value.trim();
  //   const contentValue = textareaValueRef?.value.trim();
  //   const selectCategory = selectValueRef?.value;

  //   // 3가지 중에 하나라도 없다면 임시저장 메세지 띄우기
  //   if (!titleValue || !contentValue || selectCategory === 0) {
  //     saveAlertMessage();
  //     return;
  //   }

  //   // 3가지 다 있고 수정이 아니라 게시글 작성이라면? (+임시저장 글 발행)
  //   if (
  //     titleValue &&
  //     contentValue &&
  //     isFirstSave &&
  //     selectCategory !== 0 &&
  //     modifyId === '0'
  //   ) {
  //     // 글 POST 임시저장 실행
  //     saveFeedPost(titleValue, contentValue, selectCategory);
  //     return;
  //   }

  //   // 3가지 다 있고 게시글 수정이라면?
  //   if (
  //     titleValue &&
  //     contentValue &&
  //     isFirstSave === false &&
  //     selectCategory !== 0
  //   ) {
  //     // 글 PATCH 임시저장 실행
  //     saveFeedPatch(titleValue, contentValue, selectCategory);
  //     return;
  //   }
  // };

  // 임시저장 1분마다 실행
  // useEffect(() => {
  //   if (mode === 'temp') {
  //     const showMessage = setInterval(() => {
  //       saveFeed(
  //         inputValueRef.current,
  //         textareaValueRef.current,
  //         selectRef.current
  //       );
  //     }, 60000);

  //     return () => clearInterval(showMessage);
  //   }
  // }, [isFirstSave, selectedLike]);

  // 임시저장 메세지 출력
  // const saveAlertMessage = () => {
  //   // 저장됐다 -> true로 해서 표시하고
  //   setIsSaved(true);

  //   // 3초 후에 -> false로 해서 닫기
  //   setTimeout(() => {
  //     setIsSaved(false);
  //   }, 3000);
  // };

  // 토스트 문구 알림 내용 설정
  // useEffect(() => {
  //   if (title.trim() === '' || content.trim() === '') {
  //     setSaveMessage('제목과 내용을 입력해주세요.');
  //     return;
  //   }
  //   if (categoryId === 0) {
  //     setSaveMessage('카테고리를 선택해주세요.');
  //     return;
  //   }
  //   if (isSaveSuccess === false) {
  //     setSaveMessage('임시저장에 실패했습니다.');
  //     return;
  //   }
  //   if (isSaveSuccess) {
  //     setSaveMessage('임시저장되었습니다.');
  //     return;
  //   }
  // }, [title, content, isSaveSuccess, categoryId]);

  return (
    // <div
    //   className={`${isSaved ? 'visible' : 'invisible'} w-full ${
    //     isNotNull && isSaveSuccess && categoryId !== 0
    //       ? 'text-black bg-mainsky'
    //       : 'text-white bg-mainred'
    //   }  text-center py-2 ${saveAlertClass()}`}
    // >
    //   {saveMessage}
    // </div>
    <div></div>
  );
};

export default TempFeed;
