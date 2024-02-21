import { Header } from 'Components';
import { Link } from 'react-router-dom';
import { isRouteErrorResponse, useRouteError } from 'react-router-dom';

export const ErrorPage = () => {
  const error = useRouteError();
  let message = '예상치 못한 에러가 발생했습니다. 잠시 후 다시 시도해주세요.';

  if (isRouteErrorResponse(error)) {
    if (error.status === 500) {
      message = error.data.message;
    } else if (error.status === 404) {
      message = '페이지를 찾을 수 없습니다.';
    }
  }

  return (
    <>
      <Header />
      <div className="absolute top-0 left-0 w-screen h-screen flexCenterAlign flex-col gap-8">
        <div className="w-12 h-12 bg-[url('./assets/images/searchFail.png')] bg-no-repeat bg-cover animate-move" />
        <h1 className="font-bold text-xl">{message}</h1>
        <Link to="/">
          <button className="buttonLayout bg-buttongray p-2">
            메인화면으로 돌아가기
          </button>
        </Link>
      </div>
    </>
  );
};
