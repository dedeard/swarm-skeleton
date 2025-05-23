import { Button, Input, Select, SelectItem, Textarea, addToast } from '@heroui/react'
import { yupResolver } from '@hookform/resolvers/yup'
import { PlusCircleIcon, WrenchIcon, XIcon } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'

import { useToolStore } from '@/store/tool.store'
import { IToolPayload, IToolVersion } from '@/types/tool' // ITool also used in ToolFormProps

import { methodOptions, statusOptions } from './toolForm.constants'
import { toolSchema } from './toolForm.schemas'
import { ToolFormProps, ToolFormValues } from './toolForm.types'
import VersionSubForm from './VersionSubForm'

const ToolForm: React.FC<ToolFormProps> = ({ tool }) => {
  const { addTool, editTool } = useToolStore()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const navigate = useNavigate()
  const isEditMode = !!tool

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ToolFormValues>({
    resolver: yupResolver(toolSchema),
  })

  const {
    fields: versionFields,
    append: appendVersion,
    remove: removeVersion,
  } = useFieldArray({
    control,
    name: 'versions',
  })

  useEffect(() => {
    if (tool) {
      const toolDataForForm: ToolFormValues = {
        name: tool.name,
        description: tool.description,
        on_status: tool.on_status as ToolFormValues['on_status'],
        versions: tool.versions.map((v) => ({
          version: v.version,
          released: {
            env: v.released.env ? Object.entries(v.released.env).map(([key, value]) => ({ key, value })) : [],
            args: v.released.args,
            port: v.released.port,
            method: v.released.method as ToolFormValues['versions'][0]['released']['method'],
            required_env: v.released.required_env || [],
          },
        })),
      }
      reset(toolDataForForm)
    } else {
      // Reset to initial default values if not in edit mode or tool is removed
      reset({
        name: '',
        description: '',
        versions: [
          {
            version: '1.0.0',
            released: {
              env: [],
              args: '',
              port: '',
              method: 'http',
              required_env: [],
            },
          },
        ],
        on_status: 'Development',
      })
    }
  }, [tool, reset])

  const onSubmit = async (data: ToolFormValues) => {
    setIsSubmitting(true)
    const payloadVersions: IToolVersion[] = data.versions.map((v) => ({
      version: v.version,
      released: {
        env: (v.released.env || []).reduce(
          (acc, curr) => {
            if (curr.key) acc[curr.key] = curr.value
            return acc
          },
          {} as Record<string, string>,
        ),
        args: v.released.args,
        port: v.released.port,
        method: v.released.method,
        required_env: v.released.required_env || [],
      },
    }))

    const currentToolId = isEditMode && tool ? tool.tool_id : crypto.randomUUID()

    const payload: IToolPayload = {
      tool_id: currentToolId,
      name: data.name,
      description: data.description,
      on_status: data.on_status,
      versions: payloadVersions,
    }

    try {
      if (isEditMode && tool) {
        await editTool(tool.tool_id, payload)
        addToast({ title: 'Tool updated successfully' })
      } else {
        await addTool(payload)
        addToast({ title: 'Tool created successfully' })
      }
      navigate('/tools')
    } catch (e: any) {
      addToast({ color: 'danger', title: e.message || 'An unknown error occurred' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="absolute left-0 z-10 flex h-screen max-h-screen w-full flex-1 flex-col bg-white dark:bg-neutral-950 lg:static lg:w-[calc(100vw-400px)] lg:max-w-4xl"
    >
      <div className="flex justify-between border-b px-4 py-3 dark:border-neutral-800">
        <div>
          <span className="block text-lg font-semibold">{isEditMode ? 'Edit Tool' : 'Create New Tool'}</span>
          <span className="block text-xs opacity-75">
            {isEditMode ? `Updating tool: ${tool?.name}` : 'Define the properties for your new tool.'}
          </span>
        </div>
        <Button as={Link} isIconOnly size="sm" to="/tools" variant="light" radius="full">
          <XIcon size={20} />
        </Button>
      </div>

      <div className="flex-grow space-y-6 overflow-y-auto p-6">
        <div className="flex items-center gap-3 rounded-lg bg-neutral-50 p-4 dark:bg-neutral-900">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary-500/10 text-primary-500">
            <WrenchIcon size={20} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              {isEditMode ? tool?.name || 'Edit Tool' : 'New Tool Configuration'}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Provide the details for the tool and its versions.</p>
          </div>
        </div>

        <Input
          label="Tool Name"
          placeholder="e.g., Brave Search"
          isInvalid={!!errors.name}
          errorMessage={errors.name?.message}
          variant="bordered"
          value={watch('name')}
          onChange={(e) => setValue('name', e.target.value)}
        />
        <Textarea
          label="Description"
          placeholder="Describe what this tool does"
          minRows={3}
          value={watch('description')}
          onChange={(e) => setValue('description', e.target.value)}
          isInvalid={!!errors.description}
          errorMessage={errors.description?.message}
          variant="bordered"
        />
        <Controller
          name="on_status"
          control={control}
          render={({ field }) => (
            <Select
              label="Status"
              placeholder="Select tool status"
              selectedKeys={field.value ? [field.value] : []}
              onSelectionChange={(keys) => field.onChange(Array.from(keys)[0] as string)}
              isInvalid={!!errors.on_status}
              errorMessage={errors.on_status?.message}
              variant="bordered"
            >
              {statusOptions.map((s) => (
                <SelectItem key={s} textValue={s}>
                  {s}
                </SelectItem>
              ))}
            </Select>
          )}
        />

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">Versions</h3>
          {versionFields.map((field, versionIndex) => (
            <VersionSubForm
              key={field.id}
              versionIndex={versionIndex}
              control={control}
              errors={errors}
              removeVersion={removeVersion}
              methodOptions={methodOptions}
            />
          ))}
          <Button
            type="button"
            color="secondary"
            onClick={() =>
              appendVersion({
                version: '',
                released: {
                  env: [],
                  args: '',
                  port: '',
                  method: 'http',
                  required_env: [],
                },
              })
            }
            className="mt-2"
            startContent={<PlusCircleIcon size={18} />}
            disabled={isSubmitting}
          >
            Add Version
          </Button>
          {errors.versions &&
            !errors.versions.message &&
            typeof errors.versions !== 'string' && ( // Check if it's not a direct string message
              <p className="mt-1 text-xs text-red-500">At least one version is required.</p>
            )}
          {errors.versions?.message && <p className="mt-1 text-xs text-red-500">{errors.versions.message}</p>}
        </div>

        <div className="flex justify-end gap-3 border-t pt-4 dark:border-neutral-800">
          <Button variant="flat" as={Link} to="/tools" color="default" isDisabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" color="primary" isLoading={isSubmitting} isDisabled={isSubmitting}>
            {isEditMode ? 'Update Tool' : 'Create Tool'}
          </Button>
        </div>
      </div>
    </form>
  )
}

export default ToolForm
