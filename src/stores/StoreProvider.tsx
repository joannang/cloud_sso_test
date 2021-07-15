import * as React from 'react';
import TestStore from './TestStore';
import WalletStore from './WalletStore';

export interface StoreContext {
    testStore: TestStore;
    walletStore: WalletStore;
}

let stores: StoreContext | null = null;
const storeContext = React.createContext<StoreContext | null>(stores);

export const createStores = () => {
    stores = {
        testStore: new TestStore(),
        walletStore: new WalletStore(),
    };

    return stores;
};

export const useStores = (): StoreContext => {
    const stores = React.useContext<StoreContext | null>(storeContext);
    if (!stores) {
        // this is especially useful in TypeScript so you don't need to be checking for null all the time
        throw new Error('useStores must be used within a StoreProvider.');
    }
    return stores;
};


const StoreProvider = ({ children } : any) => {
    stores === null && createStores();
    return (
        <storeContext.Provider value={stores}>{children}</storeContext.Provider>
    );
};

export default StoreProvider;
