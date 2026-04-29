import React from 'react'
import type { Meta } from '@storybook/react'
import { TextType } from '../../components/Text/text.constant'
import { Text } from '../../components/Text/Text'

const meta = {
  title: 'Foundation/Typography',
  tags: ['autodocs'],
} satisfies Meta

export default meta

export const TypographyList = () => {
  return (
    <div className="flex flex-col gap-4">
      {Object.entries(TextType)?.map(([key, value]) => (
        <Text
          label="가나다라바사아자차카타파하 1234567890 ~!@#$%^&*()_+"
          type={value}
        />
      ))}
    </div>
  )
}
