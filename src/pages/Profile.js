import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Mail, User, Shield, Calendar } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <div className="text-center">
            <div className="mx-auto h-32 w-32 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center">
              {user?.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="h-32 w-32 rounded-full object-cover"
                />
              ) : (
                <User size={64} className="text-white" />
              )}
            </div>
            <h2 className="mt-4 text-2xl font-bold text-gray-900">{user?.name}</h2>
            <p className="mt-2 text-sm text-gray-600">Welcome to your profile</p>
          </div>

          <div className="mt-8 space-y-6">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Email</p>
                <p className="text-sm text-gray-600">{user?.email}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Shield className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Verification Status</p>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  user?.isVerified 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {user?.isVerified ? 'Verified' : 'Pending Verification'}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Member Since</p>
                <p className="text-sm text-gray-600">
                  {new Date(user?.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;