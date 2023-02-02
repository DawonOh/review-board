import React, { Fragment } from 'react';
import Styled from 'styled-components';

import { Card } from 'Components/Card';

const CardListContainer = Styled.main`
  display: grid;
  grid-template-columns: repeat(auto-fill,minmax(300px, 1fr));
  justify-content: space-around;
  align-items: center;
  width: 80%;
  height: 100%;
  padding: 2em;
  margin: 0 auto;
  gap: 2em;
  @media all and (max-width: 1023px) {
    width: 80%;
  }
`;

export const CardList = () => {
  return (
    <CardListContainer>
      <Card
        title="제목입니다1"
        category="도서"
        content="통신·방송의 시설기준과 신문의 기능을 보장하기 위하여 필요한 사항은 법률로 정한다. 대통령은 법률이 정하는 바에 의하여 사면·감형 또는 복권을 명할 수 있다. 국회는 상호원조 또는 안전보장에 관한 조약, 중요한 국제조직에 관한 조약, 우호통상항해조약, 주권의 제약에 관한 조약, 강화조약, 국가나 국민에게 중대한 재정적 부담을 지우는 조약 또는 입법사항에 관한 조약의 체결·비준에 대한 동의권을 가진다."
        img="https://images.unsplash.com/photo-1589998059171-988d887df646?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1176&q=80"
        isLike={true}
        file="https://s3.us-west-2.amazonaws.com/secure.notion-static.com/5373075d-7aa0-4cff-b314-0bd607392396/front-%EC%83%81%EC%84%B8%EA%B8%B0%EB%8A%A54%EC%B0%A8.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20230202%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20230202T001847Z&X-Amz-Expires=86400&X-Amz-Signature=c8c301740267a5754d9524f595a1a0fc3ee3c69a1ebadac51027f9bdd9bf4903&X-Amz-SignedHeaders=host&response-content-disposition=filename%3D%22front-%25EC%2583%2581%25EC%2584%25B8%25EA%25B8%25B0%25EB%258A%25A54%25EC%25B0%25A8.pdf%22&x-id=GetObject"
        likeCount={1}
        commentCount={1}
      />
      <Card
        title="제목입니다2"
        category="영화"
        content="감사원은 원장을 포함한 5인 이상 11인 이하의 감사위원으로 구성한다. 모든 국민은 양심의 자유를 가진다. 정기회의 회기는 100일을, 임시회의 회기는 30일을 초과할 수 없다. 명령·규칙 또는 처분이 헌법이나 법률에 위반되는 여부가 재판의 전제가 된 경우에는 대법원은 이를 최종적으로 심사할 권한을 가진다. 국가는 재해를 예방하고 그 위험으로부터 국민을 보호하기 위하여 노력하여야 한다. 대통령은 취임에 즈음하여 다음의 선서를 한다. 중앙선거관리위원회는 법령의 범위안에서 선거관리·국민투표관리 또는 정당사무에 관한 규칙을 제정할 수 있으며, 법률에 저촉되지 아니하는 범위안에서 내부규율에 관한 규칙을 제정할 수 있다."
        isLike={false}
        likeCount={2}
        commentCount={2}
      />
      <Card
        title="제목입니다3"
        category="장난감"
        content="원장은 국회의 동의를 얻어 대통령이 임명하고, 그 임기는 4년으로 하며, 1차에 한하여 중임할 수 있다."
        isLike={false}
        likeCount={3}
        commentCount={3}
      />
      <Card
        title="제목입니다4"
        category="생활"
        content="대통령의 국법상 행위는 문서로써 하며, 이 문서에는 국무총리와 관계 국무위원이 부서한다. 군사에 관한 것도 또한 같다."
        isLike={false}
        likeCount={4}
        commentCount={4}
      />
      <Card
        title="제목입니다5"
        category="도서"
        content="헌법재판소는 법률에 저촉되지 아니하는 범위안에서 심판에 관한 절차, 내부규율과 사무처리에 관한 규칙을 제정할 수 있다."
        isLike={false}
        likeCount={5}
        commentCount={5}
      />
      <Card
        title="제목입니다6"
        category="영화"
        content="국가는 농·어민과 중소기업의 자조조직을 육성하여야 하며, 그 자율적 활동과 발전을 보장한다."
        isLike={false}
        likeCount={6}
        commentCount={6}
      />
      <Card
        title="제목입니다7"
        category="장난감"
        img="https://images.unsplash.com/photo-1582845512747-e42001c95638?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
        content="국회가 재적의원 과반수의 찬성으로 계엄의 해제를 요구한 때에는 대통령은 이를 해제하여야 한다."
        isLike={false}
        likeCount={7}
        commentCount={7}
      />
      <Card
        title="제목입니다8"
        category="생활"
        content="형사피고인은 유죄의 판결이 확정될 때까지는 무죄로 추정된다."
        isLike={false}
        likeCount={8}
        commentCount={8}
      />
    </CardListContainer>
  );
};
