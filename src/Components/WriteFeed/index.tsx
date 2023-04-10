import React, { Fragment, useEffect, useRef, useState } from 'react';
import Styled from 'styled-components';
import { flexCenterAlign, ButtonLayout } from 'Styles/CommonStyle';
import ToggleImg from '../../assets/images/toggleDown.png';
import LikeIconImg from '../../assets/images/thumbsUp.png';
import DoubleLikeImg from '../../assets/images/double-like.png';
import DisLikeImg from '../../assets/images/dislike.png';
import QuestionMark from '../../assets/images/question.png';
import FileIconImg from '../../assets/images/clip.png';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const TitleDiv = Styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = Styled.h1`
  font-size: 1.6em;
  font-weight: 700;
  margin-bottom: 2em;
`;

const MenuContainer = Styled.div`
  display: flex;
  align-items: center;
  margin: 0 auto;
  gap: 1em;
  @media (max-width: 767px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const CategoryButton = Styled.div`
  display: flex;
  justify-content: space-between;
  width: 10em;
  padding: 0.8em;
  border: 1px solid #f1f1f1;
  border-radius: 0.3em;
  cursor: pointer;
`;

const CategorySelectBox = Styled.ul<{ isToggleOpen: boolean }>`
  display: ${props => (props.isToggleOpen ? 'block' : 'none')};
  position: absolute;
  width: 10em;
  margin-top: 18em;
  padding: 1em;
  background-color: #fff;
  border: 1px solid #EDEDED;
  border-radius: 0.3em;
  @media (max-width: 767px) {
    margin-top: 3em;
  }
`;

const ToggleButton = Styled.img<{ isToggleOpen: boolean }>`
  width: 1em;
  margin-left: 0.5em;
  transform: ${props => props.isToggleOpen === true && 'rotateZ(-60deg)'};
`;

const CategoryItem = Styled.li`
  padding: 0.5em;
  cursor: pointer;
  &:hover {
    color: #676FA3;
  }
`;

const ActiveItem = Styled.li`
  padding: 0.5em;
  font-weight: 700;
`;

const UploadButton = Styled.button`
  ${ButtonLayout}
  padding: 0.2em;
  cursor: pointer;
`;

const FileInput = Styled.input`
  visibility: hidden;
  position: absolute;
`;

const ContentsContainer = Styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 2em;
`;

const InputDiv = Styled.div`
  display: flex;
  justify-content: space-between;
  border: 1px solid #f1f1f1;
  border-radius: 0.3em;
`;

const TitleInput = Styled.input`
  width: 90%;
  padding: 0.3em 1em;
  font-size: 1.3em;
  border: none;
  outline: none;
  &::placeholder {
    color: #c1c1c1;
  }
`;

const ImgPreview = Styled.div`
  ${flexCenterAlign}
  padding: 1em;
  gap: 0.5em;
  border: 1px solid #f1f1f1;
  border-radius: 0.3em;
  @media (max-width: 767px) {
    flex-direction: column;
  }
`;

const ImgPreviewMessage = Styled.div`
  display: flex;
  color: #c1c1c1;
  font-size: 1.2em;
`;

const FilePreviewDiv = Styled.div`
  ${flexCenterAlign}
  flex-direction: column;
  gap: 0.5em;
`;

const ImgPreviewItem = Styled.img<{ isFile: boolean }>`
  max-width: ${props => (props.isFile ? '7em' : '12em')};
  max-height: ${props => (props.isFile ? '5em' : '8em')};
  cursor: pointer;
`;

const ContentTextarea = Styled.textarea`
  width: 95%;
  height: 25em;
  padding: 1em;
  border: none;
  outline: none;
  &::placeholder {
    color: #c1c1c1;
  }
  resize: none;
`;

const Buttons = Styled.div`
  display: flex;
  width: 100%;
  margin-top: 1em;
  justify-content: flex-end;
  gap: 1em;
`;

const Button = Styled.button<{ isSave: boolean }>`
  ${ButtonLayout}
  padding: 0.1em 1em;
  background-color: ${props => (props.isSave ? '#C1C1C1' : '#FF5959')};
  color: ${props => (props.isSave ? '#000' : '#fff')};
  cursor: pointer;
`;

const SaveAlertDiv = Styled.div<{
  isSaved: string;
  isNotNull: boolean;
  isSaveSuccess: boolean;
  categoryId: number;
}>`
visibility: ${props => (props.isSaved === 'true' ? 'visible' : 'hidden')};
  position: absolute;
  padding: 0.3em;
  right: 20em;
  color: #fff;
  background-color: ${props =>
    props.isNotNull && props.isSaveSuccess && props.categoryId !== 0
      ? '#CDDEFF'
      : '#FF5959'};
  border-radius: 0.3em;
  animation-name: ${props =>
    props.isSaved === 'true'
      ? 'alertOpen'
      : props.isSaved === 'false'
      ? 'alertClose'
      : 'none'};
  animation-direction: alternate;
  animation-duration: 300ms;

  @keyframes alertOpen {
    from {
      visibility: hidden;
      opacity: 0;
    }
    50% {
      visibility:visible;
    }
    to{
      visibility: visible;
      opacity: 1;
    }
  }

  @keyframes alertClose {
    from {
      visibility: visible;
      opacity: 1;
    }
    50% {
      visibility:visible;
    }
    to{
      visibility: hidden;
      opacity: 0;
    }
  }

  @keyframes none {
    0% {
      display: none;
    }
    100% {
      display: none;
    }
  }
`;

const RadioContainer = Styled.div`
  display: flex;
  gap: 1em;
`;

const RadioButton = Styled.label`
  ${flexCenterAlign}
  flex-direction: column;
  cursor: pointer;
`;

const RadioImg = Styled.img`
  width: 1.5em;
  cursor: pointer;
`;

const QuestionDiv = Styled.div<{ isQuestionOpen: boolean }>`
  display: ${props => (props.isQuestionOpen ? 'flex' : 'none')};
  flex-direction: column;
  justify-content: flex-start;
  gap: 0.3em;
  position: absolute;
  padding: 1em;
  background-color: #fff;
  font-size: 0.8em;
  border: 1px solid #b1b1b1;
  border-radius: 0.3em;
`;

const InfoDiv = Styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 0.4em;
  margin-top: 1em;
  font-size: 0.8em;
  color: #b1b1b1;
`;

const Count = Styled.span<{ textLength: number; maxLength: number }>`
  color: ${props => props.textLength === props.maxLength && '#FF5959'};
  align-self: flex-end;
  font-size: 0.8em;
  padding: 0.2em;
`;

const WarningMessage = Styled.p`
  color: #FF5959;
`;

const UploadedFiles = Styled.div`
  display: flex;
  margin-top: 1em;
  flex-direction: column;
  justify-content: flex-start;
  gap: 0.3em;
`;

const SmallTitle = Styled.h2`
  font-weight: 700;
  color: #676FA3;
`;

const FileName = Styled.span`
  font-size: 0.9em;
`;

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
  const [categoryId, setCategoryId] = useState(0);
  const [countIdx, setCountIdx] = useState(0);
  const [mainFileList, setMainFileList] = useState<File[]>([]);
  const [previewList, setPreviewList] = useState<PreviewType[]>([]);
  const [isSaved, setIsSaved] = useState('none');
  const [isQuestionOpen, setIsQuestionOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [titleLength, setTitleLength] = useState(0);
  const [content, setContent] = useState('');
  const [contentLength, setContentLength] = useState(0);
  const [selectedLike, setSelectedLike] = useState(1);
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
  const BACK_PORT = process.env.REACT_APP_BACK_DEFAULT_PORT;

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
    fetch(`${BACK_URL}:${BACK_PORT}/categories`, {
      headers: requestHeaders,
    })
      .then(res => res.json())
      .then(json => {
        setCategoryList([{ id: 0, category: '카테고리 선택' }, ...json]);
      });

    axios
      .get<EstimatioinType[]>(`${BACK_URL}:${BACK_PORT}/feeds/estimations`)
      .then(response => {
        const imgList: string[] = [DoubleLikeImg, LikeIconImg, DisLikeImg];
        const result = response.data.map((estimation, index) => ({
          ...estimation,
          img: imgList[index],
        }));
        setEstimationList(result);
      });

    if (modifyId !== 0) {
      axios
        .get<ModifyDataType>(`${BACK_URL}:${BACK_PORT}/feeds/${modifyId}`)
        .then(response => {
          setModifyData(response.data);
          if (response.data.result.uploadFiles) {
            let uploadFilesLinks: string[] = [];
            response.data.result.uploadFiles.forEach(file => {
              uploadFilesLinks.push(file.file_link);
            });
            setFileLink(uploadFilesLinks);
          }
          setSelectedLike(response.data.result.estimation.id);
          setCategoryId(response.data.result.category.id);
          setTitle(response.data.result.title);
          setContent(response.data.result.content);
          setTitleLength(response.data.result.title.length);
          setContentLength(response.data.result.content.length);
        })
        .catch(() => {
          alert('데이터를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.');
        });
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
    const FILE_SIZE = 5 * 1024 * 1024;
    if (e.target.files) {
      let files: File[] = [...e.target?.files];
      let passFiles: File[] = [];
      files.forEach(file => {
        if (file.size > FILE_SIZE) {
          setIsFileSizePass(false);
          return;
        }
        passFiles.push(file);
      });
      if (passFiles.length > 5) {
        setIsFileCountPass(false);
        passFiles.slice(0, 5);
        return;
      }
      setIsFileCountPass(true);
      setMainFileList(passFiles);
    }
  };

  // 업로드 한 파일 제거(onclick)
  const deleteFile = (url: string, name: string) => {
    axios
      .delete<string>(`${BACK_URL}:${BACK_PORT}/upload`, {
        data: { file_links: [url] },
        headers: { Accept: `application/json`, Authorization: token },
      })
      .then(response => {
        const result = previewList.filter(file => file.url !== url);
        setPreviewList(result);
        const mainFileListResult = mainFileList.filter(
          file => file.name !== name
        );
        setMainFileList(mainFileListResult);
        const fileLinkResult = fileLink.filter(file => file !== url);
        setFileLink(fileLinkResult);
      });
  };

  let token = localStorage.getItem('token');

  // 파일 업로드
  useEffect(() => {
    setIsLoading(true);
    mainFileList.forEach(file => {
      formData.append('file', file);
    });
    if (mainFileList.length !== 0) {
      axios
        .post<FileLinkType>(`${BACK_URL}:${BACK_PORT}/upload`, formData, {
          headers: { Accept: `multipart/form-data`, Authorization: token },
        })
        .then(response => {
          setFileLink(response.data.file_links);
          setIsLoading(false);
          let arr: PreviewType[] = [];
          for (let i = 0; i < response.data.file_links.length; i++) {
            const obj = {
              id: i + 1,
              url: response.data.file_links[i],
              name: mainFileList[i].name,
            };
            arr.push(obj);
          }
          setPreviewList(arr);
        })
        .catch(() => {
          alert('이미지 업로드에 실패했습니다. 다시 시도해주세요.');
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
        `${BACK_URL}:${BACK_PORT}/feeds/temp`,
        {
          title: titleValue,
          content: contentValue,
          estimation: selectedLike,
          category: selectCategory,
          fileLinks: fileLink,
        },
        { headers: { Accept: `application/json`, Authorization: token } }
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
        `${BACK_URL}:${BACK_PORT}/feeds/temp`,
        {
          feedId: feedId,
          title: titleValue,
          content: contentValue,
          estimation: selectedLike,
          category: selectCategory,
          fileLinks: fileLink,
        },
        { headers: { Accept: `application/json`, Authorization: token } }
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
    if (titleValue && contentValue && isFirstSave && selectCategory !== 0) {
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

  const previewFiles = () => {
    const allowExtensions = ['jpg', 'png', 'jpeg', 'gif'];

    return (
      mainFileList.length !== 0 &&
      previewList.map(item => {
        const extension = item.url.split('.').pop();
        if (!extension) {
          return null;
        }
        return allowExtensions.includes(extension) ? (
          <ImgPreviewItem
            key={item.id}
            src={item.url}
            alt={item.id + '번째 이미지'}
            isFile={false}
            onClick={() => {
              deleteFile(item.url, item.name);
            }}
          />
        ) : (
          <FilePreviewDiv key={item.id}>
            <ImgPreviewItem
              src={FileIconImg}
              alt="파일 미리보기 아이콘"
              isFile={true}
              onClick={() => {
                deleteFile(item.url, item.name);
              }}
            />
            <span>{item.name}</span>
          </FilePreviewDiv>
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
  }, [isFirstSave]);

  // 게시글 등록
  const feedUpload = () => {
    if (title.trim() === '' || content.trim() === '' || categoryId === 0) {
      alert('제목 / 내용 / 카테고리는 필수입니다.');
      return;
    }
    if (title && content && categoryId) {
      axios
        .post<SaveResultType>(
          `${BACK_URL}:${BACK_PORT}/feeds/post`,
          {
            title: title,
            content: content,
            estimation: selectedLike,
            category: categoryId,
            fileLinks: fileLink,
          },
          { headers: { Accept: `application/json`, Authorization: token } }
        )
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
          `${BACK_URL}:${BACK_PORT}/feeds/post`,
          {
            feedId: modifyId,
            title: title,
            content: content,
            estimation: selectedLike,
            category: categoryId,
            fileLinks: fileLink,
          },
          { headers: { Accept: `application/json`, Authorization: token } }
        )
        .then(response => {
          window.location.href = `/feed/${modifyId}`;
        })
        .catch(error => {
          alert('게시글 수정에 실패했습니다. 잠시 후 다시 시도해주세요.');
        });
    }
  };
  return (
    <Fragment>
      <TitleDiv>
        <Title>{ifModifyFeed === false ? '게시글 작성' : '게시글 수정'}</Title>
        <SaveAlertDiv
          isSaved={isSaved}
          isNotNull={isNotNull}
          isSaveSuccess={isSaveSuccess}
          categoryId={categoryId}
        >
          {saveMessage}
        </SaveAlertDiv>
      </TitleDiv>
      <MenuContainer>
        <CategoryButton onClick={handleToggle}>
          {ifModifyFeed === false
            ? categoryName
            : modifyData?.result.category.category}
          <ToggleButton
            src={ToggleImg}
            alt="토글버튼"
            isToggleOpen={isToggleOpen}
          />
        </CategoryButton>
        <CategorySelectBox isToggleOpen={isToggleOpen}>
          {categoryList.map((category: CategoryType, idx: number) => {
            return idx !== countIdx ? (
              <CategoryItem
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
              </CategoryItem>
            ) : (
              <ActiveItem
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
              </ActiveItem>
            );
          })}
        </CategorySelectBox>
        <UploadButton
          onClick={() => {
            input.current?.click();
          }}
        >
          파일 선택
        </UploadButton>
        <FileInput
          type="file"
          ref={input}
          onChange={e => {
            getFileList(e);
          }}
          multiple
        />
        <RadioContainer>
          {estimationList.map(estimation => {
            return (
              <RadioButton key={estimation.id}>
                <RadioImg src={estimation.img} alt={estimation.estimation} />
                <input
                  type="radio"
                  value={estimation.id}
                  name="select"
                  defaultChecked={estimation.id === selectedLike}
                  onInput={() => {
                    setSelectedLike(estimation.id);
                  }}
                />
              </RadioButton>
            );
          })}
        </RadioContainer>
        <div ref={QuestionDivRef}>
          <RadioImg
            src={QuestionMark}
            alt="도움말"
            onClick={() => {
              setIsQuestionOpen(!isQuestionOpen);
            }}
          />
          <QuestionDiv isQuestionOpen={isQuestionOpen}>
            <p>리뷰하는 주제에 대한 평가를 선택해주세요.</p>
            <p>매우 좋아요 / 좋아요 / 별로예요</p>
          </QuestionDiv>
        </div>
      </MenuContainer>
      <InfoDiv>
        {modifyId === 0 && (
          <p>
            • 여러 파일 업로드 시 Ctrl키를 누른 상태로 이미지를 선택해주세요.
          </p>
        )}
        {modifyId === 0 && (
          <p>• 이미지는 png / jpg / jpeg / gif 확장자만 가능합니다.</p>
        )}
        {modifyId === 0 && (
          <p>• 최대 5장, 각 이미지는 5MB까지 업로드가 가능합니다.</p>
        )}
        {modifyId === 0 && <p>• 아래 이미지를 클릭하면 삭제할 수 있습니다.</p>}
        {modifyId !== 0 && <p>• 파일을 업로드하면 기존 파일이 대체됩니다.</p>}
        {isFileSizePass === false && (
          <WarningMessage>• 파일 용량을 확인해주세요!</WarningMessage>
        )}
        {isFileCountPass === false && (
          <WarningMessage>• 파일 개수를 확인해주세요!</WarningMessage>
        )}
      </InfoDiv>
      {modifyId !== 0 && (
        <UploadedFiles>
          <SmallTitle>첨부된 파일</SmallTitle>
          {modifyData?.result.uploadFiles.map(file => {
            return <FileName key={file.id}>{file.file_name}</FileName>;
          })}
        </UploadedFiles>
      )}
      <ContentsContainer>
        <InputDiv>
          <TitleInput
            type="text"
            placeholder="제목을 입력해주세요."
            onInput={getTitle}
            maxLength={30}
            ref={inputValueRef}
            defaultValue={modifyData ? modifyData.result.title : title}
          />
          <Count maxLength={30} textLength={titleLength}>
            {titleLength} / 30
          </Count>
        </InputDiv>

        <ImgPreview>
          {mainFileList.length === 0 && (
            <ImgPreviewMessage>파일 미리보기</ImgPreviewMessage>
          )}
          {mainFileList.length !== 0 && isLoading && (
            <ImgPreviewMessage>Loading...</ImgPreviewMessage>
          )}
          {previewFiles()}
        </ImgPreview>
        <InputDiv>
          <ContentTextarea
            placeholder="내용을 입력해주세요."
            onInput={getContent}
            maxLength={10000}
            ref={textareaValueRef}
            defaultValue={modifyData ? modifyData.result.content : content}
          />
          <Count maxLength={10000} textLength={contentLength}>
            {contentLength} / 10000
          </Count>
        </InputDiv>
      </ContentsContainer>
      <Buttons>
        {isTempFeed && (
          <Button
            isSave={true}
            onClick={() =>
              saveFeed(
                inputValueRef.current,
                textareaValueRef.current,
                selectRef.current
              )
            }
          >
            임시저장
          </Button>
        )}
        <Button
          isSave={false}
          onClick={ifModifyFeed === false ? feedUpload : feedModify}
        >
          {ifModifyFeed === false ? '등록' : '수정'}
        </Button>
      </Buttons>
    </Fragment>
  );
};
