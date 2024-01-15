import React, { useEffect, useRef, useState } from 'react';
import ToggleImg from '../../../assets/images/toggleDown.png';
import QuestionMark from '../../../assets/images/question.png';
import FileIconImg from '../../../assets/images/clip.png';
import axios from 'axios';
import {
  Form,
  redirect,
  useLocation,
  useSearchParams,
  useSubmit,
} from 'react-router-dom';
import {
  CategoryType,
  EstimationType,
  sendFeed,
  sendFeedType,
} from 'util/feed-http';
import { useMutation } from '@tanstack/react-query';
import instance from 'api';
import { useAppDispatch } from 'hooks';
import { alertActions } from 'redux/slice/alert-slice';
import { queryClient } from 'util/feedDetail-http';

interface FileLinkType {
  file_links: string[];
}

interface PreviewType {
  id: number;
  url: string;
  name: string;
}

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

interface ModifyDataType {
  result: {
    category: { id: number; category: string };
    content: string;
    created_at: string;
    estimation: { estimation: string; id: number };
    id: number;
    posted_at: string;
    status: {
      id: number;
      is_status: string;
    };
    title: string;
    updated_at: string;
    uploadFiles: [
      {
        id: number;
        is_img: boolean;
        file_link: string;
        file_name: string;
        file_size: string;
      }
    ];
    length: number;
    user: {
      id: number;
      nickname: string;
    };
    viewCnt: number;
  };
}

export const WriteContainer = ({
  categoryList,
  estimationList,
}: {
  categoryList: CategoryType[];
  estimationList: EstimationType[];
}) => {
  // 카테고리 오픈 여부
  const [isToggleOpen, setIsToggleOpen] = useState(false);

  // 카테고리 이름
  const [categoryName, setCategoryName] = useState('카테고리 선택');

  // 카테고리 id
  const [categoryId, setCategoryId] = useState<number | undefined>(0);

  // 선택한 카테고리 표시를 위한 인덱스
  const [countIdx, setCountIdx] = useState(0);

  // 백에 전송할 파일 리스트
  const [mainFileList, setMainFileList] = useState<File[]>([]);

  // 미리보기를 위한 파일 리스트
  const [previewList, setPreviewList] = useState<PreviewType[]>([]);

  // 임시저장 저장 여부 메세지 출력을 위한 state (true이면 메세지 나타났다가 3초 후에 false로 바뀌면서 사라지는 듯..)
  const [isSaved, setIsSaved] = useState('none');

  // 좋아요 설명 모달창? 오픈 여부
  const [isQuestionOpen, setIsQuestionOpen] = useState(false);

  // 사용자에게서 입력받은 제목
  const [title, setTitle] = useState('');

  // 사용자가 입력하는 제목 길이
  const [titleLength, setTitleLength] = useState(0);

  // 사용자에게서 입력받은 내용
  const [content, setContent] = useState('');

  // 사용자가 입력하는 내용 길이
  const [contentLength, setContentLength] = useState(0);

  // 사용자가 선택한 좋아요 id
  const [selectedLike, setSelectedLike] = useState<number | undefined>(1);

  // 파일 업로드 로딩 여부 - 미리보기 창에 Loading... 표시
  const [isLoading, setIsLoading] = useState(true);

  // 업로드한 파일 사이즈 통과 여부
  const [isFileSizePass, setIsFileSizePass] = useState(true);

  // 업로드한 파일 개수 통과 여부
  const [isFileCountPass, setIsFileCountPass] = useState(true);

  // 처음 임시저장 -> POST / 그 다음부터 저장 -> PATCH
  const [isFirstSave, setIsFirstSave] = useState(true);

  // 미리보기를 위한 파일 링크 배열..이 아니라 백엔드에 임시저장때 보낼 파일들인가?
  const [fileLink, setFileLink] = useState<string[]>([]);

  // 임시저장 성공 여부
  const [isSaveSuccess, setIsSaveSuccess] = useState(false);

  // 저장 알림 메세지
  const [saveMessage, setSaveMessage] = useState('');

  // 임시저장 두 번째 저장 이후부터 필요한 게시물id
  const [feedId, setFeedId] = useState(0);

  // 입력받아야 하는 값이 빈값인지 확인 여부
  const [isNotNull, setIsNotNull] = useState(false);

  // 게시글 수정인지 게시글 작성인지 확인 여부
  const [modifyData, setModifyData] = useState<ModifyDataType>();

  const BACK_URL = process.env.REACT_APP_BACK_URL;

  const dispatch = useAppDispatch();

  const requestHeaders: HeadersInit = new Headers();
  requestHeaders.set('Content-Type', 'application/json');
  let location = useLocation();

  // 수정 시 전달받는 feedId
  let modifyId = location.state.feedId;

  // 수정인지 등록인지 구분
  let ifModifyFeed = location.state.isModify;
  const [searchParams, setSearchParams] = useSearchParams();
  let mode = searchParams.get('mode');

  // 임시저장 실행 여부
  let isTempFeed = location.state.isTemp;

  // 처음 렌더링 시 불러오는 데이터(카테고리, 좋아요, 수정할 feedId)
  useEffect(() => {
    // 게시글 수정이라면 수정할 데이터 불러오기
    if (modifyId !== 0) {
      axios
        .get<ModifyDataType>(`${BACK_URL}/feeds/${modifyId}`, {
          timeout: 5000,
          headers: { Accept: `application/json`, Authorization: token },
        })
        .then(response => {
          setModifyData(response.data);
          if (response.data.result.uploadFiles) {
            let uploadFilesLinks: string[] = [];
            let uploadPreviewFiles: PreviewType[] = [];
            response.data.result.uploadFiles.forEach(file => {
              uploadFilesLinks.push(file.file_link);
              let items: PreviewType = {
                id: file.id,
                url: file.file_link,
                name: file.file_name,
              };
              uploadPreviewFiles.push(items);
            });
            setFileLink(uploadFilesLinks);
            setPreviewList(uploadPreviewFiles);
          }
          setTitle(response.data.result.title);
          setContent(response.data.result.content);
          setTitleLength(response.data.result.title.length);
          setContentLength(response.data.result.content.length);
          setCategoryName(response.data.result.category.category);
          setCategoryId(response.data.result.category.id);
          setSelectedLike(response.data.result.estimation.id);
          setCountIdx(response.data.result.category.id);
        })
        .catch(() => {
          alert('데이터를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.');
        });
    }

    // 임시저장 게시글 수정이라면 두 번째 이후 임시저장이므로 isFirstSave를 false로 처리
    // 게시글 id === 수정 게시글 id
    if (isTempFeed && modifyId !== 0) {
      setIsFirstSave(false);
      setFeedId(modifyId);
    }
  }, []);

  // 제목 input, 내용 textarea, 선택한 카테고리 ref
  const inputValueRef = useRef<HTMLInputElement>(null);
  const textareaValueRef = useRef<HTMLTextAreaElement>(null);
  const selectRef = useRef<HTMLLIElement>(null);

  // 제목, 내용, 카테고리 값 가져오기
  const getTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitleLength(e.target.value.length);
    setTitle(e.target.value);
  };
  const getContent = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContentLength(e.target.value.length);
    setContent(e.target.value);
  };
  const handleSelectChange = (categoryId: number) => {
    setCategoryId(categoryId);
  };

  // 제목, 내용 여부에 따른 isNotNull값 설정
  useEffect(() => {
    // 제목, 내용 둘 다 있으면 notNull -> true
    if (title && content) {
      setIsNotNull(true);
      return;
    }

    // 제목 또는 내용이 빈 칸이라면 notNull -> false
    if (title === '' || content === '') {
      setIsNotNull(false);
      return;
    }
  }, [title, content]);

  // 카테고리 토글 열고 닫기
  const handleToggle = () => {
    setIsToggleOpen(!isToggleOpen);
  };

  // 선택한 카테고리 강조를 위한 인덱스 가져오기
  const handleClickIndex = (e: React.MouseEvent, idx: number) => {
    setCountIdx(idx);
  };

  // 파일 선택 input ref
  const input = useRef<HTMLInputElement>(null);

  // 파일 업로드를 위한 formData -> 여기에 파일 데이터 저장함
  const formData = new FormData();

  // input에서 파일 목록 가져오기
  const getFileList = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 파일 최대 사이즈
    const maxFileSize = 5 * 1024 * 1024;

    // 파일 최대 개수
    const maxFileCount = 5;

    // 여기서 왜 사이트랑 개수가 통과된건가
    setIsFileSizePass(true);
    setIsFileCountPass(true);

    // 파일이 있다면..
    if (e.target.files) {
      // files 배열 만들어
      let files: File[] = [...e.target?.files];

      // 통과된 파일은 여기에 넣기
      let passFiles: File[] = [];

      // 받아온 파일들 for문으로 돌면서
      for (let i = 0; i < files.length; i++) {
        // 파일 하나하나
        const file = files[i];

        // 파일 사이즈 초과 시 통과 못하고 if문 탈출인가 continue 뭐더라
        if (files[i].size > maxFileSize) {
          setIsFileSizePass(false);
          continue;
        }

        // if문에 안걸리면 file 배열에 파일 넣기
        passFiles.push(file);

        // 최대 개수 넘어가면 isFileCountPass -> false
        if (passFiles.length > maxFileCount) {
          setIsFileCountPass(false);
        }
      }

      // 백에 보낼 파일 목록 저장하기(mainFileList)
      // 처음부터 최대 파일 개수만큼 잘라서 넣기
      setMainFileList(passFiles.slice(0, maxFileCount));
    }
  };

  // 업로드 한 파일 제거(onclick)
  const deleteFile = (url: string, name: string) => {
    // 미리보기 리스트에서 클릭한 파일의 url과 다른 url을 가진 파일들만 다시 미리보기 리스트로 저장
    const result = previewList.filter(file => file.url !== url);
    setPreviewList(result);

    // 백에 보낼 파일은 mainFileList에서 클릭한 파일의 이름과 다른 이름을 가진 파일만 다시 mainFileList에 저장
    const mainFileListResult = mainFileList.filter(file => file.name !== name);
    setMainFileList(mainFileListResult);

    // =백에 보낼 파일 일 링크에서 클릭한 파일 url과 다른 링크를 가진 파일만 다시 파일 링크에 저장
    const fileLinkResult = fileLink.filter(file => file !== url);
    setFileLink(fileLinkResult);
  };

  const handleChange = (id: number) => {
    setSelectedLike(id);
  };

  let token = sessionStorage.getItem('token');

  const errorAlert = (content: string) => {
    dispatch(
      alertActions.setModal({
        isModalOpen: true,
        contents: content,
        isQuestion: false,
        alertPath: '',
      })
    );
  };

  // 파일 업로드
  useEffect(() => {
    // 백에 보낼 파일 리스트 하나하나를 formData에 넣기
    mainFileList.forEach(file => {
      formData.append('file', file);
    });

    // 백에 보낼 파일들(mainFileList)이 있다면?
    if (mainFileList.length !== 0) {
      // 파일 전송~
      instance
        .post<FileLinkType>(`/upload`, formData)
        .then(response => {
          setFileLink([...fileLink, ...response.data.file_links]);
          setIsLoading(false);
          let arr: PreviewType[] = [];
          for (let i = 0; i < response.data.file_links.length; i++) {
            const obj = {
              id: Math.floor(Math.random() * 100000),
              url: response.data.file_links[i],
              name: mainFileList[i].name,
            };
            arr.push(obj);
          }
          setPreviewList([...previewList, ...arr]);
          setMainFileList([]);
        })
        .catch(error => {
          errorAlert('이미지 업로드에 실패했습니다.다시 시도해주세요.');
          setMainFileList([]);
        });
    }
  }, [mainFileList, BACK_URL, fileLink, formData, previewList, token]);

  // 임시저장 메세지 출력
  const saveAlertMessage = () => {
    // 저장됐다 -> true로 해서 표시하고
    setIsSaved('true');

    // 3초 후에 -> false로 해서 닫기
    setTimeout(() => {
      setIsSaved('false');
    }, 3000);
  };

  // 임시저장 POST
  const saveFeedPost = (
    titleValue: string,
    contentValue: string,
    selectCategory: number | undefined
  ) => {
    axios
      .post<SaveResultType>(
        `${BACK_URL}/feeds/temp`,
        {
          title: titleValue,
          content: contentValue,
          estimation: selectedLike,
          category: selectCategory,
          fileLinks: fileLink,
        },
        {
          timeout: 5000,
          headers: { Accept: `application/json`, Authorization: token },
        }
      )
      .then(response => {
        setIsFirstSave(false);
        setIsSaveSuccess(true);
        saveAlertMessage();
        setFeedId(response.data.result.id);
        return;
      })
      .catch(error => {
        setIsSaveSuccess(false);
        saveAlertMessage();
      });
  };

  // 임시저장 PATCH
  const saveFeedPatch = (
    titleValue: string,
    contentValue: string,
    selectCategory: number | undefined
  ) => {
    axios
      .patch<SaveResultType>(
        `${BACK_URL}/feeds/temp`,
        {
          feedId: feedId,
          title: titleValue,
          content: contentValue,
          estimation: selectedLike,
          category: selectCategory,
          fileLinks: fileLink,
        },
        {
          timeout: 5000,
          headers: { Accept: `application/json`, Authorization: token },
        }
      )
      .then(response => {
        setIsFirstSave(false);
        setIsSaveSuccess(true);
        saveAlertMessage();
        return;
      })
      .catch(error => {
        setIsFirstSave(false);
        setIsSaveSuccess(false);
        saveAlertMessage();
      });
  };

  // 임시저장(saveFeed)
  const saveFeed = (
    inputValueRef: HTMLInputElement | null,
    textareaValueRef: HTMLTextAreaElement | null,
    selectValueRef: HTMLLIElement | null
  ) => {
    // 제목, 내용 공백 아닌지 확인하고 값 가져오기 + 카테고리 선택값
    const titleValue = inputValueRef?.value.trim();
    const contentValue = textareaValueRef?.value.trim();
    const selectCategory = selectValueRef?.value;

    // 3가지 중에 하나라도 없다면 임시저장 메세지 띄우기
    if (!titleValue || !contentValue || selectCategory === 0) {
      saveAlertMessage();
      return;
    }

    // 3가지 다 있고 수정이 아니라 게시글 작성이라면? (+임시저장 글 발행)
    if (
      titleValue &&
      contentValue &&
      isFirstSave &&
      selectCategory !== 0 &&
      modifyId === 0
    ) {
      // 글 POST 임시저장 실행
      saveFeedPost(titleValue, contentValue, selectCategory);
      return;
    }

    // 3가지 다 있고 게시글 수정이라면?
    if (
      titleValue &&
      contentValue &&
      isFirstSave === false &&
      selectCategory !== 0
    ) {
      // 글 PATCH 임시저장 실행
      saveFeedPatch(titleValue, contentValue, selectCategory);
      return;
    }
  };

  // 좋아요 안내 알림창? 모달창? ref
  const QuestionDivRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 시 닫는 로직
  useEffect(() => {
    const closeClickOutside = (e: any) => {
      if (
        QuestionDivRef.current &&
        !QuestionDivRef.current.contains(e.target as Node)
      ) {
        setIsQuestionOpen(false);
      }
    };
    document.addEventListener('click', closeClickOutside);
    return () => {
      document.removeEventListener('click', closeClickOutside);
    };
  }, [QuestionDivRef]);

  // 파일 미리보기
  const previewFiles = () => {
    // 허용하는 이미지 파일 확장자
    const allowExtensions = ['jpg', 'png', 'jpeg', 'gif'];

    return (
      // 백에 보낼 파일 있고 미리보기 할 파일 있으면
      (mainFileList.length !== 0 || previewList.length !== 0) &&
      // 미리보기 파일 map으로 돌면서
      previewList.map(item => {
        // 확장자만 따로 빼기
        const extension = item.url.split('.').pop();

        // 확장자가 없으면 null return(허용하는 이미지 파일에서 확인할 수가 없음)
        if (!extension) {
          return null;
        }
        // 허용하는 이미지 파일 목록에 확장자가 있으면 이미지 보여주고
        // 없으면 이미지 파일이 아니어서 파일 아이콘이랑 같이 보여주기
        return allowExtensions.includes(extension) ? (
          <img
            className="max-w-48 max-h-32 cursor-pointer"
            key={item.id}
            src={item.url}
            alt={item.id + '번째 이미지'}
            onClick={() => {
              deleteFile(item.url, item.name);
            }}
          />
        ) : (
          <div
            className="flexCenterAlign flex-col flex-wrap gap-2"
            key={item.id}
          >
            <img
              className="w-8 h-8 max-w-8 max-h-8 cursor-pointer"
              src={FileIconImg}
              alt="파일 아이콘"
              onClick={() => {
                deleteFile(item.url, item.name);
              }}
            />
            <span>{item.name}</span>
          </div>
        );
      })
    );
  };

  // 토스트 문구 알림 내용 설정
  useEffect(() => {
    if (title.trim() === '' || content.trim() === '') {
      setSaveMessage('제목과 내용을 입력해주세요.');
      return;
    }
    if (categoryId === 0) {
      setSaveMessage('카테고리를 선택해주세요.');
      return;
    }
    if (isSaveSuccess === false) {
      setSaveMessage('임시저장에 실패했습니다.');
      return;
    }
    if (isSaveSuccess) {
      setSaveMessage('임시저장되었습니다.');
      return;
    }
  }, [title, content, isSaveSuccess, categoryId]);

  // 임시저장 1분마다 실행
  useEffect(() => {
    if (isTempFeed) {
      const showMessage = setInterval(() => {
        saveFeed(
          inputValueRef.current,
          textareaValueRef.current,
          selectRef.current
        );
      }, 60000);

      return () => clearInterval(showMessage);
    }
  }, [isFirstSave, selectedLike, fileLink]);

  // 게시글 등록
  // const feedUpload = () => {
  //   let bodyObj;
  //   if (feedId !== 0) {
  //     bodyObj = {
  //       feedId: feedId,
  //       title: title,
  //       content: content,
  //       estimation: selectedLike,
  //       category: categoryId,
  //       fileLinks: fileLink,
  //     };
  //   } else {
  //     bodyObj = {
  //       title: title,
  //       content: content,
  //       estimation: selectedLike,
  //       category: categoryId,
  //       fileLinks: fileLink,
  //     };
  //   }
  //   if (title.trim() === '' || content.trim() === '' || categoryId === 0) {
  //     alert('제목 / 내용 / 카테고리는 필수입니다.');
  //     return;
  //   }
  //   if (title && content && categoryId) {
  //     axios
  //       .post<SaveResultType>(`${BACK_URL}/feeds/post`, bodyObj, {
  //         timeout: 5000,
  //         headers: { Accept: `application/json`, Authorization: token },
  //       })
  //       .then(response => {
  //         window.location.href = '/';
  //       })
  //       .catch(error => {
  //         alert('게시글 저장에 실패했습니다. 잠시 후 다시 시도해주세요.');
  //       });
  //   }
  // };

  // 게시글 수정
  // const feedModify = () => {
  //   if (title.trim() === '' || content.trim() === '' || categoryId === 0) {
  //     alert('제목 / 내용 / 카테고리는 필수입니다.');
  //     return;
  //   }
  //   if (title && content && categoryId) {
  //     axios
  //       .patch<SaveResultType>(
  //         `${BACK_URL}/feeds/post`,
  //         {
  //           feedId: modifyId,
  //           title: title,
  //           content: content,
  //           estimation: selectedLike,
  //           category: categoryId,
  //           fileLinks: fileLink,
  //         },
  //         {
  //           timeout: 5000,
  //           headers: { Accept: `application/json`, Authorization: token },
  //         }
  //       )
  //       .then(response => {
  //         window.location.href = `/feed/${modifyId}`;
  //       })
  //       .catch(error => {
  //         alert('게시글 수정에 실패했습니다. 잠시 후 다시 시도해주세요.');
  //       });
  //   }
  // };

  // tailwind css - 토스트 문구 classname
  const saveAlertClass = () => {
    if (isSaved === 'true') {
      return 'animate-saveAlert-open';
    }
    if (isSaved === 'false') {
      return 'animate-saveAlert-close';
    }
    return 'animate-category-default';
  };

  const submit: any = useSubmit();
  const sendFeed = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    // const data = Object.fromEntries(formData);
    let obj = {
      ...(feedId !== 0 && { feedId: feedId }),
      estimation: selectedLike,
      category: categoryId,
      fileLinks: fileLink,
    };
    const data: { [key: string]: FormDataEntryValue } = {};
    for (const [key, value] of formData.entries()) {
      data[key] = value;
    }
    submit({ ...data, ...obj }, { method: 'PATCH' });
    // if (feedId !== 0) {
    //   submit({ ...data, ...obj }, { method: 'PATCH' });
    //   return;
    // }
    // submit({ ...data, ...obj }, { method: 'POST' });
    // return;
  };

  return (
    <Form
      method={searchParams.get('mode') !== 'write' ? 'PATCH' : 'POST'}
      onSubmit={e => sendFeed(e)}
      className="w-full bg-bg-gray"
    >
      <div
        className={`${isSaved === 'true' ? 'visible' : 'invisible'} w-full ${
          isNotNull && isSaveSuccess && categoryId !== 0
            ? 'text-black bg-mainsky'
            : 'text-white bg-mainred'
        }  text-center py-2 ${saveAlertClass()}`}
      >
        {saveMessage}
      </div>
      <div className="flex justify-between items-center w-4/5 my-0 mx-auto p-8">
        <h1 className="text-xl font-bold">
          {ifModifyFeed === false ? '게시글 작성' : '게시글 수정'}
        </h1>
      </div>
      <div className="flex md:items-center items-start md:flex-row flex-col w-4/5 h-12 relative my-0 mx-auto gap-4 p-8">
        <div
          className="flex justify-between items-center w-48 p-2 bg-white rounded-md cursor-pointer"
          onClick={handleToggle}
        >
          {categoryName}
          <img
            className={`w-4 h-4 ml-2 ${isToggleOpen && '-rotate-90'}`}
            src={ToggleImg}
            alt="토글버튼"
          />
        </div>
        <ul
          className={`${
            isToggleOpen ? 'block' : 'hidden'
          } w-48 absolute md:top-16 top-20 bg-white border border-bg-gray rounded-md p-8`}
        >
          {categoryList.map((category: CategoryType, idx: number) => {
            return idx !== countIdx ? (
              <li
                className="p-2 cursor-pointer hover:text-mainblue"
                key={category.id}
                value={category.id}
                onClick={e => {
                  setCategoryName(category.category);
                  setIsToggleOpen(false);
                  handleClickIndex(e, idx);
                  handleSelectChange(category.id);
                }}
              >
                {category.category}
              </li>
            ) : (
              <li
                className="p-2 font-bold"
                key={category.id}
                value={category.id}
                onClick={e => {
                  setCategoryName(category.category);
                  setIsToggleOpen(true);
                  handleClickIndex(e, idx);
                  handleSelectChange(category.id);
                }}
                ref={selectRef}
              >
                {category.category}
              </li>
            );
          })}
        </ul>
        <button
          type="button"
          className="buttonLayout px-4 py-2 cursor-pointer bg-white"
          onClick={() => {
            input.current?.click();
          }}
        >
          파일 선택
        </button>
        <input
          className="invisible absolute"
          type="file"
          ref={input}
          onChange={e => {
            getFileList(e);
          }}
          multiple
        />
        {estimationList.map(estimation => {
          return (
            <div
              key={estimation.id}
              className={`flex justify-center items-center gap-4 w-8 h-8 ${
                selectedLike === estimation.id &&
                'border-2 border-mainblue rounded-full'
              }`}
            >
              <button
                type="button"
                id={estimation.id.toString()}
                onClick={() => handleChange(estimation.id)}
              >
                <img
                  className="w-1.5rem cursor-pointer"
                  src={estimation.img}
                  alt={estimation.estimation}
                />
              </button>
            </div>
          );
        })}
        <div className="flexCenterAlign gap-2" ref={QuestionDivRef}>
          <img
            className="w-1.5rem cursor-pointer"
            src={QuestionMark}
            alt="도움말"
            onClick={() => {
              setIsQuestionOpen(!isQuestionOpen);
            }}
          />
          <div
            className={`${
              isQuestionOpen ? 'flex' : 'hidden'
            } flex-col px-4 py-2 text-sm bg-white rounded-md z-50`}
          >
            <p>리뷰하는 주제에 대한 평가를 선택해주세요.</p>
            <p>매우 좋아요 / 좋아요 / 별로예요</p>
          </div>
        </div>
      </div>
      <div className="flex justify-start flex-col w-4/5 my-0 mx-auto text-sm text-[#b1b1b1] px-8">
        <p>• 파일은 한 번 선택 시 5개까지 가능합니다.</p>
        <p>• 이미지는 png / jpg / jpeg / gif만 업로드가 가능합니다.</p>
        <p>• 이미지 및 파일은 5MB까지 업로드가 가능합니다.</p>
        <p>• 이미지를 클릭하면 삭제할 수 있습니다.</p>
        {isFileSizePass === false && (
          <p className="text-mainred">• 파일 용량을 확인해주세요.</p>
        )}
        {isFileCountPass === false && mainFileList.length !== 0 && (
          <p className="text-mainred">• 파일 개수를 확인해주세요.</p>
        )}
      </div>
      <div className="p-8">
        <div className="flex flex-col w-4/5 mx-auto bg-white rounded-md">
          <div className="flex justify-between border-b border-b-[#f1f1f1]">
            <input
              className="w-full p-4 text-xl border-none outline-none"
              type="text"
              name="title"
              placeholder="제목"
              onInput={getTitle}
              maxLength={30}
              ref={inputValueRef}
              defaultValue={modifyData ? modifyData.result.title : title}
            />
            <div
              className={`${
                titleLength === 30 && 'text-mainred'
              } self-end w-12 text-sm p-0.5`}
            >
              {titleLength} / 30
            </div>
          </div>
          <div className="flex justify-between">
            <textarea
              className="w-full h-96 p-4 border-none outline-none resize-none"
              placeholder="내용"
              name="content"
              onInput={getContent}
              maxLength={10000}
              ref={textareaValueRef}
              defaultValue={modifyData ? modifyData.result.content : content}
            />
            <div className="self-end w-20 text-sm p-0.5">
              {contentLength} / 10000
            </div>
          </div>
          <div className="flexCenterAlign flex-col flex-wrap md:flex-row gap-2 border-t border-b-[#f1f1f1]">
            {mainFileList.length === 0 && previewList.length === 0 && (
              <div className="flex text-[#c1c1c1] text-xl">파일 미리보기</div>
            )}
            {mainFileList.length !== 0 && isFileCountPass && isLoading && (
              <div className="flex text-[#c1c1c1] text-xl">Loading...</div>
            )}
            {previewFiles()}
          </div>
        </div>
      </div>

      <div className="flex w-4/5 my-0 mx-auto px-8 justify-end gap-4">
        {isTempFeed && (
          <button
            type="button"
            className="buttonLayout py-0.5 px-4 hover:text-mainred"
            onClick={() =>
              saveFeed(
                inputValueRef.current,
                textareaValueRef.current,
                selectRef.current
              )
            }
          >
            임시저장
          </button>
        )}
        <button
          className="py-0.5 px-4 border border-mainblue rounded-md hover:text-mainblue hover:bg-white"
          type="submit"
        >
          {ifModifyFeed === false ? '등록' : '수정'}
        </button>
      </div>
    </Form>
  );
};

export const writeFeedAction = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  let fileList =
    formData.get('fileLinks') !== ''
      ? formData.get('fileLinks')?.toString().match(/[^,]+/g)
      : [];

  let feedId = formData.get('feedId')
    ? parseInt(formData.get('feedId') as string, 10)
    : 0;
  let bodyObj: sendFeedType = {
    ...((feedId !== 0 || feedId !== null) && {
      feedId: feedId,
    }),
    title: formData.get('title') as string,
    content: formData.get('content') as string,
    estimation: parseInt(formData.get('estimation') as string, 10),
    category: parseInt(formData.get('category') as string, 10),
    fileLinks: fileList,
  };
  await sendFeed(bodyObj);
  return redirect('/');
};
