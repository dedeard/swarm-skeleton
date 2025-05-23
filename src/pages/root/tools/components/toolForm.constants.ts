import { IToolVersionReleased } from '@/types/tool'
import { ToolFormValues } from './toolForm.types'

export const methodOptions: IToolVersionReleased['method'][] = ['http', 'sse', 'grpc', 'other']

export const statusOptions: Array<ToolFormValues['on_status']> = ['Development', 'Online', 'Offline', 'Deprecated']
