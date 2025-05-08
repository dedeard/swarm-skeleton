import { Outlet, useNavigate } from 'react-router-dom'
import PopupNavbar from './components/PopupNavbar'

export const Component = () => {
  const navigate = useNavigate()
  return (
    <div className="fixed bottom-0 left-0 right-0 top-0 z-[100] backdrop-blur">
      <div className="relative z-10 ml-auto h-full w-[800px] border-l border-primary-500/20 bg-white shadow dark:bg-neutral-950">
        <PopupNavbar>Settings</PopupNavbar>
        <Outlet />
      </div>
      <span className="absolute inset-0 block" onClick={() => navigate('/')} />
    </div>
  )
}
