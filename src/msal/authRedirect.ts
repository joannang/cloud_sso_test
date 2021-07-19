import {
  PublicClientApplication,
  AuthenticationResult,
} from "@azure/msal-browser";
import { msalConfig, loginRequest } from "./authConfig";
import b2cPolicies from "./policies";
import TestStore from '../stores/TestStore'
import publicIp from "public-ip";
import axios from "axios";

import WalletLink from 'walletlink'
import Web3 from 'web3'

export const msalInstance = new PublicClientApplication(msalConfig);

let accessToken = null;

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

// Initialize a Web3 object
export const web3 = new Web3(ethereum as any)

//sign up
//sign in
//password reset


// 'when using the redirect flows, handleRedirectPromise should be run on every page load'

export const handleRedirect = (testStore: TestStore) => {
  msalInstance
    .handleRedirectPromise()
    .then((response) => {
      if (response) {
        console.log("handle redirect response")
        console.log(response)
        const idTokenClaims = response.idTokenClaims;
        console.log(idTokenClaims)
        // if (
        //   idTokenClaims["tfp"].toUpperCase() ===
        //   b2cPolicies.names.signUpSignIn.toUpperCase()
        // ) {
        console.log('HELLO')
        handleResponse(response, testStore);
        // }
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

const setAccount = (account: any, testStore: TestStore) => {

  const accountId = account.homeAccountId;
  const username = account.username;
  testStore.setHomeAccountId(accountId);
  testStore.setUsername(username)
  // welcomeUser(username); <- this just to trigger a welcome user popup thing
};

const handleResponse = async (response: AuthenticationResult, testStore: TestStore) => {
  // other params returned from response:
  // https://azuread.github.io/microsoft-authentication-library-for-js/ref/modules/_azure_msal_common.html#authenticationresult
  if (response !== null) {
    setAccount(response.account, testStore);
  } else {
    console.log("OTHER");
    // selectAccount();
  }
};

// add getTokenRedirect


export const selectAccount = (testStore: TestStore) => {

  /**
   * See here for more information on account retrieval: 
   * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-common/docs/Accounts.md
   */

  const currentAccounts = msalInstance.getAllAccounts();

  if (currentAccounts.length < 1) {
      return;
  } else if (currentAccounts.length > 1) {
     
      /**
       * Due to the way MSAL caches account objects, the auth response from initiating a user-flow
       * is cached as a new account, which results in more than one account in the cache. Here we make
       * sure we are selecting the account with homeAccountId that contains the sign-up/sign-in user-flow, 
       * as this is the default flow the user initially signed-in with.
       */
       const accounts = currentAccounts.filter(account =>
          account.homeAccountId.toUpperCase().includes(b2cPolicies.names.signUpSignIn.toUpperCase())
          // &&
          // account.idTokenClaims.iss.toUpperCase().includes(b2cPolicies.authorityDomain.toUpperCase())
          // &&
          // account.idTokenClaims.aud === msalConfig.auth.clientId 
          );

      if (accounts.length > 1) {
          // localAccountId identifies the entity for which the token asserts information.
          if (accounts.every(account => account.localAccountId === accounts[0].localAccountId)) {
              // All accounts belong to the same user
              setAccount(accounts[0], testStore);
          } else {
              // Multiple users detected. Logout all to be safe.
              signOut();
          };
      } else if (accounts.length === 1) {
          setAccount(accounts[0], testStore);
      }

  } else if (currentAccounts.length === 1) {
      setAccount(currentAccounts[0], testStore);
  }
}


const checkForWhitelistedIP = async () => {
  const whiteListedAddresses = ['119.74.74.205', '222.164.133.232'];
 
  const ipv4 = await publicIp.v4();
  console.log(ipv4);
 
  for (let ipAddress of whiteListedAddresses) {
    if (ipAddress === ipv4) {
      return true;
    }
  }
  return false;
}

export const signIn = async () => {
    // Use eth_RequestAccounts
    ethereum.send('eth_requestAccounts').then(async (accounts: string[]) => {

    // Optionally, have the default account set for web3.js
    web3.eth.defaultAccount = accounts[0]

    console.log(`Account Address: ${web3.eth.defaultAccount}`)
    //console.log(`Provider: ${web3.eth.currentProvider}`)

    console.log('Chain ID:')
    await web3.eth.net.getId().then(console.log);
  
    console.log('Balance 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266:')
    await web3.eth.getBalance("0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266").then(console.log);

    console.log(`Balance ${web3.eth.defaultAccount}:`)
    await web3.eth.getBalance(web3.eth.defaultAccount).then(console.log);

    console.log(`Is Connected: ${ethereum.isConnected()}`);
  })
  // if (await checkForWhitelistedIP()) {
  //   msalInstance.loginRedirect(loginRequest);
  // } else {
  //   // error page 
  //   // or return to home page with error msg
  // }
};

export const signOut = () => {

  const logoutRequest = {
    postLogoutRedirectUri: msalConfig.auth.logoutUri,
  };

  msalInstance.logoutRedirect(logoutRequest);
};
