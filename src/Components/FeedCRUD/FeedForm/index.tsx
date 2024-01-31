import { useEffect, useRef, useState } from 'react';
import { redirect } from 'react-router-dom';
import {
  CategoryType,
  EstimationType,
  ModifyDataType,
  editFeed,
  patchSave,
  postSave,
  sendFeed,
  sendFeedType,
} from 'util/feed-http';
import { queryClient } from 'util/feedDetail-http';
import FilePreview, { PreviewType } from '../FilePreview';
import Category from '../Category';
import FileInput from '../FileInput';
import Estimation from '../Estimation';
import TitleInput from '../TitleInput';
import ContentTextarea from '../ContentTextarea';
import { useMutation } from '@tanstack/react-query';

interface FormPropsType {
  estimationList: EstimationType[] | undefined;
  categoryList: CategoryType[] | undefined;
  modifyFeedData?: ModifyDataType | null | '';
  mode: string | null;
  id: string | null;
  onSubmit: (arg1: any, arg2: string) => void;
}

const FeedForm = ({
  estimationList,
  categoryList,
  modifyFeedData,
  mode,
  id,
  onSubmit,
}: FormPropsType) => {
  // 처음 임시저장 -> POST / 그 다음부터 저장 -> PATCH
  const [isFirstSave, setIsFirstSave] = useState(true);
  // 사용자에게서 입력받은 제목
  const [title, setTitle] = useState('');
  // 사용자에게서 입력받은 내용
  const [content, setContent] = useState('');
  // 입력받아야 하는 값이 빈값인지 확인 여부
  const [isNotNull, setIsNotNull] = useState(false);
  // 카테고리 id
  const [categoryId, setCategoryId] = useState<number | undefined>(0);
  // 파일 input 값
  const [mainFileList, setMainFileList] = useState<File[]>([]);
  // 파일 사이즈 통과 여부
  const [isFileSizePass, setIsFileSizePass] = useState<boolean | null>(null);
  // 파일 개수 통과 여부
  const [isFileCountPass, setIsFileCountPass] = useState<boolean | null>(null);
  // 파일 미리보기 수정 데이터
  const [modifyFiles, setModifyFiles] = useState<PreviewType[]>([]);
  // 사용자가 선택한 좋아요 id
  const [selectedLike, setSelectedLike] = useState<number | undefined>(1);
  // 백엔드에 보낼 파일 링크
  const [fileLink, setFileLink] = useState<string[]>([]);
  // 임시저장 성공 여부
  const [isSaveSuccess, setIsSaveSuccess] = useState<boolean | null>(null);
  // 임시저장 메세지 띄우기
  const [isAlertOn, setIsAlertOn] = useState<boolean | null>(null);

  // 임시저장 두 번째 저장 이후부터 필요한 게시물id
  const [feedId, setFeedId] = useState<string | null>(null);

  // 임시저장 메세지
  const [saveMessage, setSaveMessage] = useState('');
  // 카테고리 값 가져오기
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

  const modifyFeedResultData = modifyFeedData
    ? (modifyFeedData?.result as ModifyDataType['result'])
    : '';

  // 불러온 수정 데이터 저장
  useEffect(() => {
    if (mode === 'temp' && id !== '0') {
      setIsFirstSave(false);
    }

    if (mode === 'modify' && modifyFeedResultData) {
      setTitle(modifyFeedResultData?.title);
      setContent(modifyFeedResultData?.content);
      setCategoryId(modifyFeedResultData?.category.id);
      let modifyPreviewList: PreviewType[] = [];
      let modifyFileList: string[] = [];
      for (let i = 0; i < modifyFeedResultData?.uploadFiles.length; i++) {
        let obj = {
          id: modifyFeedResultData?.uploadFiles[i].id,
          url: modifyFeedResultData?.uploadFiles[i].file_link,
          name: modifyFeedResultData?.uploadFiles[i].file_name,
        };
        modifyPreviewList.push(obj);
        modifyFileList.push(modifyFeedResultData?.uploadFiles[i].file_link);
      }
      setModifyFiles(modifyPreviewList);
      setFileLink(modifyFileList);
      setSelectedLike(modifyFeedResultData.estimation.id);
    }
  }, []);

  // 제목 input, 내용 textarea, 선택한 카테고리 ref
  const inputValueRef = useRef<HTMLInputElement>(null);
  const textareaValueRef = useRef<HTMLTextAreaElement>(null);
  const categoryRef = useRef<HTMLLIElement>(null);

  const requestHeaders: HeadersInit = new Headers();
  requestHeaders.set('Content-Type', 'application/json');

  const getTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const getContent = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  // 임시저장 메세지 3초간 띄우기
  const saveAlertMessage = () => {
    setIsAlertOn(true);

    setTimeout(() => {
      setIsAlertOn(false);
    }, 3000);
  };

  // post
  const { mutate: postMutate } = useMutation({
    mutationFn: postSave,
    onSuccess: data => {
      setIsFirstSave(false);
      setIsSaveSuccess(true);
      setFeedId(data.result.id.toString());
      saveAlertMessage();
    },
    onError: () => {
      setIsSaveSuccess(false);
      saveAlertMessage();
    },
  });

  // patch
  const { mutate: patchMutate } = useMutation({
    mutationFn: patchSave,
    onSuccess: () => {
      setIsFirstSave(false);
      setIsSaveSuccess(true);
      saveAlertMessage();
    },
    onError: () => {
      setIsFirstSave(false);
      setIsSaveSuccess(false);
      saveAlertMessage();
    },
  });

  // 임시저장(saveFeed)
  const saveFeed = (
    titleCurrent: HTMLInputElement | null,
    contentCurrent: HTMLTextAreaElement | null,
    categoryCurrent: HTMLLIElement | null
  ) => {
    const titleValue = titleCurrent?.value.trim();
    const contentValue = contentCurrent?.value.trim();
    const selectCategory = categoryCurrent?.value;

    if (selectCategory === 0 || !titleValue || !contentValue) {
      setIsSaveSuccess(false);
      saveAlertMessage();
      return;
    }
    // 제목, 내용, 카테고리 모두 있는 경우 + 첫 임시저장
    if (selectCategory !== 0 && titleValue && contentValue && isFirstSave) {
      // 글 POST 임시저장 실행
      postMutate({
        title: titleValue,
        content: contentValue,
        estimation: selectedLike,
        category: selectCategory,
        fileLinks: fileLink,
      });
      return;
    }
    // 제목, 내용, 카테고리 모두 있는 경우 + 이후 임시저장
    if (selectCategory !== 0 && titleValue && contentValue && !isFirstSave) {
      patchMutate({
        feedId,
        title: titleValue,
        content: contentValue,
        estimation: selectedLike,
        category: selectCategory,
        fileLinks: fileLink,
      });
      return;
    }
  };

  // 임시저장 메세지 설정
  useEffect(() => {
    if (categoryRef.current?.value === 0) {
      setSaveMessage('카테고리를 선택해주세요.');
      return;
    }
    if (
      inputValueRef.current?.value.trim() === '' ||
      textareaValueRef.current?.value.trim() === ''
    ) {
      setSaveMessage('제목과 내용을 입력해주세요.');
      return;
    }
    if (isSaveSuccess === false) {
      setSaveMessage('임시 저장에 실패했습니다.');
      return;
    }
    if (isSaveSuccess) {
      setSaveMessage('임시 저장 되었습니다.');
      return;
    }
  }, [
    inputValueRef.current?.value,
    textareaValueRef.current?.value,
    isSaveSuccess,
    categoryRef.current?.value,
  ]);

  // 임시저장 1분마다 실행
  useEffect(() => {
    if (mode !== 'modify') {
      const showMessage = setInterval(() => {
        saveFeed(
          inputValueRef.current,
          textareaValueRef.current,
          categoryRef.current
        );
      }, 60000);

      return () => clearInterval(showMessage);
    }
  }, [isFirstSave, selectedLike, fileLink]);

  const saveAlertClass = () => {
    if (isAlertOn === null) {
      return 'invisible animate-category-default';
    }
    if (isAlertOn) {
      return 'visible animate-saveAlert-open';
    }
    if (isAlertOn === false) {
      return 'invisible animate-saveAlert-close';
    }
  };

  const sendFeed = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    let resultFeedId = mode === 'modify' ? id : feedId;
    let obj = {
      ...((feedId !== null || id) && { feedId: resultFeedId }),
      estimation: selectedLike,
      category: categoryId,
      fileLinks: fileLink,
      mode: mode,
    };
    const data: { [key: string]: FormDataEntryValue } = {};
    for (const [key, value] of formData.entries()) {
      data[key] = value;
    }
    if (mode === 'write') {
      onSubmit({ ...data, ...obj }, 'post');
      return;
    }
    if (mode === 'modify') {
      onSubmit({ ...data, ...obj }, 'patch');
      return;
    }
  };

  return (
    <form onSubmit={e => sendFeed(e)} className="w-full bg-bg-gray px-8">
      <div className="flex relative flex-col items-start w-4/5 my-0 mx-auto gap-4 md:mt-0 mt-4">
        <div className="flex w-full justify-between items-center">
          <div className="flex gap-4 md:items-center items-start md:flex-row flex-col reletive">
            <Category
              categoryList={categoryList}
              handleSelectChange={handleSelectChange}
              categoryId={categoryId}
              ref={categoryRef}
            />
            <FileInput
              setIsFileSizePass={setIsFileSizePass}
              setIsFileCountPass={setIsFileCountPass}
              setMainFileList={setMainFileList}
            />
            <Estimation
              estimationList={estimationList}
              setSelectedLike={setSelectedLike}
              selectedLike={selectedLike}
            />
          </div>
          <div
            className={`${
              isSaveSuccess === true
                ? 'text-mainblue bg-mainsky border border-mainblue'
                : 'text-mainred bg-[#F8C7C7] border border-mainred'
            } ${saveAlertClass()} flexCenterAlign gap-4 h-10 px-4 font-bold rounded-lg fixed top-12 right-0 md:static`}
          >
            <div
              className={`w-6 h-6 ${
                isAlertOn && isSaveSuccess
                  ? "bg-[url('./assets/images/checkCircle.png')]"
                  : "bg-[url('./assets/images/alertSign.png')]"
              } bg-no-repeat bg-cover`}
            />
            <p>{saveMessage}</p>
          </div>
        </div>

        <div className="text-sm text-[#b1b1b1]">
          <p>• 파일은 한 번 선택 시 5개까지 가능합니다.</p>
          <p>• 이미지 및 파일은 5MB까지 업로드가 가능합니다.</p>
          <p>• 이미지를 클릭하면 삭제할 수 있습니다.</p>
          {isFileSizePass === false && (
            <p className="text-mainred">• 파일 용량을 확인해주세요.</p>
          )}
          {isFileCountPass === false && (
            <p className="text-mainred">• 파일 개수를 확인해주세요.</p>
          )}
        </div>
        <FilePreview
          isFileCountPass={isFileCountPass}
          setMainFileList={setMainFileList}
          mainFileList={mainFileList}
          setFileLink={setFileLink}
          fileLink={fileLink}
          modifyFiles={modifyFiles && modifyFiles}
        />
        <div className="w-full mx-auto my-0 my-4">
          <h2>제목 및 내용</h2>
          <div className="flex flex-col p-4 mx-auto bg-white rounded-md">
            <TitleInput title={title} getTitle={getTitle} ref={inputValueRef} />
            <ContentTextarea
              content={content}
              getContent={getContent}
              ref={textareaValueRef}
            />
          </div>
        </div>
        <div className="flex w-full my-0 mx-auto px-8 justify-end gap-4">
          {mode === 'temp' ||
            (mode === 'write' && (
              <button
                type="button"
                className="buttonLayout py-0.5 px-4 hover:text-mainred"
                onClick={() =>
                  saveFeed(
                    inputValueRef.current,
                    textareaValueRef.current,
                    categoryRef.current
                  )
                }
              >
                임시저장
              </button>
            ))}
          <button
            className="py-0.5 px-4 border border-mainblue rounded-md hover:text-mainblue hover:bg-white"
            type="submit"
          >
            {mode === 'write' ? '등록' : '수정'}
          </button>
        </div>
      </div>
    </form>
  );
};

export const feedFormAction = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const mode = formData.get('mode');
  let fileList =
    formData.get('fileLinks') !== ''
      ? formData.get('fileLinks')?.toString().match(/[^,]+/g)
      : [];

  let feedId = formData.get('feedId')
    ? parseInt(formData.get('feedId') as string, 10)
    : 0;
  let bodyObj: sendFeedType = {
    ...(feedId !== null && {
      feedId: feedId,
    }),
    title: formData.get('title') as string,
    content: formData.get('content') as string,
    estimation: parseInt(formData.get('estimation') as string, 10),
    category: parseInt(formData.get('category') as string, 10),
    fileLinks: fileList,
  };
  mode !== 'modify' ? await sendFeed(bodyObj) : await editFeed(bodyObj);

  queryClient.invalidateQueries({
    queryKey: ['feed', { feedId: feedId.toString() }],
  });
  queryClient.invalidateQueries({ queryKey: ['mainList'] });

  return mode !== 'modify' ? redirect(`/`) : redirect(`/feed/${feedId}`);
};

export default FeedForm;
