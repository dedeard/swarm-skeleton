import { invokeAutofillAgentStyle } from '@/services/agent.service'
import { useAgentStore } from '@/store/agent.store'
import { useToolStore } from '@/store/tool.store'
import { IAgent, IAgentPayload } from '@/types/agent'
import { addToast, Button, Input, Select, SelectItem, Textarea } from '@heroui/react'
import { Switch } from '@heroui/switch'
import { yupResolver } from '@hookform/resolvers/yup'
import { HomeIcon, SparklesIcon, XIcon } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react' // Added useRef for textarea
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import * as yup from 'yup'

const schema = yup.object({
  agent_name: yup.string().required('Agent name is required'),
  description: yup.string().required('Description is required'),
  agent_style: yup.string().optional(),
  on_status: yup.boolean(),
  tools: yup.array().of(yup.string()).optional(),
})

type FormValues = yup.InferType<typeof schema>

interface AgentFormProps {
  agent?: IAgent
}

const AgentForm: React.FC<AgentFormProps> = ({ agent }) => {
  const { tools: allTools } = useToolStore()
  const [loading, setLoading] = useState(false)
  const [isAutofillingStyle, setIsAutofillingStyle] = useState(false)
  const { addAgent, editAgent } = useAgentStore()
  const navigate = useNavigate()
  const isEditMode = !!agent
  const agentStyleTextareaRef = useRef<HTMLTextAreaElement>(null) // Ref for scrolling

  const {
    handleSubmit,
    setValue,
    watch,
    reset,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      agent_name: '',
      description: '',
      agent_style: '',
      on_status: true,
      tools: [],
    },
  })

  useEffect(() => {
    if (agent) {
      reset({
        agent_name: agent.agent_name,
        description: agent.description,
        agent_style: agent.agent_style || 'The agent will reply in a warm and friendly manner, using English.',
        on_status: agent.on_status,
        tools: agent.tools,
      })
    } else {
      setValue('agent_style', 'The agent will reply in a warm and friendly manner, using English.')
    }
  }, [agent, reset, setValue])

  const toolsValue = watch('tools')
  const enabled = watch('on_status')
  const agentNameValue = watch('agent_name')
  const descriptionValue = watch('description')
  // Watch currentAgentStyle directly for use in handleAutofillAgentStyle
  const currentAgentStyleValue = watch('agent_style')

  const onSubmit = async (data: FormValues) => {
    if (!data.agent_style) {
      data.agent_style = 'The agent will reply in a warm and friendly manner, using English.'
    }
    setLoading(true)
    try {
      if (isEditMode && agent) {
        await editAgent(agent.agent_id, data as IAgentPayload)
        addToast({ title: 'Agent updated successfully' })
      } else {
        await addAgent(data as IAgentPayload)
        addToast({ title: 'Agent created successfully' })
      }
      navigate('/agents')
    } catch (e: any) {
      addToast({ color: 'danger', title: e.message || 'An unknown error occurred' })
      setLoading(false)
    }
  }

  const handleAutofillAgentStyle = async () => {
    const currentAgentName = getValues('agent_name')
    const currentDescription = getValues('description')
    // Use the watched value as it reflects the UI; getValues might not be updated if user is typing rapidly
    const existingAgentStyle = currentAgentStyleValue || ''

    if (!currentAgentName) {
      addToast({ color: 'warning', title: 'Please enter an agent name first' })
      return
    }

    setIsAutofillingStyle(true)
    try {
      const payload = {
        field_name: 'agent_style',
        json_field: {
          agent_name: currentAgentName,
          description: currentDescription,
        },
        existing_field_value: existingAgentStyle,
      }

      const fetchResponse: Response = await invokeAutofillAgentStyle(payload)

      if (!fetchResponse.ok) {
        let errorDetails = `API error: ${fetchResponse.status} ${fetchResponse.statusText}`
        try {
          const errorData = await fetchResponse.json()
          errorDetails += ` - ${errorData.detail || errorData.message || JSON.stringify(errorData)}`
        } catch (e) {
          try {
            const textError = await fetchResponse.text()
            errorDetails += ` - ${textError}`
          } catch (textE) {
            errorDetails += ' (Could not parse error response body)'
          }
        }
        throw new Error(errorDetails)
      }

      const responseData = await fetchResponse.json()

      if (responseData && responseData.autofilled_value) {
        const newText = responseData.autofilled_value
        let displayedText = existingAgentStyle

        // Logic from your provided version: Clears if both old and new text exist.
        // This means it replaces the old text if new text is generated.
        if (displayedText.length > 0 && newText.length > 0) {
          displayedText = ''
        }

        // If displayedText is now empty and newText starts with a space, trim it.
        // Or, ensure newText doesn't start with a space if displayedText was cleared.
        let textToStream = newText
        if (displayedText === '' && textToStream.startsWith(' ')) {
          textToStream = textToStream.trimStart()
        }

        // Initial set if displayedText was cleared
        if (displayedText === '') {
          setValue('agent_style', '', { shouldDirty: true })
        }

        for (let i = 0; i < textToStream.length; i++) {
          displayedText += textToStream[i]
          setValue('agent_style', displayedText + '▌', { shouldDirty: true })
          if (agentStyleTextareaRef.current) {
            agentStyleTextareaRef.current.scrollTop = agentStyleTextareaRef.current.scrollHeight
          }
          await new Promise((resolve) => setTimeout(resolve, Math.floor(Math.random() * 25) + 10))
        }
        setValue('agent_style', displayedText, { shouldDirty: true })
        addToast({ title: 'Agent style autofilled successfully' })
      } else {
        addToast({ color: 'warning', title: 'Failed to autofill agent style: No value received' })
      }
    } catch (error: any) {
      console.error('Autofill error:', error)
      addToast({ color: 'danger', title: `Error autofilling agent style: ${error.message || 'Unknown error'}` })
    } finally {
      setIsAutofillingStyle(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="absolute left-0 z-10 flex h-screen max-h-screen w-full flex-1 flex-col bg-white dark:bg-neutral-950 lg:static lg:w-[calc(100vw-400px)] lg:max-w-3xl"
    >
      <div className="flex justify-between px-3 py-4">
        <div>
          <span className="block text-lg">{isEditMode ? 'Edit Agent' : 'Create Agent'}</span>
          <span className="block text-xs opacity-75">
            {isEditMode ? 'Update the properties for your backend agent.' : 'Define the properties for your new backend agent.'}
          </span>
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
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                  {isEditMode ? agent?.agent_name || 'Edit Agent' : 'New Agent'}
                </h2>
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
            value={agentNameValue}
            onChange={(e) => setValue('agent_name', e.target.value, { shouldValidate: true })}
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
            value={descriptionValue}
            onChange={(e) => setValue('description', e.target.value, { shouldValidate: true })}
            isInvalid={!!errors.description}
            errorMessage={errors.description?.message}
            variant="bordered"
            className="w-full"
          />

          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <label htmlFor="agent_style_textarea" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Agent Style / Instructions
              </label>
              <Button
                type="button"
                size="sm"
                variant="light"
                onClick={handleAutofillAgentStyle}
                isLoading={isAutofillingStyle}
                isDisabled={!agentNameValue || isAutofillingStyle}
                className="text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300"
              >
                <SparklesIcon size={16} className="mr-1" />
                Autofill Style
              </Button>
            </div>
            <Textarea
              id="agent_style_textarea" // ID for scrolling ref
              ref={agentStyleTextareaRef} // Attach ref
              placeholder="e.g., conversational, or provide specific instructions. Click Autofill to generate."
              minRows={4}
              maxRows={8}
              value={currentAgentStyleValue} // Use watched value
              onChange={(e) => setValue('agent_style', e.target.value, { shouldDirty: true })}
              isInvalid={!!errors.agent_style}
              errorMessage={errors.agent_style?.message}
              variant="bordered"
              className="w-full"
              isDisabled={isAutofillingStyle}
            />
            {errors.agent_style && <p className="mt-1 text-xs text-red-500">{errors.agent_style.message}</p>}
          </div>

          <Select
            label="Tools"
            selectionMode="multiple"
            // @ts-expect-error
            selectedKeys={toolsValue ?? []}
            onSelectionChange={(keys) => setValue('tools', Array.from(keys) as string[])}
            variant="bordered"
            className="w-full"
            renderValue={(items) =>
              items
                .map((item) => {
                  const tool = allTools.find((t) => t.tool_id === item.key)
                  return tool ? tool.name : String(item.key) // Ensure item.key is string
                })
                .join(', ')
            }
          >
            {allTools.map((tool) => (
              <SelectItem key={tool.tool_id} textValue={tool.name}>
                {tool.name}
              </SelectItem>
            ))}
          </Select>

          <div className="flex justify-end gap-2">
            <Button
              variant="flat"
              as={Link}
              to="/agents"
              color="default"
              isDisabled={loading || isAutofillingStyle}
              className="font-medium"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              color="primary"
              isDisabled={loading || isAutofillingStyle}
              isLoading={loading}
              className="bg-primary-500 font-medium dark:bg-primary-600"
            >
              {isEditMode ? 'Update Agent' : 'Create Agent'}
            </Button>
          </div>
        </div>
      </div>
    </form>
  )
}

export default AgentForm
