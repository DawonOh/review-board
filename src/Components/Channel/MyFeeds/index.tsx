import Styled from 'styled-components';
import { Link } from 'react-router-dom';
import HeartIconImg from '../../../assets/images/heart.png';
import ViewIconImg from '../../../assets/images/view.png';
import { flexCenterAlign } from 'Styles/CommonStyle';

const WriterFeedItem = Styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  &:hover {
    box-shadow: 1px 1px 3px 1px #f3f3f3;
    transition-duration: 300ms;
  }
  &:not(:hover) {
    transition-duration: 300ms;
  }
  @media (max-width: 767px) {
    padding: 1em;
    flex-direction: column;
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
  @media (max-width: 767px) {
    min-width: 1em;
  }
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
  word-break: break-all;
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
  @media (max-width: 767px) {
    width: auto;
    margin-bottom: 0.3em;
    text-align: center;
  }
`;

const ItemBottomInfo = Styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TopInfo = Styled.div`
  display: flex;
  gap: 0.8em;
  @media (max-width: 767px) {
    flex-direction: column;
    gap: 0;
    margin-bottom: 0.5em;
  }
`;

const Icon = Styled.img`
  width: 0.85em;
  margin-right: 0.3em;
`;

const Flex = Styled.div`
  display: flex;
  gap: 1em;
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
    <WriterFeedItem>
      <ItemMain>
        <Index>{index + 1}</Index>
        <Link to={'/feed/' + userFeeds.id}>
          <ItemInfo>
            <TopInfo>
              <Category>{userFeeds.category}</Category>
              <Flex>
                <div>
                  <Icon src={HeartIconImg} alt="좋아요 수 아이콘" />
                  {userFeeds.likeCnt}
                </div>
                <div>
                  <Icon src={ViewIconImg} alt="조회수 아이콘" />
                  {userFeeds.viewCnt}
                </div>
              </Flex>
            </TopInfo>
            <ItemTitle>{userFeeds.title}</ItemTitle>
            <ItemContent>{userFeeds.content}</ItemContent>
            <ItemBottomInfo>
              <ItemDates>{userFeeds.createdAt.slice(0, -8)}</ItemDates>
            </ItemBottomInfo>
          </ItemInfo>
        </Link>
      </ItemMain>
      {userFeeds.imgUrl && <ItemImg src={userFeeds.imgUrl} />}
    </WriterFeedItem>
  );
};
