import { Fragment, useCallback, useRef } from 'react';
import CommentItem from '../CommentItem';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getUserCommentList } from 'util/user-http';
import { useAppSelector } from 'hooks';

interface UserCommentListPropsType {
  userId: string | undefined;
}

export const UserCommentList = ({ userId }: UserCommentListPropsType) => {
  let isLogin = useAppSelector(state => state.login.isLogin);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: ['userCommentList'],
      queryFn: ({ pageParam = 1, signal }) =>
        getUserCommentList({ isLogin, pageParam, userId, signal }),
      initialPageParam: 0,
      getNextPageParam: (lastPage, allPages) => {
        const nextPage = allPages.length * 10;
        return lastPage.commentListByUserId.length === 0 ? undefined : nextPage;
      },
      staleTime: 1000 * 60 * 2,
    });

  const commentList = data?.pages.map(comment => comment.commentListByUserId);
  const observer = useRef<IntersectionObserver | null>(null);

  const lastCommentElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (status === 'pending' || isFetchingNextPage) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isFetchingNextPage, hasNextPage, status]
  );

  const myComments = () => {
    if (commentList?.length) {
      return (
        <Fragment>
          <div>댓글 수 : {data?.pages[0].commentCntByUserId}개</div>
          {commentList.map(comments => {
            return comments.map(comment => {
              return (
                <CommentItem
                  key={comment.id}
                  userComments={comment}
                  ref={lastCommentElementRef}
                />
              );
            });
          })}
          {isFetchingNextPage && (
            <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 border-4 border-mainsky rounded-full border-t-4 border-t-white animate-spin" />
          )}
        </Fragment>
      );
    } else {
      return (
        <div className="w-full h-full flexCenterAlign">
          작성한 댓글이 없습니다.
        </div>
      );
    }
  };

  return myComments();
};
