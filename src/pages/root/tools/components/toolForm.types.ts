import { ITool, IToolVersionReleased } from '@/types/tool'
import * as yup from 'yup'
import { toolSchema } from './toolForm.schemas' // We'll create this next

export type ToolFormValues = yup.InferType<typeof toolSchema>

export interface ToolFormProps {
  tool?: ITool
}

export interface VersionSubFormProps {
  versionIndex: number
  control: any // Consider using Control<ToolFormValues> from react-hook-form for better typing
  errors: any // Consider using FieldErrors<ToolFormValues>
  removeVersion: (index: number) => void
  methodOptions: IToolVersionReleased['method'][]
}
