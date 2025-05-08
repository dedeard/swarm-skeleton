import React from 'react'

const MainCard: React.FC<React.PropsWithChildren<{ title: string; action?: React.ReactNode }>> = ({ title, action, children }) => {
  return (
    <div className="flex flex-col gap-6 rounded-lg border border-primary-500/20 p-6 hover:border-primary-500/50">
      <div className="flex items-center justify-between">
        <span className="block">{title}</span>
        {action}
      </div>
      {children}
    </div>
  )
}

export default MainCard
