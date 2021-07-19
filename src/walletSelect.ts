import WalletLink from "walletlink";
import MEWconnect from "@myetherwallet/mewconnect-web-client";
import Web3 from "web3";

const APP_NAME = 'My Test App'
const APP_LOGO_URL = 'https://global-uploads.webflow.com/5e157547d6f791d34ea4e2bf/6087f2b060c7a92408bac811_logo.svg'
const ETH_JSONRPC_URL = 'http://127.0.0.1:8545/'
const CHAIN_ID = 31337

// Initialize WalletLink
export const walletLink = new WalletLink({
  appName: APP_NAME,
  appLogoUrl: APP_LOGO_URL,
  darkMode: false
})

// Initialize a Web3 Provider object
export const ethereum = walletLink.makeWeb3Provider(ETH_JSONRPC_URL, CHAIN_ID)
export const web3 = new Web3(ethereum as any)

export const MewConnect = new MEWconnect.Provider();
export const MewConnectProvider = MewConnect.makeWeb3Provider(
  CHAIN_ID,
  ETH_JSONRPC_URL,
  true
);

export const connectToMEW = async () => {
  const accounts = await MewConnect.enable();
  web3.eth.defaultAccount = accounts[0];
  console.log(web3.eth.defaultAccount);
};

export const connectToCoinbaseWallet = async () => {
  // Use eth_RequestAccounts
  ethereum.send("eth_requestAccounts").then(async (accounts: string[]) => {
    // Optionally, have the default account set for web3.js
    web3.eth.defaultAccount = accounts[0];

    console.log(`Account Address: ${web3.eth.defaultAccount}`);
    //console.log(`Provider: ${web3.eth.currentProvider}`)

    console.log("Chain ID:");
    await web3.eth.net.getId().then(console.log);

    console.log("Balance 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266:");
    await web3.eth
      .getBalance("0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266")
      .then(console.log);

    console.log(`Balance ${web3.eth.defaultAccount}:`);
    await web3.eth.getBalance(web3.eth.defaultAccount).then(console.log);

    console.log(`Is Connected: ${ethereum.isConnected()}`);

    let wallet = web3.eth.accounts.wallet;
    console.log(wallet.length);

    web3.eth
      .sendTransaction({
        from: "",
        to: "",
        value: "2000000000000000000",
      })
      .on("transactionHash", function (hash) {})
      .on("receipt", function (receipt) {})
      .on("confirmation", function (confirmationNumber, receipt) {})
      .on("error", console.error);
  });
};
