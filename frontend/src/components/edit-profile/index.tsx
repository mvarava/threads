import React, { useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
} from '@nextui-org/react';
import { MdOutlineEmail } from 'react-icons/md';

import { useUpdateUserMutation } from '../../app/services/usersApi';
import { User } from '../../app/types';
import { ThemeContext } from '../theme-provider';
import { Input } from '../input';
import { ErrorMessage } from '../error-message';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  user?: User;
};

export const EditProfile: React.FC<Props> = ({ isOpen, onClose, user }) => {
  const { theme } = useContext(ThemeContext);
  const [updateUser, { isLoading }] = useUpdateUserMutation();
  const [error, setError] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { id } = useParams<{ id: string }>();
  const { handleSubmit, control } = useForm<User>({
    mode: 'onChange',
    reValidateMode: 'onBlur',
    defaultValues: {
      email: user?.email,
      name: user?.name,
      dateOfBirth: user?.dateOfBirth,
      bio: user?.bio,
      location: user?.location,
    },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} className={`${theme} text-foreground`}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Editing profile</ModalHeader>
            <ModalBody>
              <form className="flex flex-col gap-4">
                <Input
                  control={control}
                  name="email"
                  label="Email"
                  type="email"
                  endContent={<MdOutlineEmail />}
                />
                <Input control={control} name="name" label="Name" type="name" />
                <input type="file" name="avatarUrl" placeholder="Insert File" />
                <Input
                  control={control}
                  name="dateOfBirth"
                  label="Date Of Birth"
                  type="date"
                  placeholder="Date Of Birth"
                />
                <Controller
                  name="bio"
                  control={control}
                  render={({ field }) => <Textarea {...field} rows={4} placeholder="Your bio" />}
                />
                <Input control={control} name="location" label="Location" type="text" />
                <ErrorMessage error={error} />
              </form>
            </ModalBody>
            <ModalFooter>
              <div className="flex">
                <Button fullWidth color="primary" type="submit" isLoading={isLoading}>
                  Edit
                </Button>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </div>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
