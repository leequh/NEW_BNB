export default async function DashboardRightPage() {
  // await new Promise((resolve) => setTimeout(resolve, 3500))
  await new Promise((resolve, reject) => {
    setTimeout(() => {
      const randomNumber = Math.random()
      // 50% 확률로 에러 발생
      if (randomNumber < 0.5) {
        reject(new Error('Random Error'))
      } else {
        resolve('No Error')
      }
    }, 3500)
  })
  return (
    <div className="min-h-screen text-center flex flex-col justify-center font-semibold bg-rose-700 text-white">
      Dashboard Right Page
    </div>
  )
}
