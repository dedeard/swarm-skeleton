import SwarmTextGradient from '@/components/ui/SwarmTextGradient'

const ActionCard: React.FC<{ title: string; desc: string; isRecomended?: boolean; action?: () => void }> = (props) => {
  return (
    <div
      onClick={props.action}
      className="flex cursor-pointer flex-col overflow-hidden rounded-lg border border-primary-500/20 hover:border-primary-500/50"
    >
      <div className="flex w-full flex-1 flex-col gap-3 px-3 py-4 text-sm">
        <div className="w-full text-center text-xl font-bold">
          <SwarmTextGradient>{props.title}</SwarmTextGradient>
        </div>
        <p className="text-center">{props.desc}</p>
      </div>
      {props.isRecomended && <div className="bg-primary-500/10 px-3 py-1 text-center text-xs text-primary-500">Recomended</div>}
      {!props.isRecomended && <div className="bg-neutral-500/10 px-3 py-1 text-center text-xs text-neutral-400">Alternative</div>}
    </div>
  )
}

export default ActionCard
