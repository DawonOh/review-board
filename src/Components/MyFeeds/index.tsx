import Styled from 'styled-components';
import { Link } from 'react-router-dom';
import HeartIconImg from '../../assets/images/heart.png';
import ViewIconImg from '../../assets/images/view.png';
import { flexCenterAlign } from 'Styles/CommonStyle';

const WriterFeedItem = Styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  cursor: pointer;
  &:hover {
    box-shadow: 1px 1px 3px 1px #f3f3f3;
    transition-duration: 300ms;
  }
  &:not(:hover) {
    transition-duration: 300ms;
  }
`;

const ItemInfo = Styled.div`
  width: 100%;
  padding: 1em;
`;

const Index = Styled.div`
  ${flexCenterAlign}
  min-width: 3em;
  height: 100%;
  min-height: 8em;
  background-color: #EEF2FF;
`;

const ItemTitle = Styled.div`
  margin-bottom: 0.3em;
  font-size: 1.1em;
  font-weight: 700;
`;

const ItemContent = Styled.div`
  display: -webkit-box;
  margin-bottom: 1em;
  word-wrap: break-word;
  -webkit-line-clamp: 2;
  -webkit-box-orient:vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ItemImg = Styled.img`
  width: 15em;
  height: 8em;
  object-fit: cover;
`;

const ItemMain = Styled.div`
  ${flexCenterAlign}
  width: 100%;
  justify-content: flex-start;
`;

const ItemDates = Styled.div`
  font-size: 0.8em;
  color: #BDBDBD;
`;

const Category = Styled.div`
  display: inline-block;
  margin-bottom: 1em;
  padding: 0.3em 1em;
  background-color: #CDDEFF;
  color: #fff;
  font-size: 0.85em;
  border-radius: 5px;
`;

const ItemBottomInfo = Styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
`;

const LikeAndView = Styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1em;
`;

const Icon = Styled.img`
  width: 1em;
  margin-right: 0.3em;
`;

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

export const MyFeeds = ({ userFeeds, index }: UserFeedsType) => {
  return (
    <Link to={'/feed/' + userFeeds.id}>
      <WriterFeedItem>
        <ItemMain>
          <Index>{index + 1}</Index>
          <ItemInfo>
            <Category>{userFeeds.category}</Category>
            <ItemTitle>{userFeeds.title}</ItemTitle>
            <ItemContent>{userFeeds.content}</ItemContent>
            <ItemBottomInfo>
              <ItemDates>{userFeeds.createdAt.slice(0, -8)}</ItemDates>
              <LikeAndView>
                <div>
                  <Icon src={HeartIconImg} alt="좋아요 수 아이콘" />
                  {userFeeds.likeCnt}
                </div>
                <div>
                  <Icon src={ViewIconImg} alt="조회수 아이콘" />
                  {userFeeds.viewCnt}
                </div>
              </LikeAndView>
            </ItemBottomInfo>
          </ItemInfo>
        </ItemMain>
        {userFeeds.imgUrl && <ItemImg src={userFeeds.imgUrl} />}
      </WriterFeedItem>
    </Link>
  );
};
