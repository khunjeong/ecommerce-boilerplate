'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { authAPI } from '@/lib/api';
import { AuthState, LoginRequest, RegisterRequest, User } from '@/types/auth';

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });

  const router = useRouter();
  const queryClient = useQueryClient();

  // 초기 로드 시 토큰 확인
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthState(prev => ({
        ...prev,
        token,
        isAuthenticated: true,
        isLoading: false,
      }));
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  // 프로필 조회
  const { data: user, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['profile'],
    queryFn: () => authAPI.getProfile().then(res => res.data),
    enabled: authState.isAuthenticated,
    retry: false,
  });

  // 사용자 정보 업데이트
  useEffect(() => {
    if (user) {
      setAuthState(prev => ({ ...prev, user }));
    }
  }, [user]);

  // 로그인
  const loginMutation = useMutation({
    mutationFn: (credentials: LoginRequest) =>
      authAPI.login(credentials.email, credentials.password),
    onSuccess: response => {
      const { access_token, user } = response.data;
      localStorage.setItem('token', access_token);
      setAuthState({
        user,
        token: access_token,
        isAuthenticated: true,
        isLoading: false,
      });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      router.push('/dashboard');
    },
    onError: error => {
      console.error('Login failed:', error);
    },
  });

  // 회원가입
  const registerMutation = useMutation({
    mutationFn: (userData: RegisterRequest) => authAPI.register(userData),
    onSuccess: () => {
      router.push('/login?message=회원가입이 완료되었습니다. 로그인해주세요.');
    },
    onError: error => {
      console.error('Registration failed:', error);
    },
  });

  // 로그아웃
  const logout = () => {
    localStorage.removeItem('token');
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
    queryClient.clear();
    router.push('/login');
  };

  return {
    ...authState,
    isLoading: authState.isLoading || isLoadingProfile,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout,
    isLoginLoading: loginMutation.isPending,
    isRegisterLoading: registerMutation.isPending,
  };
}
