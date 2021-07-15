import {
  PublicClientApplication,
  AuthenticationResult,
} from "@azure/msal-browser";
import { msalConfig, loginRequest } from "./authConfig";
import b2cPolicies from "./policies";
import TestStore from '../stores/TestStore'
import publicIp from "public-ip";
import axios from "axios";

export const msalInstance = new PublicClientApplication(msalConfig);

let accessToken = null;

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

export const signIn = () => {
  (async () => {
    const ipv4 = await publicIp.v4();
    console.log(ipv4)

    //do post request to api server
    axios.post('http://20.195.50.198/api/v1/ip', {
      ipAddress: ipv4
    }).then(res => {
      console.log("success!")
      console.log(res)
    }).catch(err => {
      console.log(err)
    }) 

    // msalInstance.loginRedirect(loginRequest);
  })();
};

export const signOut = () => {

  const logoutRequest = {
    postLogoutRedirectUri: msalConfig.auth.logoutUri,
  };

  msalInstance.logoutRedirect(logoutRequest);
};
