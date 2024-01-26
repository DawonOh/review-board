import { useEffect, useRef, useState } from 'react';
import { Form, redirect } from 'react-router-dom';
import {
  CategoryType,
  EstimationType,
  ModifyDataType,
  editFeed,
  sendFeed,
  sendFeedType,
} from 'util/feed-http';
import { queryClient } from 'util/feedDetail-http';
import FilePreview, { PreviewType } from '../FilePreview';
import TitleContent from '../TitleContent';
import Category from '../Category';
import FileInput from '../FileInput';
import Estimation from '../Estimation';

interface FormPropsType {
  estimationList: EstimationType[] | undefined;
  categoryList: CategoryType[] | undefined;
  modifyFeedData?: ModifyDataType | null | '';
  mode: string | null;
  id: string | null;
  setIsSaved: (arg: boolean) => void;
  onSubmit: (arg: any) => void;
}

const FeedForm = ({
  estimationList,
  categoryList,
  modifyFeedData,
  mode,
  id,
  setIsSaved,
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
  // 사용자가 선택한 좋아요 id
  const [selectedLike, setSelectedLike] = useState<number | undefined>(1);
  // 백엔드에 보낼 파일 링크
  const [fileLink, setFileLink] = useState<string[]>([]);
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
      // setCategoryName(modifyFeedResultData?.category.category);
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
      // setPreviewList(modifyPreviewList);
      setFileLink(modifyFileList);
      setSelectedLike(modifyFeedResultData.estimation.id);
    }
  }, []);

  // 제목 input, 내용 textarea, 선택한 카테고리 ref
  const inputValueRef = useRef<HTMLInputElement>(null);
  const textareaValueRef = useRef<HTMLTextAreaElement>(null);
  const selectRef = useRef<HTMLLIElement>(null);

  const requestHeaders: HeadersInit = new Headers();
  requestHeaders.set('Content-Type', 'application/json');

  const getTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const getContent = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const sendFeed = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // const formData = new FormData(e.target as HTMLFormElement);
    // let obj = {
    //   ...(feedId !== '0' && mode !== 'write' && { feedId: feedId }),
    //   estimation: selectedLike,
    //   category: categoryId,
    //   // fileLinks: fileLink,
    // };
    // const data: { [key: string]: FormDataEntryValue } = {};
    // for (const [key, value] of formData.entries()) {
    //   data[key] = value;
    // }
    // const submitData = { ...data, ...obj };
    // if (feedId !== '0') {
    //   submit({ ...data, ...obj }, { method: 'PATCH' });
    //   return;
    // }
  };

  return (
    <Form onSubmit={e => sendFeed(e)} className="w-full bg-bg-gray px-8">
      <div className="flex items-start flex-col w-4/5 my-0 mx-auto gap-4 relative md:mt-0 mt-4">
        <div className="flex md:items-center items-start gap-4 md:flex-row flex-col">
          <Category
            categoryList={categoryList}
            handleSelectChange={handleSelectChange}
            categoryId={categoryId}
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

        <div className="text-sm text-[#b1b1b1]">
          <p>• 파일은 한 번 선택 시 5개까지 가능합니다.</p>
          <p>• 이미지 및 파일은 5MB까지 업로드가 가능합니다.</p>
          <p>• 이미지를 클릭하면 삭제할 수 있습니다.</p>
          {isFileSizePass === false && (
            <p className="text-mainred">• 파일 용량을 확인해주세요.</p>
          )}
          {isFileCountPass === false && mainFileList.length !== 0 && (
            <p className="text-mainred">• 파일 개수를 확인해주세요.</p>
          )}
        </div>
        <FilePreview
          isFileCountPass={isFileCountPass}
          setMainFileList={setMainFileList}
          mainFileList={mainFileList}
          setFileLink={setFileLink}
          fileLink={fileLink}
        />
        <TitleContent
          title={title}
          content={content}
          getTitle={getTitle}
          getContent={getContent}
        />
        <div className="flex w-full my-0 mx-auto px-8 justify-end gap-4">
          {mode === 'temp' ||
            (mode === 'write' && (
              <button
                type="button"
                className="buttonLayout py-0.5 px-4 hover:text-mainred"
                // onClick={() =>
                //   saveFeed(
                //     inputValueRef.current,
                //     textareaValueRef.current,
                //     selectRef.current
                //   )
                // }
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
    </Form>
  );
};

export const feedFormAction = async ({ request }: { request: Request }) => {
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
  feedId !== 0 ? await sendFeed(bodyObj) : await editFeed(bodyObj);
  await queryClient.invalidateQueries({ queryKey: ['mainList'] });
  return feedId !== 0 ? redirect(`/feed/${feedId}`) : redirect('/');
};

export default FeedForm;
