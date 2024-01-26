import { useEffect, useRef, useState } from 'react';
import QuestionMark from '../../../assets/images/question.png';
import { EstimationType } from 'util/feed-http';

interface EstimationPropstype {
  estimationList: EstimationType[] | undefined;
  setSelectedLike: (arg: number | undefined) => void;
  selectedLike: number | undefined;
}

const Estimation = ({
  estimationList,
  setSelectedLike,
  selectedLike,
}: EstimationPropstype) => {
  // 좋아요 설명 모달창 오픈 여부
  const [isQuestionOpen, setIsQuestionOpen] = useState(false);

  const handleChange = (id: number) => {
    setSelectedLike(id);
  };

  // 좋아요 안내 알림창? 모달창? ref
  const QuestionDivRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 시 닫는 로직
  useEffect(() => {
    const closeClickOutside = (e: any) => {
      if (
        QuestionDivRef.current &&
        !QuestionDivRef.current.contains(e.target as Node)
      ) {
        setIsQuestionOpen(false);
      }
    };
    document.addEventListener('click', closeClickOutside);
    return () => {
      document.removeEventListener('click', closeClickOutside);
    };
  }, [QuestionDivRef]);

  return (
    <div className="flex md:items-center items-start md:gap-4 md:flex-row flex-col md:h-16 h-24">
      <div className="flex gap-4">
        {estimationList?.map(estimation => {
          return (
            <div
              key={estimation.id}
              className={`flex gap-4 w-8 h-8 ${
                selectedLike === estimation.id &&
                'border-2 border-mainblue rounded-full'
              }`}
            >
              <button
                type="button"
                id={estimation.id.toString()}
                onClick={() => handleChange(estimation.id)}
              >
                <img
                  className="w-1.5rem cursor-pointer"
                  src={estimation.img}
                  alt={estimation.estimation}
                />
              </button>
            </div>
          );
        })}
      </div>
      <div className="flexCenterAlign h-24" ref={QuestionDivRef}>
        <img
          className="w-1.5rem cursor-pointer"
          src={QuestionMark}
          alt="도움말"
          onClick={() => {
            setIsQuestionOpen(!isQuestionOpen);
          }}
        />
        <div
          className={`${
            isQuestionOpen ? 'block' : 'hidden'
          } px-4 py-2 text-sm bg-white rounded-lg z-50`}
        >
          <p>리뷰하는 주제에 대한 평가를 선택해주세요.</p>
          <p>매우 좋아요 / 좋아요 / 별로예요</p>
        </div>
      </div>
    </div>
  );
};

export default Estimation;
