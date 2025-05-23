import * as yup from 'yup'

export const formToolVersionEnvSchema = yup.object().shape({
  key: yup.string().required('Env key is required'),
  value: yup.string().required('Env value is required'),
})

export const toolVersionReleasedSchema = yup.object().shape({
  env: yup.array().of(formToolVersionEnvSchema).optional(),
  args: yup.string().required('Args is required'),
  port: yup
    .string()
    .matches(/^[0-9]*$/, 'Port must be a number')
    .required('Port is required'),
  method: yup
    .string()
    .oneOf(['http', 'sse', 'grpc', 'other'], "Method must be one of 'http', 'sse', 'grpc', 'other'")
    .required('Method is required'),
  required_env: yup.array().of(yup.string().required('Env variable name cannot be empty')).optional(),
})

export const toolVersionSchema = yup.object().shape({
  version: yup.string().required('Version string is required (e.g., 1.0.0)'),
  released: toolVersionReleasedSchema.required(),
})

export const toolSchema = yup.object({
  name: yup.string().required('Tool name is required'),
  description: yup.string().required('Description is required'),
  versions: yup.array().of(toolVersionSchema).min(1, 'At least one version is required').required(),
  on_status: yup.string().oneOf(['Online', 'Offline', 'Development', 'Deprecated'], 'Invalid status').required('Status is required'),
})
