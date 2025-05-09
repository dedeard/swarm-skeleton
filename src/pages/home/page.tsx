import { useAgentStore } from '@/store/agent.store'
import { useLLMStore } from '@/store/llm.store'
import { useToolStore } from '@/store/tool.store'
import { LoaderFunction, Outlet } from 'react-router-dom'
import Navbar from './components/Navbar'

export const Component: React.FC = () => {
  return (
    <>
      <Outlet />
      <Navbar />
      <div className="flex min-h-screen flex-col items-center justify-center py-2">
        <h1 className="text-4xl font-bold">Welcome to the Home Page</h1>
        <p className="mt-4 text-lg">This is a simple home page</p>
      </div>
    </>
  )
}

export const loader: LoaderFunction = async () => {
  let promises = []
  const { agentsLoaded, fetchAgents } = useAgentStore.getState()
  const { toolsLoaded, fetchTools } = useToolStore.getState()
  const { LLMloaded, fetchLLMs } = useLLMStore.getState()

  if (!agentsLoaded) promises.push(fetchAgents())
  if (!toolsLoaded) promises.push(fetchTools())
  if (!LLMloaded) promises.push(fetchLLMs())

  await Promise.all(promises)

  return {}
}
