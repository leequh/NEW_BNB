export default async function DashboardLeftPage() {
  // await new Promise((resolve) => setTimeout(resolve, 2000))
  await new Promise((resolve, reject) => {
    setTimeout(() => {
      const randomNumber = Math.random()
      // 50% 확률로 에러 발생
      if (randomNumber < 0.5) {
        reject(new Error('Random Error'))
      } else {
        resolve('No Error')
      }
    }, 2000)
  })
  return (
    <div className="min-h-screen text-center flex flex-col justify-center font-semibold bg-rose-300 ">
      Dashboard Left Page
    </div>
  )
}
