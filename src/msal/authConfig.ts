import b2cPolicies from './policies'
import { LogLevel } from '@azure/msal-browser'

export const msalConfig = {
    auth: {
        clientId: "088e1c4a-6560-43db-aefc-871e7545adbe", // This is the ONLY mandatory field; everything else is optional.
        authority: b2cPolicies.authorities.signIn.authority, // Choose sign-up/sign-in user-flow as your default.
        knownAuthorities: [b2cPolicies.authorityDomain], // You must identify your tenant's domain as a known authority.
        redirectUri: "https://localhost:3000/home", // You must register this URI on Azure Portal/App Registration. Defaults to "window.location.href".
        logoutUri: "https://localhost:3000/logout"
      },
    cache: {
        cacheLocation: "sessionStorage", // Configures cache location. "sessionStorage" is more secure, but "localStorage" gives you SSO between tabs.
        storeAuthStateInCookie: false, // If you wish to store cache items in cookies as well as browser cache, set this to "true".
    },
    system: {
      loggerOptions: {
        loggerCallback: (level: LogLevel, message: string, containsPii: boolean): void => {
          if (containsPii) {
            return;
          }
          switch (level) {
            case LogLevel.Error:
              console.error(message);
              return;
            case LogLevel.Info:
              console.info(message);
              return;
            case LogLevel.Verbose:
              console.debug(message);
              return;
            case LogLevel.Warning:
              console.warn(message);
              return;
          }
        }
      }
    }
    };

// i think can put codeChallenge and codeChallengeMethod inside also
// RedirectRequest extends AuthorizationUrlRequest
export const loginRequest = {
  // "https://devtinnolab.b2clogin.com/user.read",  // MICROSOFT GRAPH
  // "email", "profile", 
    scopes: ["https://devtinnolab.b2clogin.com/user.read", "openid", "offline_access"],
    response_mode: "fragment",

    /**POSSIBLE PARAMS */
    // authenticationScheme?: AuthenticationScheme;
    // redirectUri?: string;
    // extraScopesToConsent?: Array<string>;
    // responseMode?: ResponseMode;
    // codeChallenge?: string;
    // codeChallengeMethod?: string;
    // state?: string;
    // prompt?: string;
    // account?: AccountInfo;
    // loginHint?: string;
    // domainHint?: string;
    // sid?: string;
    // extraQueryParameters?: StringDict;
    // nonce?: string;
};

// dont need tokenRequest cos not using it to call API atm