import { useRef } from 'react';

const FileInput = ({
  setIsFileSizePass,
  setIsFileCountPass,
  setMainFileList,
}: {
  setIsFileSizePass: (arg: boolean | null) => void;
  setIsFileCountPass: (arg: boolean | null) => void;
  setMainFileList: (arg: File[]) => void;
}) => {
  const input = useRef<HTMLInputElement>(null);

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
