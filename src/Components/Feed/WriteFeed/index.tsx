import React, { useEffect, useRef, useState } from 'react';
import ToggleImg from '../../../assets/images/toggleDown.png';
import LikeIconImg from '../../../assets/images/thumbsUp.png';
import DoubleLikeImg from '../../../assets/images/double-like.png';
import DisLikeImg from '../../../assets/images/dislike.png';
import QuestionMark from '../../../assets/images/question.png';
import FileIconImg from '../../../assets/images/clip.png';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

interface CategoryType {
  id: number;
  category: string;
}

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

interface EstimatioinType {
  id: number;
  estimation: string;
  img: string;
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
export const WriteContainer = () => {
  const [isToggleOpen, setIsToggleOpen] = useState(false);
  const [categoryList, setCategoryList] = useState<CategoryType[]>([]);
  const [categoryName, setCategoryName] = useState('카테고리 선택');
  const [categoryId, setCategoryId] = useState<number | undefined>(0);
  const [countIdx, setCountIdx] = useState(0);
  const [mainFileList, setMainFileList] = useState<File[]>([]);
  const [previewList, setPreviewList] = useState<PreviewType[]>([]);
  const [isSaved, setIsSaved] = useState('none');
  const [isQuestionOpen, setIsQuestionOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [titleLength, setTitleLength] = useState(0);
  const [content, setContent] = useState('');
  const [contentLength, setContentLength] = useState(0);
  const [selectedLike, setSelectedLike] = useState<number | undefined>(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isFileSizePass, setIsFileSizePass] = useState(true);
  const [isFileCountPass, setIsFileCountPass] = useState(true);
  const [isFirstSave, setIsFirstSave] = useState(true);
  const [fileLink, setFileLink] = useState<string[]>([]);
  const [isSaveSuccess, setIsSaveSuccess] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [estimationList, setEstimationList] = useState<EstimatioinType[]>([]);
  const [feedId, setFeedId] = useState(0);
  const [isNotNull, setIsNotNull] = useState(false);
  const [modifyData, setModifyData] = useState<ModifyDataType>();

  const BACK_URL = process.env.REACT_APP_BACK_URL;

  const requestHeaders: HeadersInit = new Headers();
  requestHeaders.set('Content-Type', 'application/json');
  let location = useLocation();

  // 수정 시 전달받는 feedId
  let modifyId = location.state.feedId;

  // 수정인지 등록인지 구분
  let ifModifyFeed = location.state.isModify;

  // 임시저장 실행 여부
  let isTempFeed = location.state.isTemp;

  // 처음 렌더링 시 불러오는 데이터(카테고리, 좋아요, 수정할 feedId)
  useEffect(() => {
    fetch(`${BACK_URL}/categories`, {
      headers: requestHeaders,
    })
      .then(res => res.json())
      .then(json => {
        setCategoryList([{ id: 0, category: '카테고리 선택' }, ...json]);
      });

    axios
      .get<EstimatioinType[]>(`${BACK_URL}/feeds/estimations`, {
        timeout: 5000,
      })
      .then(response => {
        const imgList: string[] = [DoubleLikeImg, LikeIconImg, DisLikeImg];
        const result = response.data.map((estimation, index) => ({
          ...estimation,
          img: imgList[index],
        }));
        setEstimationList(result);
      })
      .catch(() => {
        alert('잠시 후 다시 시도해주세요.');
      });

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
    if (isTempFeed && modifyId !== 0) {
      setIsFirstSave(false);
      setFeedId(modifyId);
    }
  }, []);

  const inputValueRef = useRef<HTMLInputElement>(null);
  const textareaValueRef = useRef<HTMLTextAreaElement>(null);
  const selectRef = useRef<HTMLLIElement>(null);

  // 제목, 내용 값 가져오기
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
    if (title && content) {
      setIsNotNull(true);
      return;
    }
    if (title === '' || content === '') {
      setIsNotNull(false);
      return;
    }
  }, [title, content]);

  const handleToggle = () => {
    setIsToggleOpen(!isToggleOpen);
  };

  const handleClickIndex = (e: React.MouseEvent, idx: number) => {
    setCountIdx(idx);
  };

  const input = useRef<HTMLInputElement>(null);

  const formData = new FormData();

  // input에서 파일 목록 가져오기
  const getFileList = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maxFileSize = 5 * 1024 * 1024;
    const maxFileCount = 5;
    setIsFileSizePass(true);
    setIsFileCountPass(true);
    if (e.target.files) {
      let files: File[] = [...e.target?.files];
      let passFiles: File[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (files[i].size > maxFileSize) {
          setIsFileSizePass(false);
          continue;
        }
        passFiles.push(file);
        if (passFiles.length > maxFileCount) {
          setIsFileCountPass(false);
        }
      }
      setMainFileList(passFiles.slice(0, maxFileCount));
    }
  };

  // 업로드 한 파일 제거(onclick)
  const deleteFile = (url: string, name: string) => {
    const result = previewList.filter(file => file.url !== url);
    setPreviewList(result);
    const mainFileListResult = mainFileList.filter(file => file.name !== name);
    setMainFileList(mainFileListResult);
    const fileLinkResult = fileLink.filter(file => file !== url);
    setFileLink(fileLinkResult);
  };

  // 라디오 버튼 체크
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedLike(Number(e.target.value));
  };

  let token = sessionStorage.getItem('token');

  // 파일 업로드
  useEffect(() => {
    setIsLoading(true);
    mainFileList.forEach(file => {
      formData.append('file', file);
    });
    if (mainFileList.length !== 0) {
      axios
        .post<FileLinkType>(`${BACK_URL}/upload`, formData, {
          timeout: 5000,
          headers: { Accept: `multipart/form-data`, Authorization: token },
        })
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
          alert('이미지 업로드에 실패했습니다. 다시 시도해주세요.');
          setMainFileList([]);
        });
    }
  }, [mainFileList]);

  // 임시저장 메세지 출력
  const saveAlertMessage = () => {
    setIsSaved('true');

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
    const titleValue = inputValueRef?.value.trim();
    const contentValue = textareaValueRef?.value.trim();
    const selectCategory = selectValueRef?.value;
    if (!titleValue || !contentValue || selectCategory === 0) {
      saveAlertMessage();
      return;
    }
    if (
      titleValue &&
      contentValue &&
      isFirstSave &&
      selectCategory !== 0 &&
      modifyId === 0
    ) {
      saveFeedPost(titleValue, contentValue, selectCategory);
      return;
    }
    if (
      titleValue &&
      contentValue &&
      isFirstSave === false &&
      selectCategory !== 0
    ) {
      saveFeedPatch(titleValue, contentValue, selectCategory);
      return;
    }
  };

  const QuestionDivRef = useRef<HTMLDivElement>(null);

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
    const allowExtensions = ['jpg', 'png', 'jpeg', 'gif'];

    return (
      (mainFileList.length !== 0 || previewList.length !== 0) &&
      previewList.map(item => {
        const extension = item.url.split('.').pop();
        if (!extension) {
          return null;
        }
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
  const feedUpload = () => {
    let bodyObj;
    if (feedId !== 0) {
      bodyObj = {
        feedId: feedId,
        title: title,
        content: content,
        estimation: selectedLike,
        category: categoryId,
        fileLinks: fileLink,
      };
    } else {
      bodyObj = {
        title: title,
        content: content,
        estimation: selectedLike,
        category: categoryId,
        fileLinks: fileLink,
      };
    }
    if (title.trim() === '' || content.trim() === '' || categoryId === 0) {
      alert('제목 / 내용 / 카테고리는 필수입니다.');
      return;
    }
    if (title && content && categoryId) {
      axios
        .post<SaveResultType>(`${BACK_URL}/feeds/post`, bodyObj, {
          timeout: 5000,
          headers: { Accept: `application/json`, Authorization: token },
        })
        .then(response => {
          window.location.href = '/';
        })
        .catch(error => {
          alert('게시글 저장에 실패했습니다. 잠시 후 다시 시도해주세요.');
        });
    }
  };

  // 게시글 수정
  const feedModify = () => {
    if (title.trim() === '' || content.trim() === '' || categoryId === 0) {
      alert('제목 / 내용 / 카테고리는 필수입니다.');
      return;
    }
    if (title && content && categoryId) {
      axios
        .patch<SaveResultType>(
          `${BACK_URL}/feeds/post`,
          {
            feedId: modifyId,
            title: title,
            content: content,
            estimation: selectedLike,
            category: categoryId,
            fileLinks: fileLink,
          },
          {
            timeout: 5000,
            headers: { Accept: `application/json`, Authorization: token },
          }
        )
        .then(response => {
          window.location.href = `/feed/${modifyId}`;
        })
        .catch(error => {
          alert('게시글 수정에 실패했습니다. 잠시 후 다시 시도해주세요.');
        });
    }
  };

  const saveAlertClass = () => {
    if (isSaved === 'true') {
      return 'animate-saveAlert-open';
    }
    if (isSaved === 'false') {
      return 'animate-saveAlert-close';
    }
    return 'animate-category-default';
  };

  return (
    <div className="w-full bg-bg-gray">
      <div
        className={`${isSaved === 'true' ? 'visible' : 'invisible'} w-full ${
          isNotNull && isSaveSuccess && categoryId !== 0
            ? 'text-black bg-mainsky'
            : 'text-white bg-mainred'
        }  text-center py-2 ${saveAlertClass()}`}
      >
        {/* {saveMessage} */}
        카테고리를 선택해주세요.
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
        <div className="flex gap-4">
          {estimationList.map(estimation => {
            return (
              <label
                className="flexCenterAlign flex-col cursor-pointer"
                key={estimation.id}
              >
                <img
                  className="w-1.5rem cursor-pointer"
                  src={estimation.img}
                  alt={estimation.estimation}
                />
                <input
                  type="radio"
                  value={estimation.id}
                  name="select"
                  checked={estimation.id === selectedLike}
                  onChange={e => {
                    handleChange(e);
                  }}
                />
              </label>
            );
          })}
        </div>
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
          onClick={ifModifyFeed === false ? feedUpload : feedModify}
        >
          {ifModifyFeed === false ? '등록' : '수정'}
        </button>
      </div>
    </div>
  );
};
