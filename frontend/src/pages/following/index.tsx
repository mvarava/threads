import { useSelector } from 'react-redux';
import { selectCurrent } from '../../features/user/userSlice';
import { Link } from 'react-router-dom';
import { Card, CardBody } from '@nextui-org/react';
import { User } from '../../components/user';

export const Following = () => {
  const currentUser = useSelector(selectCurrent);

  if (!currentUser) {
    return null;
  }

  return currentUser.following.length > 0 ? (
    <div className="gap-5 flex flex-col">
      {currentUser.following.map((user) => (
        <Link to={`/users/${user.following._id}`} key={user.following._id}>
          <Card>
            <CardBody className="block">
              <User
                name={user.following.name ?? ''}
                avatarUrl={user.following.avatarUrl ?? ''}
                description={user.following.email ?? ''}
              />
            </CardBody>
          </Card>
        </Link>
      ))}
    </div>
  ) : (
    <h1>You have 0 followings</h1>
  );
};
