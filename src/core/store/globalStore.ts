import {createStore} from "../state";


export interface GlobalStoreTypes {
    message: string,
    loading: boolean,
}


const initialState: GlobalStoreTypes = {
    message: "",
    loading: false,
}

export const GlobalStore = {
    store: createStore<GlobalStoreTypes>(initialState),
    service: {
        errorStatus: (message: string) => {
            GlobalStore.store.setState({
                ...GlobalStore.store.getState(),
                message: message,
                loading: false
            })
        },

        loading: (value: boolean) => {
            GlobalStore.store.setState({
                ...GlobalStore.store.getState(),
                loading: value,
            })
        },
    }
}
