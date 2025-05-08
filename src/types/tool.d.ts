export interface ITool {
  tool_id: string
  name: string
  description: string
  versions: IToolVersion[]
  on_status: string
}

export interface IToolPayload {
  tool_id: string
  name: string
  description: string
  versions: IToolVersion[]
  on_status: string
}

export interface IToolVersion {
  version: string
  released: IToolVersionReleased
}

export interface IToolVersionReleased {
  env: Record<string, string>
  args: string
  port: string
  method: string
  required_env: string[]
}
