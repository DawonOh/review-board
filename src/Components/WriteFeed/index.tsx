import React, { Fragment, useEffect, useRef, useState } from 'react';
import Styled from 'styled-components';
import { flexCenterAlign, ButtonLayout } from 'Styles/CommonStyle';
import ToggleImg from '../../assets/images/toggleDown.png';
import LikeIconImg from '../../assets/images/thumbsUp.png';
import DoubleLikeImg from '../../assets/images/double-like.png';
import DisLikeImg from '../../assets/images/dislike.png';
import QuestionMark from '../../assets/images/question.png';

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
  height: 10em;
  gap: 0.5em;
  border: 1px solid #f1f1f1;
  border-radius: 0.3em;
`;

const ImgPreviewMessage = Styled.div`
  display: flex;
  color: #c1c1c1;
  font-size: 1.2em;
`;

const ImgPreviewItem = Styled.img`
  max-width: 12em;
  max-height: 8em;
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

const SaveAlertDiv = Styled.div<{ isSaved: string }>`
visibility: ${props => (props.isSaved === 'true' ? 'visible' : 'hidden')};
  position: absolute;
  padding: 0.3em;
  right: 20em;
  color: #fff;
  background-color: #CDDEFF;
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

interface CategoryType {
  id: number;
  category: string;
}

interface ImgType {
  lastModified: number;
  name: string;
  size: number;
  type: string;
  webkitRelativePath: string;
}
export const WriteContainer = () => {
  const [isToggleOpen, setIsToggleOpen] = useState(false);
  const [categoryList, setCategoryList] = useState<CategoryType[]>([]);
  const [categoryName, setCategoryName] = useState('카테고리');
  const [categoryId, setCategoryId] = useState(0);
  const [countIdx, setCountIdx] = useState(0);
  const [mainFileList, setMainFileList] = useState<ImgType[]>([]);
  const [fileName, setFileName] = useState('선택된 파일이 없습니다.');
  const [previewList, setPreviewList] = useState<string[]>([]);
  const [isSaved, setIsSaved] = useState('none');
  const [isQuestionOpen, setIsQuestionOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [titleLength, setTitleLength] = useState(0);
  const [content, setContent] = useState('');
  const [contentLength, setContentLength] = useState(0);
  const [selectedLike, setSelectedLike] = useState(1);

  const BACK_URL = process.env.REACT_APP_BACK_URL;
  const BACK_PORT = process.env.REACT_APP_BACK_DEFAULT_PORT;

  const requestHeaders: HeadersInit = new Headers();
  requestHeaders.set('Content-Type', 'application/json');

  useEffect(() => {
    fetch(`${BACK_URL}:${BACK_PORT}/categories`, {
      headers: requestHeaders,
    })
      .then(res => res.json())
      .then(json => {
        setCategoryList([{ id: 0, category: '카테고리' }, ...json]);
      });
  }, []);

  const getTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitleLength(e.target.value.length);
    setTitle(e.target.value);
  };
  const getContent = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContentLength(e.target.value.length);
    setContent(e.target.value);
  };

  const handleToggle = () => {
    setIsToggleOpen(!isToggleOpen);
  };

  const handleClickIndex = (e: React.MouseEvent, idx: number) => {
    setCountIdx(idx);
  };

  const input = useRef<HTMLInputElement>(null);

  const getFileList = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target?.files && setMainFileList(Array.from(e.target.files));
  };

  useEffect(() => {
    if (mainFileList && mainFileList.length === 0) {
      setFileName('선택된 파일이 없습니다.');
      return;
    }
    if (mainFileList && mainFileList.length === 1) {
      setFileName(mainFileList[0].name);
      return;
    }
    if (mainFileList && mainFileList.length > 1) {
      setFileName(
        mainFileList[0].name + '외 ' + (mainFileList.length - 1) + '장'
      );
      return;
    }
  }, [mainFileList]);

  const savePreImgFile = () => {
    const file = input.current?.files && input.current?.files;
    let fileArr: any[] = [];

    if (file) {
      for (let i = 0; i < file.length; i++) {
        const reader = new FileReader();
        reader.onload = () => {
          fileArr[i] = reader.result;
          setPreviewList([...fileArr]);
        };
        reader.readAsDataURL(file[i]);
      }
    }
  };

  const deletePreviewImg = (idx: number) => {
    setPreviewList(previewList.filter((_, item) => item !== idx));
    setMainFileList(mainFileList.filter((_, item) => item !== idx));
  };

  const showMessage = () => {
    setIsSaved('true');
    setTimeout(function () {
      setIsSaved('false');
    }, 3000);
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

  return (
    <Fragment>
      <TitleDiv>
        <Title>게시글 작성</Title>
        <SaveAlertDiv isSaved={isSaved}>
          2023.03.21 16:32:00 저장되었습니다.
        </SaveAlertDiv>
      </TitleDiv>
      <MenuContainer>
        <CategoryButton onClick={handleToggle}>
          {categoryName}
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
                  setCategoryId(category.id);
                  handleClickIndex(e, idx);
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
                  setCategoryId(category.id);
                  handleClickIndex(e, idx);
                }}
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
          이미지 선택
        </UploadButton>
        <FileInput
          type="file"
          ref={input}
          onChange={e => {
            getFileList(e);
            savePreImgFile();
          }}
          multiple
          accept="image/jpg, image/png, image/jpeg, image/gif"
        />
        <span>{fileName}</span>
        <RadioContainer>
          <RadioButton>
            <RadioImg src={DoubleLikeImg} alt="매우좋아요 선택하기" />
            <input
              type="radio"
              value="1"
              name="select"
              defaultChecked
              onInput={() => {
                setSelectedLike(1);
              }}
            />
          </RadioButton>
          <RadioButton>
            <RadioImg src={LikeIconImg} alt="좋아요 선택하기" />
            <input
              type="radio"
              value="2"
              name="select"
              onInput={() => {
                setSelectedLike(2);
              }}
            />
          </RadioButton>
          <RadioButton>
            <RadioImg src={DisLikeImg} alt="별로예요 선택하기" />
            <input
              type="radio"
              value="3"
              name="select"
              onInput={() => {
                setSelectedLike(3);
              }}
            />
          </RadioButton>
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
        <p>
          • 이미지 여러 장 업로드 시 Ctrl키를 누른 상태로 이미지를 선택해주세요.
        </p>
        <p>• png / jpg / jpeg 확장자만 가능합니다.</p>
        <p>• 최대 5장, 각 이미지는 5MB까지 업로드가 가능합니다.</p>
        <p>• 아래 이미지를 클릭하면 삭제할 수 있습니다.</p>
      </InfoDiv>
      <ContentsContainer>
        <InputDiv>
          <TitleInput
            type="text"
            placeholder="제목을 입력해주세요."
            onInput={getTitle}
            maxLength={30}
          />
          <Count maxLength={30} textLength={titleLength}>
            {titleLength} / 30
          </Count>
        </InputDiv>

        <ImgPreview>
          {mainFileList.length === 0 && (
            <ImgPreviewMessage>이미지 미리보기</ImgPreviewMessage>
          )}
          {mainFileList.length !== 0 &&
            previewList.map((item, idx) => {
              return (
                <ImgPreviewItem
                  key={idx}
                  src={item}
                  alt={idx + 1 + '번째 사진'}
                  onClick={() => {
                    deletePreviewImg(idx);
                  }}
                />
              );
            })}
        </ImgPreview>
        <InputDiv>
          <ContentTextarea
            placeholder="내용을 입력해주세요."
            onInput={getContent}
            maxLength={10000}
          />
          <Count maxLength={10000} textLength={contentLength}>
            {contentLength} / 10000
          </Count>
        </InputDiv>
      </ContentsContainer>
      <Buttons>
        <Button isSave={true} onClick={showMessage}>
          임시저장
        </Button>
        <Button isSave={false}>등록</Button>
      </Buttons>
    </Fragment>
  );
};
