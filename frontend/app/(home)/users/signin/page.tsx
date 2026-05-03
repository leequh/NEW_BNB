'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn, useSession } from 'next-auth/react'
import { FcGoogle } from 'react-icons/fc'
import { SiNaver } from 'react-icons/si'
import { RiKakaoTalkFill } from 'react-icons/ri'
import { MdEmail } from 'react-icons/md'

import toast from 'react-hot-toast'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

export default function SignInPage() {
  const router = useRouter()
  const { status } = useSession()
  const [isEmailLogin, setIsEmailLogin] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleClickGoogle = () => {
    try {
      signIn('google', { callbackUrl: '/' })
    } catch (e) {
      console.log(e)
      toast.error('다시 시도해주세요')
    }
  }

  const handleClickNaver = () => {
    try {
      signIn('naver', { callbackUrl: '/' })
    } catch (e) {
      console.log(e)
      toast.error('다시 시도해주세요')
    }
  }

  const handleClickKakao = () => {
    try {
      signIn('kakao', { callbackUrl: '/' })
    } catch (e) {
      console.log(e)
      toast.error('다시 시도해주세요')
    }
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      toast.error('이메일과 비밀번호를 입력해주세요')
      return
    }

    setLoading(true)

    try {
      // 먼저 백엔드에 직접 로그인 시도
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.token && data.user) {
          // NextAuth credentials 로그인 시도
          const result = await signIn('credentials', {
            redirect: false,
            email,
            password,
          })

          if (result?.error) {
            toast.error('이메일 또는 비밀번호가 올바르지 않습니다')
          } else {
            router.replace('/')
            toast.success('로그인에 성공했습니다')
          }
        } else {
          toast.error('로그인 정보가 올바르지 않습니다')
        }
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || '로그인에 실패했습니다')
      }
    } catch (error) {
      console.error('로그인 오류:', error)
      toast.error('로그인 중 오류가 발생했습니다')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (status === 'authenticated') {
      toast.error('이미 로그인되어 있습니다.')
      router.replace('/')
    }
  }, [router, status])

  return (
    <div className="max-w-xl mx-auto pt-10 pb-24">
      <div className="flex flex-col gap-6">
        <h1 className="text-lg font-semibold text-center">
          로그인 또는 회원가입
        </h1>
        <hr className="border-b-gray-300" />
        <div className="text-xl md:text-2xl font-semibold">
          LUXLAS에 오신 것을 환영합니다.
        </div>
      </div>

      {!isEmailLogin ? (
        <>
          <div className="text-sm text-gray-500 mt-2">
            SNS 계정을 이용해서 로그인 또는 회원가입을 해주세요.
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
              onClick={handleClickGoogle}
              className="relative border border-gray-700 rounded-md py-3 text-sm hover:bg-black/5 text-center font-semibold"
            >
              <FcGoogle className="absolute left-5 text-xl my-auto inset-y-0" />
              구글로 로그인하기
            </button>
            <button
              type="button"
              onClick={handleClickNaver}
              className="relative border border-gray-700 rounded-md py-3 text-sm hover:bg-black/5 text-center font-semibold"
            >
              <SiNaver className="absolute left-6 text-green-400 my-auto inset-y-0" />
              네이버로 로그인하기
            </button>
            <button
              type="button"
              onClick={handleClickKakao}
              className="relative border border-gray-700 rounded-md py-3 text-sm hover:bg-black/5 text-center font-semibold"
            >
              <RiKakaoTalkFill className="absolute left-5 text-yellow-950 text-xl my-auto inset-y-0" />
              카카오로 로그인하기
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
              className={`mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? '로그인 중...' : '로그인'}
            </button>
            <button
              type="button"
              onClick={() => setIsEmailLogin(false)}
              className="mt-2 w-full text-gray-600 text-sm py-2 hover:underline"
            >
              다른 방법으로 로그인하기
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
