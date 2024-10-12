import { useForm } from 'react-hook-form';
import { Button, Link } from '@nextui-org/react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useLazyCurrentQuery, useLoginMutation } from '../../app/services/usersApi';
import { hasErrorField } from '../../utils/has-error-field';
import { Input } from '../../components/input';
import { ErrorMessage } from '../../components/error-message';

type Login = {
  email: string;
  password: string;
};

type Props = {
  setSelected: (value: string) => void;
};

export const Login = ({ setSelected }: Props) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Login>({
    mode: 'onChange',
    reValidateMode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const [login, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [triggerCurrentQuery] = useLazyCurrentQuery();

  const onSubmit = async (data: Login) => {
    try {
      await login(data).unwrap();
      await triggerCurrentQuery().unwrap();
      navigate('/');
    } catch (err) {
      if (hasErrorField(err)) {
        setError(err.data.error);
      }
    }
  };
  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <Input control={control} name="email" label="Email" type="email" required="Required Field" />
      <Input
        control={control}
        name="password"
        label="Password"
        type="password"
        required="Required Field"
      />
      <ErrorMessage error={error} />
      <p className="text-center text-small">
        No aacount yet?{' '}
        <Link size="sm" className="cursor-pointer" onPress={() => setSelected('sign-up')}>
          Sign Up
        </Link>
      </p>
      <div className="flex gap-2 justify-end">
        <Button fullWidth color="primary" type="submit" isLoading={isLoading}>
          Log In
        </Button>
      </div>
    </form>
  );
};
