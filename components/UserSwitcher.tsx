import React from 'react';
import { User, Role, View } from '../types';

interface UserSwitcherProps {
  users: User[];
  currentUser: User;
  setCurrentUser: (user: User) => void;
  setView: (view: View) => void;
}

const UserSwitcher: React.FC<UserSwitcherProps> = ({ users, currentUser, setCurrentUser, setView }) => {
  const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedUser = users.find(u => u.id === e.target.value);
    if (selectedUser) {
      setCurrentUser(selectedUser);
      if (selectedUser.role === Role.ADMIN) {
        setView({ type: 'admin' });
      } else {
        setView({ type: 'user_dashboard' });
      }
    }
  };

  return (
    <div className="flex items-center space-x-2">
        <span className="text-sm font-medium text-white hidden sm:inline">Viewing as:</span>
        <select
            value={currentUser.id}
            onChange={handleUserChange}
            className="bg-white/20 text-white border-none rounded-md py-1 pl-2 pr-8 text-sm focus:ring-2 focus:ring-white focus:outline-none"
            aria-label="Switch user view"
        >
            {users.map(user => (
            <option key={user.id} value={user.id} className="text-black">
                {user.name} ({user.role})
            </option>
            ))}
        </select>
    </div>
  );
};

export default UserSwitcher;