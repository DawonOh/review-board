import { useAppDispatch, useAppSelector } from 'hooks';
import { Fragment, useRef } from 'react';
import { Link } from 'react-router-dom';
import { alertActions } from 'redux/slice/alert-slice';

export const AlertModal = () => {
  const dispatch = useAppDispatch();
  const alertModal = useAppSelector(state => state.alert);
  const AlertDivRef = useRef<HTMLDivElement>(null);
  let alertMessage = alertModal.contents.match(/[^.]+[.]/g);

  const linkButton = () => {
    if (alertModal.alertPath) {
      return (
        <Link to={alertModal.alertPath}>
          <button
            className="buttonLayout py-1.5 px-2.5 bg-mainblue text-white"
            onClick={() => {
              dispatch(alertActions.closeModal());
            }}
          >
            확인
          </button>
        </Link>
      );
    }
    return (
      <button
        className="buttonLayout py-1.5 px-2.5 bg-mainblue text-white"
        onClick={() => {
          dispatch(alertActions.closeModal());
        }}
      >
        확인
      </button>
    );
  };

  return (
    <Fragment>
      {alertModal.isModalOpen && (
        <div className="flexCenterAlign fixed inset-x-0 inset-y-0 bg-black/50">
          <div
            className="w-80 h-48 flexCenterAlign p-4 bg-white rounded"
            ref={AlertDivRef}
          >
            <div className="w-full h-full flexCenterAlign flex-col">
              <div className="flex justify-center items-start flex-col h-full gap-1.5">
                {alertMessage?.map((message: string, idx: number) => {
                  return <p key={idx}>{message}</p>;
                })}
              </div>
              <div className="flex gap-1.5">
                {alertModal.isQuestion ? (
                  <Fragment>
                    <button
                      className="buttonLayout py-1.5 px-2.5 bg-buttongray text-white"
                      onClick={() => {
                        dispatch(alertActions.closeModal());
                      }}
                    >
                      취소
                    </button>
                    <button
                      className="buttonLayout py-1.5 px-2.5 bg-mainblue text-white"
                      onClick={() => {
                        dispatch(alertActions.closeModal());
                        dispatch(alertActions.setIsClickOk());
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
      )}
    </Fragment>
  );
};
