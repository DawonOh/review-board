import { Link } from 'react-router-dom';
import { symbolListType } from 'util/feed-http';

export const LikeListItem = ({ feedData }: { feedData: symbolListType }) => {
  return (
    <div className="flex md:justify-between justify-start md:flex-row flex-col md:items-center items-start w-full p-8 bg-white rounded-lg cursor-pointer hover:-translate-y-0.5 hover:duration-300 [&:not(:hover)]:translate-y-0.5 [&:not(:hover)]:duration-300">
      <Link
        to={`/feed/${feedData.feed.id}`}
        className="w-11/12 md:inline flex flex-col"
      >
        <div className="text-xl font-bold">{feedData.feed.title}</div>
        <div className="text-sm text-textgray">
          {feedData.created_at.slice(0, 10)}
        </div>
      </Link>
    </div>
  );
};
