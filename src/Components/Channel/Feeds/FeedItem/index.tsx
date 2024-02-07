import { Link } from 'react-router-dom';
import HeartIconImg from '../../../../assets/images/likeCountBlack.png';
import ViewIconImg from '../../../../assets/images/view.png';

interface UserFeedsType {
  userFeeds: {
    category: string;
    categoryId: number;
    commentCnt: string;
    content: string;
    createdAt: string;
    deletedAt: string | null;
    filesCnt: string;
    id: number;
    imgCnt: string;
    imgUrl: string | null;
    likeCnt: string;
    postedAt: string;
    statusId: number;
    title: string;
    updatedAt: string;
    userId: number;
    userNickname: string;
    viewCnt: number;
  };
  index: number;
}

export const FeedItem = ({ userFeeds, index }: UserFeedsType) => {
  return (
    <div className="flex w-full justify-between items-center cursor-pointer bg-white hover:duration-300 [&:not(:hover)]:translate-y-0.5 [&:not(:hover)]:duration-300 rounded-md shadow-md shadow-buttongray">
      <div className="flex w-full justify-start">
        <Link to={'/feed/' + userFeeds.id}>
          <div className="w-full p-4">
            <div className="flex md:flex-row flex-col items-center mb-2">
              <div className=" py-1 px-4 bg-mainsky text-sm rounded-lg mr-4">
                {userFeeds.category}
              </div>
              <img
                className="w-5 h-4 mr-2"
                src={HeartIconImg}
                alt="좋아요 수 아이콘"
              />
              <span className="text-center mr-2">{userFeeds.likeCnt}</span>
              <img
                className="w-6 h-6 mr-2"
                src={ViewIconImg}
                alt="조회수 아이콘"
              />
              <span className="mr-4">{userFeeds.viewCnt}</span>
              <span className="text-sm text-textgray">
                {userFeeds.createdAt.slice(0, -8)}
              </span>
            </div>

            <div className="mb-2 text-xl font-bold">{userFeeds.title}</div>
            <div className="line-clamp-2 whitespace-pre-wrap break-words leading-5 overflow-hidden whitespace-nowrap text-ellipsis">
              {userFeeds.content}
            </div>
          </div>
        </Link>
      </div>
      {userFeeds.imgUrl && (
        <img
          className="w-64 h-full object-cover rounded-r-lg"
          src={userFeeds.imgUrl}
          alt="첨부이미지"
        />
      )}
    </div>
  );
};
