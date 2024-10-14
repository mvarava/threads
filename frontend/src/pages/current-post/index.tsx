import { useParams } from 'react-router-dom';
import { useGetPostByIdQuery } from '../../app/services/postsApi';
import { Card } from '../../components/card';
import { GoBack } from '../../components/go-back';
import { CreateComment } from '../../components/create-comment';

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
      <div className="mt-10">
        <CreateComment />
      </div>
      <div className="mt-10">
        {data.comments
          ? data.comments.map((comment) => (
              <Card
                key={comment._id}
                avatarUrl={comment.user.avatarUrl ?? ''}
                name={comment.user.name ?? ''}
                content={comment.content}
                authorId={comment.user._id}
                id={_id}
                cardFor="comment"
                commentId={comment._id}
              />
            ))
          : null}
      </div>
    </>
  );
};
