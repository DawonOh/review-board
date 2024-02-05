import { Link } from 'react-router-dom';
import Styled from 'styled-components';
import { symbolListType } from 'util/feed-http';

const CreatedAtDiv = Styled.div`
  font-size: 0.9em;
  color: #BDBDBD;
`;

export const LikeListItem = ({ feedData }: { feedData: symbolListType[] }) => {
  return (
    <>
      {feedData.map(data => {
        return (
          <div
            className="w-full p-4 border-b-[#DBDBDB] cursor-pointer"
            key={data.feed.id}
          >
            <Link to={`/feed/${data.feed.id}`}>
              <div className="text-xl font-bold hover:text-mainblue">
                {data.feed.title}
              </div>
            </Link>
            <div className="flex justify-between mt-2">
              <CreatedAtDiv>{data.created_at.slice(0, 10)}</CreatedAtDiv>
            </div>
          </div>
        );
      })}
    </>
  );
};
