import { useAgentStore } from '@/store/agent.store'
import { useToolStore } from '@/store/tool.store'
import { IAgentPayload } from '@/types/agent'
import { addToast, Button, Input, Select, SelectItem, Textarea } from '@heroui/react'
import { Switch } from '@heroui/switch'
import { yupResolver } from '@hookform/resolvers/yup'
import { HomeIcon, XIcon } from 'lucide-react'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import * as yup from 'yup'

const schema = yup.object({
  agent_name: yup.string().required(),
  description: yup.string().required(),
  agent_style: yup.string().required(),
  on_status: yup.boolean(),
  tools: yup.array().of(yup.string()).optional(),
})

type FormValues = yup.InferType<typeof schema>

const CreateAgent: React.FC = () => {
  const { tools: allTools } = useToolStore()
  const [loading, setLoading] = useState(false)
  const { addAgent } = useAgentStore()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  })

  const tools = watch('tools')
  const enabled = watch('on_status')

  const onSubmit = async (data: FormValues) => {
    setLoading(true)
    try {
      await addAgent(data as IAgentPayload)
      addToast({ title: 'Agent created successfully' })
      navigate('/agents')
    } catch (e: any) {
      addToast({ color: 'danger', title: e.message })
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="absolute left-0 z-10 flex h-screen max-h-screen w-full flex-1 flex-col bg-white dark:bg-neutral-950 lg:static lg:w-[calc(100vw-400px)] lg:max-w-3xl"
    >
      <div className="flex justify-between px-3 py-4">
        <div>
          <span className="block text-lg">Create Agent</span>
          <span className="block text-xs opacity-75">Define the properties for your new backend agent.</span>
        </div>
        <Button as={Link} isIconOnly size="sm" to="/agents" variant="light" radius="full">
          <XIcon size={20} />
        </Button>
      </div>

      <div className="grid h-[calc(100%-76px)] w-full grid-cols-1 gap-3 overflow-y-auto px-4">
        <div className="flex flex-col gap-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded bg-primary-500/10 text-primary-500">
                <HomeIcon size={18} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">New Agent</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Agent summary will be automatically generated after saving</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch isSelected={enabled} onValueChange={(value) => setValue('on_status', value)} color="success" className="ml-2" />
                <span className={`text-sm ${enabled ? 'text-primary-500' : 'text-gray-500 dark:text-gray-400'}`}>
                  {enabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>
          </div>

          <Input
            label="Agent Name"
            placeholder="e.g., Customer Support Bot"
            {...register('agent_name')}
            isInvalid={!!errors.agent_name}
            errorMessage={errors.agent_name?.message}
            variant="bordered"
            className="w-full"
          />

          <Textarea
            label="Description"
            placeholder="Describe what this agent does"
            minRows={4}
            maxRows={8}
            {...register('description')}
            isInvalid={!!errors.description}
            errorMessage={errors.description?.message}
            variant="bordered"
            className="w-full"
          />

          <Textarea
            label="Agent Style / Instructions"
            placeholder="e.g., conversational, or provide specific instructions"
            minRows={4}
            maxRows={8}
            {...register('agent_style')}
            isInvalid={!!errors.agent_style}
            errorMessage={errors.agent_style?.message}
            variant="bordered"
            className="w-full"
          />

          <Select
            label="Tools"
            selectionMode="multiple"
            // @ts-expect-error
            selectedKeys={tools ?? []}
            onSelectionChange={(keys) => setValue('tools', Array.from(keys) as string[])}
            variant="bordered"
            className="w-full"
            renderValue={(el) => el.map((el) => el.rendered).join(', ')}
          >
            {allTools.map((tool) => (
              <SelectItem key={tool.tool_id} textValue={tool.tool_id}>
                {tool.name}
              </SelectItem>
            ))}
          </Select>

          <div className="flex justify-end gap-2">
            <Button variant="flat" color="default" isDisabled={loading} className="font-medium" type="button">
              Cancel
            </Button>
            <Button
              type="submit"
              color="primary"
              isDisabled={loading}
              isLoading={loading}
              className="bg-primary-500 font-medium dark:bg-primary-600"
            >
              Create Agent
            </Button>
          </div>
        </div>
      </div>
    </form>
  )
}

export default CreateAgent
