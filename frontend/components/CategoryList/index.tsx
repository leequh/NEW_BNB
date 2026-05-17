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
        className="justify-center gap-3 py-4 text-center group"
        onClick={() => {
          setFilterValue({
            ...filterValue,
            category: '',
          })
        }}
      >
        <div
          className={cn(
            'flex flex-col justify-center gap-3 cursor-pointer transition-all duration-300',
            {
              'text-black': filterValue.category === '',
              'text-gray-500 hover:text-gray-700': filterValue.category !== '',
            },
          )}
        >
          <div
            className={cn(
              'text-2xl mx-auto transition-transform duration-300 group-hover:scale-110',
              {
                'scale-110': filterValue.category === '',
              },
            )}
          >
            <BiReset
              className={cn('transition-transform duration-300', {
                'rotate-180': filterValue.category === '',
              })}
            />
          </div>
          <div className="text-xs relative">
            전체
            <span
              className={cn(
                'absolute -bottom-2 left-0 w-full h-0.5 bg-black transition-transform duration-300 origin-center',
                {
                  'scale-x-100': filterValue.category === '',
                  'scale-x-0': filterValue.category !== '',
                },
              )}
            />
          </div>
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
          className="gap-3 justify-center py-4 text-center group"
        >
          <div
            className={cn(
              'flex-col flex justify-center gap-3 transition-all duration-300',
              {
                'text-black': filterValue.category === category.title,
                'text-gray-500 hover:text-gray-700':
                  filterValue.category !== category.title,
              },
            )}
          >
            <div
              className={cn(
                'text-2xl mx-auto transition-transform duration-300 group-hover:scale-110',
                {
                  'scale-110': filterValue.category === category.title,
                },
              )}
            >
              <category.Icon />
            </div>
            <div className="text-xs text-center relative">
              {category.title}
              <span
                className={cn(
                  'absolute -bottom-2 left-0 w-full h-0.5 bg-black transition-transform duration-300 origin-center',
                  {
                    'scale-x-100': filterValue.category === category.title,
                    'scale-x-0': filterValue.category !== category.title,
                  },
                )}
              />
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}
