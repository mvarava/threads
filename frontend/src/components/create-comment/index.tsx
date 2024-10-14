import { useParams } from 'react-router-dom';
import { Button, Textarea } from '@nextui-org/react';
import { IoMdCreate } from 'react-icons/io';

import { useLazyGetPostByIdQuery } from '../../app/services/postsApi';
import { Controller, useForm } from 'react-hook-form';
import { ErrorMessage } from '../error-message';
import { useCreateCommentMutation } from '../../app/services/commentsApi';

export const CreateComment = () => {
  const { id } = useParams<{ id: string }>();
  const [createComment] = useCreateCommentMutation();
  const [getPostById] = useLazyGetPostByIdQuery();

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm();

  const error = errors?.post?.message as string;

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (id) {
        const post = await getPostById(id).unwrap();
        await createComment({ content: data.comment, postId: post }).unwrap();
        await getPostById(id).unwrap();
        setValue('comment', '');
      }
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <form className="flex-grow" onSubmit={onSubmit}>
      <Controller
        name="comment"
        control={control}
        defaultValue=""
        rules={{
          required: 'Required field',
        }}
        render={({ field }) => (
          <Textarea
            {...field}
            labelPlacement="outside"
            placeholder="Write your comment"
            className="mb-5"
          />
        )}
      />

      {errors && <ErrorMessage error={error} />}

      <Button color="primary" className="flex-end" endContent={<IoMdCreate />} type="submit">
        Comment
      </Button>
    </form>
  );
};
