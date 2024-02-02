import { useAppDispatch } from 'hooks';
import { useEffect, useState } from 'react';
import { alertActions } from 'redux/slice/alert-slice';
import FileIcon from '../../../assets/images/clip.png';
import axios from 'axios';

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
  modifyFiles?: PreviewType[];
}

const FilePreview = ({
  isFileCountPass,
  setMainFileList,
  mainFileList,
  setFileLink,
  fileLink,
  modifyFiles,
}: FilePreviewPropsType) => {
  // 파일 업로드 로딩 여부 - 미리보기 창에 Loading... 표시
  const [isLoading, setIsLoading] = useState(true);

  // 미리보기를 위한 파일 리스트
  const [previewList, setPreviewList] = useState<PreviewType[]>([]);

  useEffect(() => {
    if (modifyFiles) {
      setPreviewList(modifyFiles);
    }
  }, [modifyFiles]);

  const dispatch = useAppDispatch();

  const deleteFile = (url: string, name: string) => {
    const result = previewList.filter(file => file.url !== url);
    setPreviewList(result);

    const mainFileListResult = mainFileList.filter(file => file.name !== name);
    setMainFileList(mainFileListResult);

    const fileLinkResult = fileLink.filter(file => file !== url);
    setFileLink(fileLinkResult);
  };

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
  let token = sessionStorage.getItem('token');
  const BACK_URL = process.env.REACT_APP_BACK_URL;
  useEffect(() => {
    setIsLoading(true);
    mainFileList.forEach(file => {
      const encodedFilename = encodeURIComponent(file.name);
      formData.append('file', file, encodedFilename);
    });
    if (mainFileList.length !== 0) {
      axios
        .post<FileLinkType>(`${BACK_URL}/upload`, formData, {
          timeout: 5000,
          headers: {
            Accept: 'multipart/form-data; charset=UTF-8',
            Authorization: token,
          },
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
          errorAlert('이미지 업로드에 실패했습니다.다시 시도해주세요.');
          setMainFileList([]);
        });
    }
  }, [mainFileList]);

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
