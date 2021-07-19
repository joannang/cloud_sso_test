import {
    observable,
    action,
    runInAction,
    computed,
    makeObservable,
    autorun,
} from 'mobx';

interface TestStore {
    homeAccountId: string;
    username: string;
    loggedIn: boolean;
    testWalletAddress: string;
    modalOpen: boolean;
    walletAddresses: string[];
}


class TestStore {

    homeAccountId = '';
    username = '';
    loggedIn = (this.homeAccountId || this.homeAccountId !== '') ? true : false; // if username not null or empty str, is logged in
    testWalletAddress = '';
    modalOpen = false;
    walletAddresses = ["0xffeb2ac156e8c53bf5b50af07...", "0x66eb2ac156e8c53bfb50af07a..."]
    


    constructor() {
        makeObservable(this, {
            homeAccountId: observable,
            username: observable,
            testWalletAddress: observable,
            modalOpen: observable,
            walletAddresses: observable,
            setHomeAccountId: action,
            setUsername: action,
            setTestWalletAddress: action,
            setModalOpen: action,
            setWalletAddresses: action,
        })
    }

    setWalletAddresses = (addresses: []) => {
        this.walletAddresses = addresses;
    }

    setModalOpen = (open: boolean) => {
        this.modalOpen = open;
    }

    setTestWalletAddress = (addr: string) => {
        this.testWalletAddress = addr;
    }

    setHomeAccountId = (id: string) => {
        this.homeAccountId = id;
    }

    setUsername = (username: string) => {
        this.username = username;
    }

}

export default TestStore;