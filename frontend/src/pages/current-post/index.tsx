import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetPostByIdQuery } from '../../app/services/postsApi';
import { Card } from '../../components/card';
import { GoBack } from '../../components/go-back';

export const CurrentPost = () => {
  const params = useParams<{ id: string }>();
  const { data } = useGetPostByIdQuery(params.id ?? '');

  if (!data) {
    return <h2>Post doen not exist</h2>;
  }

  const { _id, content, author, isLikedByUser, createdAt, likes, comments } = data;

  return (
    <>
      <GoBack />
      <Card
        avatarUrl={author.avatarUrl ?? ''}
        name={author.name ?? ''}
        content={content}
        authorId={author._id}
        id={_id}
        likesCount={likes.length}
        commentsCount={comments.length}
        cardFor="current-post"
        isLikedByUser={isLikedByUser}
        createdAt={createdAt}
      />
    </>
  );
};
