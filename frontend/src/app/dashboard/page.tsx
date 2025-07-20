'use client';

import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { usersAPI } from '@/lib/api';
import { LogOut, Users, User, Shield } from 'lucide-react';
import { User as UserType } from '@/types/auth';

export default function DashboardPage() {
  const { user, logout, isAuthenticated, isLoading } = useAuth();

  const { data: users, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['users'],
    queryFn: () => usersAPI.getUsers().then(res => res.data),
    enabled: isAuthenticated,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">로딩 중...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">로그인이 필요합니다.</div>
      </div>
    );
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return <Shield className="h-5 w-5 text-red-500" />;
      case 'SELLER':
        return <User className="h-5 w-5 text-blue-500" />;
      default:
        return <User className="h-5 w-5 text-gray-500" />;
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return '관리자';
      case 'SELLER':
        return '판매자';
      case 'CUSTOMER':
        return '고객';
      default:
        return role;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Task Master</h1>
              <p className="text-gray-600">관리 시스템</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user?.name}
                </p>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
              <button
                onClick={logout}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <LogOut className="h-4 w-4" />
                <span>로그아웃</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      총 사용자
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {isLoadingUsers ? '로딩 중...' : users?.length || 0}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Shield className="h-6 w-6 text-red-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      관리자
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {isLoadingUsers
                        ? '로딩 중...'
                        : users?.filter((u: UserType) => u.role === 'ADMIN')
                            .length || 0}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <User className="h-6 w-6 text-blue-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      일반 사용자
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {isLoadingUsers
                        ? '로딩 중...'
                        : users?.filter((u: UserType) => u.role === 'CUSTOMER')
                            .length || 0}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 사용자 목록 */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              사용자 목록
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              시스템에 등록된 모든 사용자
            </p>
          </div>
          <div className="border-t border-gray-200">
            {isLoadingUsers ? (
              <div className="px-4 py-8 text-center text-gray-500">
                사용자 목록을 불러오는 중...
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {users?.map((user: UserType) => (
                  <li key={user.id} className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          {getRoleIcon(user.role)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {getRoleText(user.role)}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
