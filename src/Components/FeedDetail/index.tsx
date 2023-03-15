import React, { Fragment, useState } from 'react';
import Styled from 'styled-components';
import DoubleLikeImg from '../../assets/images/double-like.png';
import HeartIconImg from '../../assets/images/heart.png';
import LikeIconImg from '../../assets/images/like.png';
import { flexCenterAlign, ButtonLayout } from 'Styles/CommonStyle';
import { useParams } from 'react-router-dom';

const TitleContainer = Styled.div`
  display: flex;
  align-items: center;
  width: 70%;
  margin: 0 auto;
  padding: 0.3em;
  gap: 1em;
  border-bottom: 2px solid #f1f1f1;
`;

const LikeByWriter = Styled.div`
  width: 1.5em;
  height: 1.5em;
  min-width: 1.5em;
  min-height: 1.5em;
  background: url(${DoubleLikeImg});
  background-repeat: no-repeat;
	background-size: cover;
`;

const Title = Styled.h1`
  font-size: 1.5em;
  font-weight: 700;
`;

const ContentContainer = Styled.div`
  ${flexCenterAlign}
  flex-direction: column;
  margin-top: 1em;
  gap: 1em;
`;

const BothSideContainer = Styled.div`
  display: flex;
  width: 70%;
  justify-content: space-between;
  align-items: center;
  margin-top: 2em;
  @media (max-width: 767px) {
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: 1em;
  }
`;

const MainImg = Styled.img`
  width: 70%;
`;
const Content = Styled.div`
  width: 70%;
  white-space: pre-wrap;
  line-height: 1.3em;
`;

const LikeContainer = Styled.div`
  display: flex;
  align-items: center;
  gap: 0.5em;
`;
const LikeIcon = Styled.div<{ isLike: boolean }>`
  min-width: 2em;
  min-height: 2em;
  background: url(${props => (props.isLike ? LikeIconImg : HeartIconImg)});
  background-repeat: no-repeat;
  background-size: cover;
  cursor: pointer;
`;

const WriterInfo = Styled.span`
  font-weight: 700;
`;

const Dates = Styled.div`
  font-size: 0.8em;
`;
const Buttons = Styled.div`
  ${flexCenterAlign}
  gap: 0.2em;

`;
const ModifyDeleteButton = Styled.button<{ text: string }>`
  ${ButtonLayout}
  font-size: 0.8em;
  color: #fff;
  background-color: ${props => (props.text === '수정' ? '#676FA3' : '#FF5959')};
  cursor: pointer;
`;

export const FeedDetail = () => {
  const [isLike, setIsLike] = useState(false);

  const params = useParams();
  let feedId = params.id;

  const handleClickLike = () => {
    setIsLike(!isLike);
  };
  return (
    <Fragment>
      <TitleContainer>
        <LikeByWriter />
        <Title>안녕하세요! 테스트용 게시물입니다. 클릭하지 말아주세요</Title>
      </TitleContainer>
      <ContentContainer>
        <BothSideContainer>
          <div>
            <Dates>23.01.03 작성</Dates>
            <Dates>23.01.04 편집</Dates>
          </div>
          <Buttons>
            <ModifyDeleteButton text="수정">수정</ModifyDeleteButton>
            <ModifyDeleteButton text="삭제">삭제</ModifyDeleteButton>
          </Buttons>
        </BothSideContainer>
        <MainImg
          src="http://dummyimage.com/1920x1080.png/dddddd/000000"
          alt="메인이미지1"
        />
        <Content>
          국회는 의원의 자격을 심사하며, 의원을 징계할 수 있다. 모든 국민은
          법률이 정하는 바에 의하여 공무담임권을 가진다. <br />
          대한민국은 통일을 지향하며, 자유민주적 기본질서에 입각한 평화적 통일
          정책을 수립하고 이를 추진한다. <br />
          <br />
          헌법재판소 재판관은 정당에 가입하거나 정치에 관여할 수 없다. 대통령은
          국무총리·국무위원·행정각부의 장 기타 법률이 정하는 공사의 직을 겸할 수
          없다.
          <br />
          헌법개정안은 국회가 의결한 후 30일 이내에 국민투표에 붙여
          국회의원선거권자 과반수의 투표와 투표자 과반수의 찬성을 얻어야 한다.
          이 헌법에 의한 최초의 대통령의 임기는 이 헌법시행일로부터 개시한다.
          국가는 농·어민과 중소기업의 자조조직을 육성하여야 하며,
          <br />
          <br />그 자율적 활동과 발전을 보장한다.
          <br />
          <br />
          모든 국민은 소급입법에 의하여 참정권의 제한을 받거나 재산권을
          박탈당하지 아니한다. <br />
          국채를 모집하거나 예산외에 국가의 부담이 될 계약을 체결하려 할 때에는
          정부는 미리 국회의 의결을 얻어야 한다. 형사피고인은 유죄의 판결이
          확정될 때까지는 무죄로 추정된다. <br />
          새로운 회계연도가 개시될 때까지 예산안이 의결되지 못한 때에는 정부는
          국회에서 예산안이 의결될 때까지 다음의 목적을 위한 경비는 전년도
          예산에 준하여 집행할 수 있다. <br />
          <br />이 헌법에 의한 최초의 대통령의 임기는 이 헌법시행일로부터
          개시한다. 모든 국민은 행위시의 법률에 의하여 범죄를 구성하지 아니하는
          행위로 소추되지 아니하며, 동일한 범죄에 대하여 거듭 처벌받지 아니한다.
          지방자치단체는 주민의 복리에 관한 사무를 처리하고 재산을 관리하며,
          법령의 범위안에서 자치에 관한 규정을 제정할 수 있다. 국가는 재해를
          예방하고 그 위험으로부터 국민을 보호하기 위하여 노력하여야 한다.
          <br />
          국무위원은 국정에 관하여 대통령을 보좌하며, 국무회의의 구성원으로서
          국정을 심의한다. 모든 국민은 인간으로서의 존엄과 가치를 가지며, 행복을
          추구할 권리를 가진다. 국가는 개인이 가지는 불가침의 기본적 인권을
          확인하고 이를 보장할 의무를 진다. 농업생산성의 제고와 농지의 합리적인
          이용을 위하거나 불가피한 사정으로 발생하는 농지의 임대차와 위탁경영은
          법률이 정하는 바에 의하여 인정된다.
          <br />
          <br />
          국가는 모성의 보호를 위하여 노력하여야 한다. 대통령은 제4항과 제5항의
          규정에 의하여 확정된 법률을 지체없이 공포하여야 한다. 제5항에 의하여
          법률이 확정된 후 또는 제4항에 의한 확정법률이 정부에 이송된 후 5일
          이내에 대통령이 공포하지 아니할 때에는 국회의장이 이를 공포한다.
          대한민국의 주권은 국민에게 있고, 모든 권력은 국민으로부터 나온다.{' '}
          <br />
          예비비는 총액으로 국회의 의결을 얻어야 한다. 예비비의 지출은
          차기국회의 승인을 얻어야 한다. 지방자치단체는 주민의 복리에 관한
          사무를 처리하고 재산을 관리하며, 법령의 범위안에서 자치에 관한 규정을
          제정할 수 있다. 대통령의 임기연장 또는 중임변경을 위한 헌법개정은 그
          헌법개정 제안 당시의 대통령에 대하여는 효력이 없다.
          <br />
          국가는 농지에 관하여 경자유전의 원칙이 달성될 수 있도록 노력하여야
          하며, 농지의 소작제도는 금지된다. 국회는 의장 1인과 부의장 2인을
          선출한다. 모든 국민은 자기의 행위가 아닌 친족의 행위로 인하여 불이익한
          처우를 받지 아니한다.
          <br />
          대한민국은 통일을 지향하며, 자유민주적 기본질서에 입각한 평화적 통일
          정책을 수립하고 이를 추진한다. 환경권의 내용과 행사에 관하여는 법률로
          정한다. 탄핵소추의 의결을 받은 자는 탄핵심판이 있을 때까지 그
          권한행사가 정지된다. <br />
          <br />
          정당의 목적이나 활동이 민주적 기본질서에 위배될 때에는 정부는
          헌법재판소에 그 해산을 제소할 수 있고, 정당은 헌법재판소의 심판에
          의하여 해산된다.
        </Content>
        <BothSideContainer>
          <LikeContainer>
            <LikeIcon isLike={isLike} onClick={handleClickLike} />
            <span>10</span>
          </LikeContainer>
          <WriterInfo>by 닉네임이아주긴사람</WriterInfo>
        </BothSideContainer>
      </ContentContainer>
    </Fragment>
  );
};
