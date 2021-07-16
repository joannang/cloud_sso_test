const b2cPolicies = {
    names: {
        signUpSignIn: "B2C_1_signupsignin_dev",
        signUp: "B2C_1_signup",
        signIn: "B2C_1_signIn_dev",
        passwordReset: "B2C_1_PasswordReset_Dev"
    },
    authorities: {
        signIn: {
            authority: "https://devtinnolab.b2clogin.com/devtinnolab.onmicrosoft.com/B2C_1_signIn_dev"
        },
        signUp: {
            authority: "https://devtinnolab.b2clogin.com/devtinnolab.onmicrosoft.com/B2C_1_signup"
        },
        signUpSignIn: {
            authority: "https://devtinnolab.b2clogin.com/devtinnolab.onmicrosoft.com/B2C_1_signupsignin_dev",
        },
        passwordReset: {
            authority: "https://devtinnolab.b2clogin.com/devtinnolab.onmicrosoft.com/B2C_1_PasswordReset_Dev"
        }
    },
    authorityDomain: "devtinnolab.b2clogin.com"
}

export default b2cPolicies;