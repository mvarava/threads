import { Card } from '../../components/card';
import { CreatePost } from '../../components/create-post';
import { useGetAllPostsQuery } from '../../app/services/postsApi';

export const Posts = () => {
  const { data } = useGetAllPostsQuery();

  return (
    <>
      <div className="mb-10 w-full flex">
        <CreatePost />
      </div>
      {data && data.length > 0
        ? data.map(({ content, author, _id, comments, likes, likedByUser, createdAt }) => (
            <Card
              key={_id}
              avatarUrl={author.avatarUrl ?? ''}
              content={content}
              name={author.name ?? ''}
              likesCount={likes.length}
              commentsCount={comments.length}
              authorId={author._id}
              id={_id}
              likedByUser={likedByUser}
              createdAt={createdAt}
              cardFor="post"
            />
          ))
        : null}
    </>
  );
};
