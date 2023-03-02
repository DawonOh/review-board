import React, { useEffect, useState } from 'react';
import Styled from 'styled-components';
import { ButtonLayout } from 'Styles/CommonStyle';
import LockImg from '../../assets/images/lock.png';

const MainCommentContainer = Styled.div`
  width: 90%;
  margin: 1em auto;
  padding: 1em;
  border-left: 2px solid #f1f1f1;
`;

const InfoDiv = Styled.div`
  display: flex;
  align-items: flex-end;
  gap: 0.5em;
`;

const Writer = Styled.span`
  font-weight: 700;
`;

const WriteDate = Styled.span`
  font-size: 0.8em;
  color: #D3D3D3;
`;

const Content = Styled.div`
  margin-top: 0.5em;
  line-height: 1.1em;
`;

const LockIcon = Styled.div`
  width: 1em;
  height: 1em;
  background: url(${LockImg});
  background-repeat: no-repeat;
  background-size: cover;
  cursor: pointer;
`;

const Buttons = Styled.div`
  display: flex;
  align-items: center;
  gap: 0.2em;
`;

const ModifyDeleteButton = Styled.button<{ isDelete?: boolean }>`
  ${ButtonLayout}
  font-size: 0.8em;
  color: #fff;
  background-color: ${props => (props.isDelete ? '#C1C1C1' : '#CDDEFF')};
  cursor: pointer;
`;

interface MainCommentProps {
  nickname: string;
  createdAt: string;
  comment: string;
  isPrivate: boolean;
  deletedAt: string | null;
}
export const MainComment = ({
  nickname,
  createdAt,
  comment,
  isPrivate,
  deletedAt,
}: MainCommentProps) => {
  const [specificComment, setSpecificComment] = useState(comment);

  const createAtDate = createdAt.slice(0, -8);

  useEffect(() => {
    if (deletedAt) {
      setSpecificComment('삭제된 댓글입니다.');
      return;
    }
    if (isPrivate) {
      setSpecificComment('비밀댓글입니다.');
      return;
    }
    setSpecificComment(comment);
    return;
  }, [comment, isPrivate, deletedAt]);

  return (
    <MainCommentContainer>
      <InfoDiv>
        <Writer>{isPrivate || deletedAt ? '-' : nickname}</Writer>
        <WriteDate>{createAtDate}</WriteDate>
        {isPrivate && deletedAt === null && <LockIcon />}
        <Buttons>
          <ModifyDeleteButton>수정</ModifyDeleteButton>
          <ModifyDeleteButton isDelete>삭제</ModifyDeleteButton>
        </Buttons>
      </InfoDiv>
      <Content>{specificComment}</Content>
    </MainCommentContainer>
  );
};
