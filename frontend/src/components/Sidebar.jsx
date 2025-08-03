import React, { useEffect } from 'react'
import { useChatStore } from '../store/useChatStore';
import SidebarSkeleton from './skeletons/SidebarSkeleton';
import { Users } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useState } from 'react';

const Sidebar = () => {
    const {getUsers, isUsersLoading, users, selectedUser, setSelectedUser} = useChatStore();

    const {onlineUsers} =  useAuthStore();
    const [showOnlineOnly, setShowOnlineOnly] = useState(false);
    // console.log("users:", users);

    useEffect(() => {
        getUsers();
    }, [getUsers]);

    const filteredUsers = showOnlineOnly
        ? users.filter(user => onlineUsers.includes(user._id))
        : users;

    if(isUsersLoading) {
        return (
            <SidebarSkeleton/>
        )
    }
  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>
        {/* Online filter toggle */}
        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">({onlineUsers.length - 1} online)</span>
        </div>
        </div>

        <div>
          <div className="overflow-y-auto w-full py-3">
            
            {users.length > 0 ? (
              
               users.map((user) => (
              <button
                key={user._id}
                className={`w-full p-3 flex items-center gap-3 cursor-pointer hover:bg-base-300 transition-colors ${
                  selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""
                }`}
                onClick={() => setSelectedUser(user)}
              >
                <div className="relative mx-auto lg:mx-0">
                  <img
                    src={user.profilePic || "/user.png"}
                    alt={user.fullName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  {onlineUsers.includes(user._id) && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                  )}
                </div>

                {/* user info - only visible on larger screens */}

                <div className="hidden lg:block text-left min-w-0">
                  <h3 className="text-sm font-medium">{user.fullName}</h3>
                  <div className="text-xs text-gray-500">
                    {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                  </div>
                </div>
              
              </button>
            ))
          ) : (
  <p className="text-center text-sm text-gray-500">No users found</p>
)}
        </div>

        {filteredUsers.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <p className="text-center text-sm text-gray-500">No online users</p>
          </div>
        )}
      </div>
    </aside>
  )
}

export default Sidebar