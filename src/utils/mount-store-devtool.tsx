import React, { useEffect, useRef } from 'react'
import { createRoot } from 'react-dom/client'
import type { StoreApi, UseBoundStore } from 'zustand'

export function mountStoreDevtool<T extends object = Record<string, any>>(
  storeName: string,
  store: UseBoundStore<StoreApi<T>>,
  rootElement?: HTMLElement,
) {
  type StoreState = ReturnType<UseBoundStore<StoreApi<T>>['getState']>

  const externalUpdates = { count: 0 }

  const ZustandDevtool: React.FC<StoreState> = (props) => {
    const allUpdatesCount = useRef(externalUpdates.count)

    useEffect(() => {
      allUpdatesCount.current += 1
      if (allUpdatesCount.current === externalUpdates.count + 1) {
        allUpdatesCount.current -= 1
        store.setState(props)
      }
    })

    return null
  }

  ZustandDevtool.displayName = `(${storeName}) devtool`

  rootElement = rootElement || document.getElementById(`zustand-devtools-${storeName}`) || document.createElement('div')
  rootElement.id = `zustand-devtools-${storeName}`
  document.body.appendChild(rootElement)

  const newRoot = createRoot(rootElement)
  const renderDevtool = (state: StoreState | void) => {
    if (!state) return
    newRoot.render(<ZustandDevtool {...state} />)
    externalUpdates.count += 1
  }

  renderDevtool(store.getState())
  store.subscribe(renderDevtool)
}
