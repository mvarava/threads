import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { CardBody, CardFooter, CardHeader, Card as NextUICard, Spinner } from '@nextui-org/react';
import { RiDeleteBinLine } from 'react-icons/ri';
import { FcDislike } from 'react-icons/fc';
import { FaRegComment } from 'react-icons/fa';

import { useLikePostMutation, useUnlikePostMutation } from '../../app/services/likesApi';
import {
  useDeletePostMutation,
  useLazyGetAllPostsQuery,
  useLazyGetPostByIdQuery,
} from '../../app/services/postsApi';
import { useDeleteCommentMutation } from '../../app/services/commentsApi';
import { selectCurrent } from '../../features/user/userSlice';
import { User } from '../user';
import { formatToClientDate } from '../../utils/format-to-client-date';
import { Typography } from '../typography';
import { MetaInfo } from '../meta-info';
import { MdOutlineFavoriteBorder } from 'react-icons/md';
import { ErrorMessage } from '../error-message';

type Props = {
  avatarUrl: string;
  name: string;
  authorId: string;
  content: string;
  commentId?: string;
  likesCount?: number;
  commentsCount?: number;
  createdAt: Date;
  id?: string;
  cardFor: 'comment' | 'post' | 'current-post';
  likedByUser: boolean;
};

export const Card: React.FC<Props> = ({
  avatarUrl = '',
  name = '',
  authorId = '',
  content = '',
  commentId = '',
  likesCount = 0,
  commentsCount = 0,
  createdAt,
  id = '',
  cardFor = 'post',
  likedByUser = false,
}) => {
  const [likePost] = useLikePostMutation();
  const [unlikePost] = useUnlikePostMutation();
  const [triggerGetAllPosts] = useLazyGetAllPostsQuery();
  const [triggerGetPostById] = useLazyGetPostByIdQuery();
  const [deletePost, deletePostStatus] = useDeletePostMutation();
  const [deleteComment, deleteCommentStatus] = useDeleteCommentMutation();

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const currentUser = useSelector(selectCurrent);

  return (
    <NextUICard className="mb-5">
      <CardHeader className="justify-between items-center bg-transparent">
        <Link to={`/users${authorId}`}>
          <User
            name={name}
            className="text-small font-semibold leading-non text-default-600"
            avatarUrl={avatarUrl}
            description={createdAt && formatToClientDate(createdAt)}
          />
        </Link>
        {authorId === currentUser?._id && (
          <div className="cursor-pointer">
            {deletePostStatus.isLoading || deleteCommentStatus.isLoading ? (
              <Spinner />
            ) : (
              <RiDeleteBinLine />
            )}
          </div>
        )}
      </CardHeader>
      <CardBody className="px-3 py-2 mb-5">
        <Typography>{content}</Typography>
      </CardBody>
      {cardFor !== 'comment' && (
        <CardFooter className="gap-3">
          <div className="flex gap-5 items-center">
            <div>
              <MetaInfo
                count={likesCount}
                Icon={likedByUser ? FcDislike : MdOutlineFavoriteBorder}
              />
            </div>
            <Link to={`/posts/${id}`}>
              <MetaInfo count={commentsCount} Icon={FaRegComment} />
            </Link>
          </div>
          <ErrorMessage error={error} />
        </CardFooter>
      )}
    </NextUICard>
  );
};
