import React, { Fragment, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

interface Props {
  isAlertModalOpen: boolean;
  setIsAlertModalOpen: (isAlertModalOpen: boolean) => void;
  contents: { id: number; text: string }[];
  isQuestion?: boolean;
  setResult?: Function;
  alertPath?: string;
}

export const AlertModal = ({
  isAlertModalOpen,
  setIsAlertModalOpen,
  contents,
  isQuestion,
  setResult,
  alertPath,
}: Props) => {
  const AlertDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const closeClickOutside = (e: any) => {
      if (
        AlertDivRef.current &&
        !AlertDivRef.current.contains(e.target as Node)
      ) {
        setIsAlertModalOpen(false);
      }
    };
    document.addEventListener('click', closeClickOutside);
    return () => {
      document.removeEventListener('click', closeClickOutside);
    };
  }, [setIsAlertModalOpen]);

  const linkButton = () => {
    if (alertPath) {
      return (
        <Link to={alertPath}>
          <button
            className="buttonLayout py-1.5 px-2.5 bg-mainblue text-white"
            onClick={() => {
              setIsAlertModalOpen(false);
            }}
          >
            확인
          </button>
        </Link>
      );
    } else {
      return (
        <button
          className="buttonLayout py-1.5 px-2.5 bg-mainblue text-white"
          onClick={() => {
            setIsAlertModalOpen(false);
          }}
        >
          확인
        </button>
      );
    }
  };

  return (
    <div className="flexCenterAlign fixed inset-x-0 inset-y-0 bg-black/50">
      <div
        className="w-80 h-48 flexCenterAlign p-4 bg-white rounded"
        ref={AlertDivRef}
      >
        <div className="w-full h-full flexCenterAlign flex-col">
          <div className="flexCenterAlign flex-col h-full gap-1.5">
            {contents.map(content => {
              return <p key={content.id}>{content.text}</p>;
            })}
          </div>
          <div className="flex gap-1.5">
            {isQuestion ? (
              <Fragment>
                <button
                  className="buttonLayout py-1.5 px-2.5 bg-buttongray text-white"
                  onClick={() => {
                    setIsAlertModalOpen(false);
                    setResult && isQuestion && setResult(false);
                  }}
                >
                  취소
                </button>
                <button
                  className="buttonLayout py-1.5 px-2.5 bg-mainblue text-white"
                  onClick={() => {
                    setIsAlertModalOpen(false);
                    setResult && setResult(true);
                  }}
                >
                  확인
                </button>
              </Fragment>
            ) : (
              linkButton()
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
