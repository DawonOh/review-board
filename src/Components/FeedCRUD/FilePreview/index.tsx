import instance from 'api';
import { useAppDispatch } from 'hooks';
import { useEffect, useState } from 'react';
import { alertActions } from 'redux/slice/alert-slice';
import FileIcon from '../../../assets/images/clip.png';

export interface PreviewType {
  id: number;
  url: string;
  name: string;
}

interface FileLinkType {
  file_links: string[];
}

interface FilePreviewPropsType {
  isFileCountPass: boolean | null;
  setMainFileList: (arg: File[]) => void;
  mainFileList: File[];
  setFileLink: (arg: string[]) => void;
  fileLink: string[];
}

const FilePreview = ({
  isFileCountPass,
  setMainFileList,
  mainFileList,
  setFileLink,
  fileLink,
}: FilePreviewPropsType) => {
  // 파일 업로드 로딩 여부 - 미리보기 창에 Loading... 표시
  const [isLoading, setIsLoading] = useState(true);

  // 미리보기를 위한 파일 리스트
  const [previewList, setPreviewList] = useState<PreviewType[]>([]);

  const dispatch = useAppDispatch();

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

  // 파일 업로드를 위한 formData -> 여기에 파일 데이터 저장함
  const formData = new FormData();

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
  }, [fileLink, mainFileList, previewList]);

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
              src={FileIcon}
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

  return (
    <div className="w-full mx-auto my-0 my-4">
      <h2>파일 미리보기</h2>
      <div className="flex items-center justify-start flex-col flex-wrap md:flex-row gap-2 min-h-32">
        {mainFileList.length === 0 && previewList.length === 0 && (
          <div className="w-6 h-6 bg-[url('./assets/images/image.png')] bg-no-repeat bg-cover" />
        )}
        {mainFileList.length !== 0 && isFileCountPass && isLoading && (
          <div className="flex text-[#c1c1c1] text-xl">Loading...</div>
        )}
        {previewFiles()}
      </div>
    </div>
  );
};

export default FilePreview;
