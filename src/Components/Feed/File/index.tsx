import { useEffect, useState } from 'react';

interface fileDataType {
  id: number;
  is_img: boolean;
  file_link: string;
  file_name: string;
  file_size: string;
}

export const File = ({
  fileData,
}: {
  fileData: fileDataType[] | undefined;
}) => {
  const [haveFile, setHaveFile] = useState(false);

  useEffect(() => {
    fileData?.forEach(file => {
      if (file.is_img === false) {
        setHaveFile(true);
        return;
      }
    });
  }, [fileData]);

  return (
    <div className="2xl:w-1/2 w-3/4 my-0 mx-auto sm:px-8">
      {haveFile && (
        <div className="w-full mt-12 font-bold text-lg">첨부파일</div>
      )}
      {fileData?.map(file => {
        return (
          file.is_img === false && (
            <a
              className="flex justify-between gap-4 w-full p-4 cursor-pointer"
              href={file.file_link}
              key={file.id}
              download
            >
              <div>
                <span>{file.file_name}</span>
                <span className="text-buttongray text-sm ml-4">
                  {file.file_size}
                </span>
              </div>

              <div className="w-4 h-4 min-w-4 min-h-4 mr-1 bg-[url('./assets/images/download.png')] bg-no-repeat bg-cover" />
            </a>
          )
        );
      })}
    </div>
  );
};
