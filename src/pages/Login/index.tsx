import { Link } from 'react-router-dom';

export const Login = () => {
  return (
    <div className="flex">
      <div className="w-1/2 h-screen bg-mainsky flex flexCenterAlign">
        <Link to="/">
          <div className="w-6 h-6 absolute top-8 left-8 bg-[url('./assets/images/back.png')] bg-no-repeat bg-cover cursor-pointer" />
        </Link>
        <div className="w-full h-1/2 flex justify-between items-center flex-col">
          <div className="text-center">
            <p className="text-3xl font-bold mb-3.5">안녕하세요!</p>
            <p className="text-3xl font-bold">처음이신가요?</p>
          </div>
          <Link to="/join">
            <button className="w-60 h-20 bg-white text-2xl rounded-full hover:bg-mainblue hover:text-white">
              SIGN UP
            </button>
          </Link>
        </div>
      </div>

      <div className="w-1/2 h-screen flex flexCenterAlign flex-col">
        <form className="w-full h-1/2 flex flex-col items-center justify-between">
          <div className="flex flexCenterAlign flex-col gap-7">
            <h1 className="mb-10 font-sans text-mainblue text-3xl font-bold">
              ALLREVIEW
            </h1>
            <input
              className="w-80 p-2.5 text-base border border-buttongray rounded-md focus:outline-none"
              type="text"
              placeholder="이메일을 입력해주세요."
            />
            <input
              className="w-80 p-2.5 text-base border border-buttongray rounded-md focus:outline-none"
              type="password"
              placeholder="비밀번호를 입력해주세요."
            />
            <p className="text-mainred text-sm">
              이메일/비밀번호가 일치하지 않습니다.
            </p>
          </div>

          <div className="flexCenterAlign gap-1.5">
            <button className="w-60 h-20 bg-mainblue text-2xl text-white rounded-full">
              SIGN IN
            </button>
          </div>
        </form>
        <Link to="/findpw" className="fixed bottom-40">
          <span className="text-sm">비밀번호 찾기</span>
        </Link>
      </div>
    </div>
  );
};
