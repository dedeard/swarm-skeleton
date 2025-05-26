import type { Meta, StoryObj } from '@storybook/react'
import LoadingTestDemo from './LoadingTestDemo'

const meta: Meta<typeof LoadingTestDemo> = {
  title: 'ChatMarkdown/LoadingTestDemo',
  component: LoadingTestDemo,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A demo component that shows how video blocks handle loading states during streaming content.',
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}
