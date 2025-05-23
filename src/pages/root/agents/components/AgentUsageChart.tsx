import React from 'react'

export function AgentUsageChart({ values = [2, 8, 4, 12, 6], color }: { values?: number[]; color: string }) {
  const [liveValues, setLiveValues] = React.useState<number[]>(values)

  // Update data every 2 seconds
  React.useEffect(() => {
    const interval = setInterval(() => {
      setLiveValues((prev) => {
        const newValues = [...prev]
        const randomChange = Math.random() * 4 - 2
        const lastValue = newValues[newValues.length - 1]
        const newValue = Math.max(1, Math.min(15, lastValue + randomChange))
        newValues.shift()
        newValues.push(newValue)
        return newValues
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const maxValue = Math.max(...liveValues, 1)

  return (
    <div className="w-full">
      <div className="mb-0.5 text-right text-[0.45rem] text-neutral-600 dark:text-neutral-400">Live usage</div>
      <div className="relative flex h-8 items-end justify-between gap-[2px] overflow-hidden rounded-sm">
        <div className="absolute inset-0 animate-pulse rounded-sm opacity-10" style={{ backgroundColor: color }} />
        {liveValues.map((value, index) => {
          const heightPercent = (value / maxValue) * 100
          return (
            <div key={index} className="z-10 flex-1">
              <div
                className="w-full rounded-t-sm transition-all duration-500"
                style={{
                  height: `${heightPercent}%`,
                  background: `linear-gradient(to top, ${color}80, ${color})`,
                  boxShadow: `0 0 2px ${color}40`,
                  minHeight: '2px',
                  opacity: 0.75,
                }}
              />
            </div>
          )
        })}
      </div>
      <div className="mt-1 text-right">
        <span className="rounded-sm text-sm text-neutral-700 dark:text-neutral-300">Costs: $0.12</span>
      </div>
    </div>
  )
}
