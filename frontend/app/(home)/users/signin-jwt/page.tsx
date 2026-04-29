'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FcGoogle } from 'react-icons/fc'
import { SiNaver } from 'react-icons/si'
import { RiKakaoTalkFill } from 'react-icons/ri'
import { MdEmail } from 'react-icons/md'
import toast from 'react-hot-toast'
import { useAuth } from '@/contexts/AuthContext'
import { login, socialLogin } from '@/utils/authApi'

export default function SignInJWTPage() {
  const router = useRouter()
  const { isAuthenticated, login: authLogin } = useAuth()
  const [isEmailLogin, setIsEmailLogin] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      toast.error('이메일과 비밀번호를 입력해주세요')
      return
    }

    setLoading(true)

    try {
      const response = await login(email, password)

      if (response.success && response.data) {
        authLogin(response.data.user, {
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken,
        })
        router.replace('/')
        toast.success('로그인에 성공했습니다')
      } else {
        toast.error(response.error || '로그인에 실패했습니다')
      }
    } catch (error) {
      console.error('로그인 오류:', error)
      toast.error('로그인 중 오류가 발생했습니다')
    } finally {
      setLoading(false)
    }
  }

  const handleSocialLogin = async (provider: string) => {
    try {
      // 실제 소셜 로그인 구현은 OAuth 플로우가 필요합니다.
      // 여기서는 테스트용으로 더미 데이터를 사용합니다.
      const testUser = {
        name: `${provider} User`,
        email: `test@${provider}.com`,
        image: null,
      }

      const response = await socialLogin(
        testUser.name,
        testUser.email,
        testUser.image || undefined,
        provider,
      )

      if (response.success && response.data) {
        authLogin(response.data.user, {
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken,
        })
        router.replace('/')
        toast.success('소셜 로그인에 성공했습니다')
      } else {
        toast.error(response.error || '소셜 로그인에 실패했습니다')
      }
    } catch (error) {
      console.error('소셜 로그인 오류:', error)
      toast.error('소셜 로그인 중 오류가 발생했습니다')
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      toast.error('이미 로그인되어 있습니다.')
      router.replace('/')
    }
  }, [router, isAuthenticated])

  return (
    <div className="max-w-xl mx-auto pt-10 pb-24">
      <div className="flex flex-col gap-6">
        <h1 className="text-lg font-semibold text-center">
          JWT 로그인 또는 회원가입
        </h1>
        <hr className="border-b-gray-300" />
        <div className="text-xl md:text-2xl font-semibold">
          Fastcampus Nextbnb에 오신 것을 환영합니다.
        </div>
      </div>

      {!isEmailLogin ? (
        <>
          <div className="text-sm text-gray-500 mt-2">
            JWT 인증을 이용해서 로그인 또는 회원가입을 해주세요.
          </div>
          <div className="flex flex-col gap-5 mt-16">
            <button
              type="button"
              onClick={() => setIsEmailLogin(true)}
              className="relative border border-gray-700 rounded-md py-3 text-sm hover:bg-black/5 text-center font-semibold"
            >
              <MdEmail className="absolute left-5 text-blue-500 text-xl my-auto inset-y-0" />
              이메일로 로그인하기
            </button>
            <button
              type="button"
              onClick={() => handleSocialLogin('google')}
              className="relative border border-gray-700 rounded-md py-3 text-sm hover:bg-black/5 text-center font-semibold"
            >
              <FcGoogle className="absolute left-5 text-xl my-auto inset-y-0" />
              구글로 로그인하기 (JWT)
            </button>
            <button
              type="button"
              onClick={() => handleSocialLogin('naver')}
              className="relative border border-gray-700 rounded-md py-3 text-sm hover:bg-black/5 text-center font-semibold"
            >
              <SiNaver className="absolute left-6 text-green-400 my-auto inset-y-0" />
              네이버로 로그인하기 (JWT)
            </button>
            <button
              type="button"
              onClick={() => handleSocialLogin('kakao')}
              className="relative border border-gray-700 rounded-md py-3 text-sm hover:bg-black/5 text-center font-semibold"
            >
              <RiKakaoTalkFill className="absolute left-5 text-yellow-950 text-xl my-auto inset-y-0" />
              카카오로 로그인하기 (JWT)
            </button>
          </div>
        </>
      ) : (
        <div className="mt-6">
          <form onSubmit={handleEmailLogin} className="flex flex-col gap-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                이메일
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="이메일 주소를 입력하세요"
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                비밀번호
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="비밀번호를 입력하세요"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? '로그인 중...' : '로그인'}
            </button>
          </form>
          <button
            type="button"
            onClick={() => setIsEmailLogin(false)}
            className="w-full mt-4 text-sm text-gray-600 hover:text-gray-800"
          >
            ← 다른 방법으로 로그인하기
          </button>
        </div>
      )}

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-600">
          계정이 없으신가요?{' '}
          <button
            onClick={() => router.push('/users/signup-jwt')}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            회원가입
          </button>
        </p>
      </div>
    </div>
  )
}
