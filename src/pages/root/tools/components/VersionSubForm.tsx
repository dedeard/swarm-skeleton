import { IToolVersionReleased } from '@/types/tool' // Required for Select onChange typing
import { Button, Input, Select, SelectItem } from '@heroui/react'
import { PlusCircleIcon, Trash2Icon } from 'lucide-react'
import React from 'react'
import { Controller, useFieldArray } from 'react-hook-form'
import { VersionSubFormProps } from './toolForm.types'

const VersionSubForm: React.FC<VersionSubFormProps> = ({ versionIndex, control, errors, removeVersion, methodOptions }) => {
  const {
    fields: envFields,
    append: appendEnv,
    remove: removeEnv,
  } = useFieldArray({
    control,
    name: `versions.${versionIndex}.released.env`,
  })
  const {
    fields: reqEnvFields,
    append: appendReqEnv,
    remove: removeReqEnv,
  } = useFieldArray({
    control,
    name: `versions.${versionIndex}.released.required_env`,
  })

  const versionErrors = errors.versions?.[versionIndex]

  return (
    <div className="relative space-y-4 rounded-lg border bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-900/50">
      <Button
        isIconOnly
        size="sm"
        variant="light"
        color="danger"
        onClick={() => removeVersion(versionIndex)}
        className="absolute right-2 top-2"
        aria-label="Remove version"
      >
        <Trash2Icon size={18} />
      </Button>

      <Input
        label={`Version String (e.g., 1.0.0)`}
        {...control.register(`versions.${versionIndex}.version`)}
        isInvalid={!!versionErrors?.version}
        errorMessage={versionErrors?.version?.message}
        variant="bordered"
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input
          label="Released: Args"
          placeholder="e.g., npx @package/server --param"
          {...control.register(`versions.${versionIndex}.released.args`)}
          isInvalid={!!versionErrors?.released?.args}
          errorMessage={versionErrors?.released?.args?.message}
          variant="bordered"
        />
        <Input
          label="Released: Port"
          placeholder="e.g., 10001"
          {...control.register(`versions.${versionIndex}.released.port`)}
          isInvalid={!!versionErrors?.released?.port}
          errorMessage={versionErrors?.released?.port?.message}
          variant="bordered"
        />
      </div>
      <Controller
        name={`versions.${versionIndex}.released.method`}
        control={control}
        render={({ field }) => (
          <Select
            label="Released: Method"
            placeholder="Select method"
            selectedKeys={field.value ? [field.value] : []}
            onSelectionChange={(keys) => field.onChange((Array.from(keys)[0] as IToolVersionReleased['method']) || methodOptions[0])}
            isInvalid={!!versionErrors?.released?.method}
            errorMessage={versionErrors?.released?.method?.message}
            variant="bordered"
          >
            {methodOptions.map((m) => (
              <SelectItem key={m} textValue={m}>
                {m}
              </SelectItem>
            ))}
          </Select>
        )}
      />

      <div className="space-y-2 pt-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Released: Environment Variables</label>
        {envFields.map((envField, envIndex) => (
          <div key={envField.id} className="flex items-center gap-2">
            <Input
              placeholder="Key (e.g., API_KEY)"
              {...control.register(`versions.${versionIndex}.released.env.${envIndex}.key`)}
              isInvalid={!!versionErrors?.released?.env?.[envIndex]?.key}
              errorMessage={versionErrors?.released?.env?.[envIndex]?.key?.message}
              variant="bordered"
              className="flex-1"
            />
            <Input
              placeholder="Value"
              {...control.register(`versions.${versionIndex}.released.env.${envIndex}.value`)}
              isInvalid={!!versionErrors?.released?.env?.[envIndex]?.value}
              errorMessage={versionErrors?.released?.env?.[envIndex]?.value?.message}
              variant="bordered"
              className="flex-1"
            />
            <Button type="button" isIconOnly variant="light" color="danger" onClick={() => removeEnv(envIndex)} aria-label="Remove Env Var">
              <Trash2Icon size={16} />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          size="sm"
          color="secondary"
          onClick={() => appendEnv({ key: '', value: '' })}
          startContent={<PlusCircleIcon size={16} />}
        >
          Add Env Variable
        </Button>
      </div>

      <div className="space-y-2 pt-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Released: Required Env Keys (names only)</label>
        {reqEnvFields.map((reqEnvField, reqEnvIndex) => (
          <div key={reqEnvField.id} className="flex items-center gap-2">
            <Controller
              name={`versions.${versionIndex}.released.required_env.${reqEnvIndex}`}
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="e.g., DATABASE_URL"
                  isInvalid={!!versionErrors?.released?.required_env?.[reqEnvIndex]}
                  errorMessage={
                    typeof versionErrors?.released?.required_env?.[reqEnvIndex] === 'object'
                      ? versionErrors?.released?.required_env?.[reqEnvIndex]?.message
                      : versionErrors?.released?.required_env?.[reqEnvIndex]
                  }
                  variant="bordered"
                  className="flex-1"
                />
              )}
            />
            <Button
              type="button"
              isIconOnly
              variant="light"
              color="danger"
              onClick={() => removeReqEnv(reqEnvIndex)}
              aria-label="Remove Required Env"
            >
              <Trash2Icon size={16} />
            </Button>
          </div>
        ))}
        <Button type="button" size="sm" color="secondary" onClick={() => appendReqEnv('')} startContent={<PlusCircleIcon size={16} />}>
          Add Required Env Key
        </Button>
      </div>
    </div>
  )
}

export default VersionSubForm
