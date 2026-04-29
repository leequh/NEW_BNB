'use client'

import { filterState } from '@/atom'
import { CATEGORY_DATA } from '@/constants'
import { useRecoilState } from 'recoil'

import cn from 'classnames'
import { BiReset } from 'react-icons/bi'

export default function CategoryList() {
  const [filterValue, setFilterValue] = useRecoilState(filterState)
  return (
    <div className="flex justify-evenly fixed top-20 inset-x-0 mx-auto w-full bg-white z-10 mb-6 sm:px-24 px-4">
      <button
        data-cy="category-filter-all"
        className="justify-center gap-3 py-4 text-center"
        onClick={() => {
          setFilterValue({
            ...filterValue,
            category: '',
          })
        }}
      >
        <div
          className={cn(
            'flex flex-col justify-center gap-3 text-gray-500 hover:text-gray-700 cursor-pointer',
            {
              'underline underline-offset-8 font-semibold text-black':
                filterValue.category === '',
            },
          )}
        >
          <div className="text-2xl mx-auto">
            <BiReset />
          </div>
          <div className="text-xs">전체</div>
        </div>
      </button>
      {CATEGORY_DATA?.map((category) => (
        <button
          data-cy={`category-filter-${category.title}`}
          type="button"
          key={category.title}
          onClick={() =>
            setFilterValue({
              ...filterValue,
              category: category.title,
            })
          }
          className={cn(
            'text-gray-500 hover:text-gray-700 gap-3 justify-center py-4 text-center',
            {
              'text-black font-semibold underline underline-offset-8':
                filterValue.category === category.title,
            },
          )}
        >
          <div className="flex-col flex justify-center gap-3">
            <div className="text-2xl mx-auto">
              <category.Icon />
            </div>
            <div className="text-gray-700 text-xs text-center">
              {category.title}
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}
