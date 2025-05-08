import EnhancedAuth from '@/components/features/auth/EnhancedAuth'

export const Component = () => {
  return (
    <div className="p-3">
      <h3 className="my-3 font-semibold">Security Settings</h3>
      <h4 className="mb-2 text-sm">Passkey Authentication</h4>

      <EnhancedAuth />
    </div>
  )
}
