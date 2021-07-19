import {
  PublicClientApplication,
  AuthenticationResult,
  InteractionRequiredAuthError
} from "@azure/msal-browser";
import { msalConfig, loginRequest } from "./authConfig";
import b2cPolicies from "./policies";
import TestStore from '../stores/TestStore'
import publicIp from "public-ip";
import axios from "axios";
import MEWconnect from "@myetherwallet/mewconnect-web-client"
import Web3 from "web3"


export const msalInstance = new PublicClientApplication(msalConfig);

let accessToken = null;

let accountId = "";

//sign up
//sign in
//password reset

// export const mewConnecct = new MEWconnect.Provider([options])

// 'when using the redirect flows, handleRedirectPromise should be run on every page load'

export const handleRedirect = (testStore: TestStore) => {
  msalInstance
    .handleRedirectPromise()
    .then((response) => {
      if (response) {
        console.log("handle redirect response")
        console.log(response)
        const idTokenClaims = response.idTokenClaims;
        console.log( idTokenClaims)
        // if (
        //   idTokenClaims["tfp"].toUpperCase() ===
        //   b2cPolicies.names.signUpSignIn.toUpperCase()
        // ) {
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

export const signIn = async() => {
  if (await checkForWhitelistedIP()) {
    msalInstance.loginRedirect(loginRequest);
  } else {
    // error page 
    // or return to home page with error msg
  }
};

export const signOut = () => {

  const logoutRequest = {
    postLogoutRedirectUri: msalConfig.auth.logoutUri,
  };

  msalInstance.logoutRedirect(logoutRequest);
};


// ACCESS TOKEN STUFF (have to do this in conjunction with a registered API)
export function getTokenRedirect(request: any, testStore: TestStore) {

  /**
  * See here for more info on account retrieval: 
  * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-common/docs/Accounts.md
  */
  request.account = msalInstance.getAccountByHomeId(testStore.homeAccountId); 
 
  /**
   * 
   */
  return msalInstance.acquireTokenSilent(request)
      .then((response) => {
          // In case the response from B2C server has an empty accessToken field
          // throw an error to initiate token acquisition
          if (!response.accessToken || response.accessToken === "") {
              throw new InteractionRequiredAuthError();
          } else {
              console.log("access_token acquired at: " + new Date().toString());
              const accessToken = response.accessToken;
              console.log("access token: " + accessToken)
              // passTokenToApi();
          }
      }).catch(error => {
          console.log("Silent token acquisition fails. Acquiring token using popup. \n", error);
          if (error instanceof InteractionRequiredAuthError) {
              // fallback to interaction when silent call fails
              return msalInstance.acquireTokenRedirect(request);
          } else {
              console.log(error);   
          }
  });
}