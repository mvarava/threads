import { useForm } from 'react-hook-form';
import { Button, Link } from '@nextui-org/react';
import { useState } from 'react';
import { useRegisterMutation } from '../../app/services/usersApi';
import { hasErrorField } from '../../utils/has-error-field';
import { Input } from '../../components/input';
import { ErrorMessage } from '../../components/error-message';

type Register = {
  email: string;
  name: string;
  password: string;
};

type Props = {
  setSelected: (value: string) => void;
};

export const Register = ({ setSelected }: Props) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Register>({
    mode: 'onChange',
    reValidateMode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
      name: '',
    },
  });

  const [register, { isLoading }] = useRegisterMutation();
  const [error, setError] = useState('');

  const onSubmit = async (data: Register) => {
    try {
      await register(data).unwrap();
      setSelected('login');
    } catch (err) {
      if (hasErrorField(err)) {
        setError(err.data.error);
      }
    }
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <Input control={control} required="Required Field" label="Name" name="name" type="text" />
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
        Have an account?{' '}
        <Link size="sm" className="cursor-pointer" onPress={() => setSelected('login')}>
          Log In
        </Link>
      </p>
      <div className="flex gap-2 justify-end">
        <Button fullWidth color="primary" type="submit" isLoading={isLoading}>
          Sign Up
        </Button>
      </div>
    </form>
  );
};
