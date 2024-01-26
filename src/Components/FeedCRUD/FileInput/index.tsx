import { useRef } from 'react';

const FileInput = ({
  setIsFileSizePass,
  setIsFileCountPass,
  setMainFileList,
}: {
  setIsFileSizePass: (arg: boolean) => void;
  setIsFileCountPass: (arg: boolean) => void;
  setMainFileList: (arg: File[]) => void;
}) => {
  // 파일 선택 input ref
  const input = useRef<HTMLInputElement>(null);

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

  return (
    <>
      <div
        className="px-4 py-2 rounded-lg cursor-pointer bg-white"
        onClick={() => {
          input.current?.click();
        }}
      >
        파일 선택
      </div>
      <input
        className="invisible absolute"
        type="file"
        ref={input}
        onChange={e => {
          getFileList(e);
        }}
        multiple
      />
    </>
  );
};

export default FileInput;
