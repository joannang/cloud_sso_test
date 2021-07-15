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
}


class TestStore {

    homeAccountId = '';
    username = '';
    loggedIn = (this.homeAccountId || this.homeAccountId !== '') ? true : false; // if username not null or empty str, is logged in
    testWalletAddress = '';
    modalOpen = false;


    constructor() {
        makeObservable(this, {
            homeAccountId: observable,
            username: observable,
            testWalletAddress: observable,
            modalOpen: observable,
            setHomeAccountId: action,
            setUsername: action,
            setTestWalletAddress: action,
            setModalOpen: action,
        })
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