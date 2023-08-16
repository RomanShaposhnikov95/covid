import { useEffect, useRef, useState } from 'react'

interface IStore<T> {
    state: T
    setState: (value: T) => void
    getState: () => T
    listeners: Set<(value: T) => void>
    subscribe: (listener: (value: T) => void) => () => void
}

export const createStore = <T>(initialState: T): IStore<T> => {
    const store: IStore<T> = {
        state: initialState,
        setState: (value) => {
            store.state = value
            store.listeners.forEach((listener) => listener(value))
        },
        getState: () => store.state,
        listeners: new Set(),
        subscribe: (listener) => {
            store.listeners.add(listener)

            return (): boolean => store.listeners.delete(listener)
        },
    }

    return store
}

export const useObservable = <T>(observable: IStore<T>): T => {
    const [val, setVal] = useState(observable.state)
    const isMounted = useRef(true)

    const updateLocalState = (data: T): void => {
        if (isMounted.current) setVal(data)
    }

    useEffect(() => {
        updateLocalState(observable.state)
        return observable.subscribe(updateLocalState)
    }, [observable])

    useEffect(() => {
        isMounted.current = true
        return (): void => {
            isMounted.current = false
        }
    }, [])

    return val
}
