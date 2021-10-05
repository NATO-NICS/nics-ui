/*
 * Copyright (c) 2008-2021, Massachusetts Institute of Technology (MIT)
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 * list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 * this list of conditions and the following disclaimer in the documentation
 * and/or other materials provided with the distribution.
 *
 * 3. Neither the name of the copyright holder nor the names of its contributors
 * may be used to endorse or promote products derived from this software without
 * specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

// import {
//     AuthorizationNotifier, AuthorizationRequest,
//     AuthorizationServiceConfiguration,
//     BaseTokenRequestHandler,
//     FetchRequestor, GRANT_TYPE_AUTHORIZATION_CODE, GRANT_TYPE_REFRESH_TOKEN,
//     RedirectRequestHandler, TokenRequest, TokenResponse
// } from "@openid/appauth";
//
// import { StringMap } from "@openid/appauth/built/types";
//
// // constants
// const openIdConnectUrl = 'https://dev3.nics.ll.mit.edu/auth/realms/';
// const clientId = 'cct-web';
// const scope = 'openid';
// const redirectUri = new URL('/redirect.html', window.location.href).toString();
//
//
// export class AuthFlow {
//     private requestor: FetchRequestor;
//     private notifier: AuthorizationNotifier;
//     private authorizationHandler: RedirectRequestHandler;
//     private tokenHandler: BaseTokenRequestHandler;
//
//     // state
//     private configuration: AuthorizationServiceConfiguration | undefined;
//
//     private refreshToken: string | undefined;
//     private accessTokenResponse: TokenResponse | undefined;
//
//     private authorizationStarted: boolean = false;
//     private authorizationCompleted: boolean = false;
//
//     constructor() {
//         this.requestor = new FetchRequestor();
//         this.notifier = new AuthorizationNotifier();
//         this.authorizationHandler = new RedirectRequestHandler();
//         this.tokenHandler = new BaseTokenRequestHandler(this.requestor);
//         // set notifier to deliver responses
//         this.authorizationHandler.setAuthorizationNotifier(this.notifier);
//         // set a listener to listen for authorization responses
//         this.notifier.setAuthorizationListener((request : any, response : any, error : any) => {
//             console.log('Authorization request complete!');
//             console.log(response);
//             console.log(error);
//             if (response) {
//                 console.info(`Authorization Code ${response.code}`);
//                 let codeVerifier: string | undefined;
//                 if(request.internal && request.internal.code_verifier) {
//                     codeVerifier = request.internal.code_verifier;
//                 }
//
//                 this.makeRefreshTokenRequest(response.code, codeVerifier)
//                     .then(res => {
//                         console.log('Got refresh token response', res);
//                         return this.performWithFreshTokens();
//                     })
//                     .then(() => {
//                         console.log('Completed refresh token request and performed with fresh tokens!');
//                         this.authorizationCompleted = true;
//                     })
//             }
//         });
//
//         // this.fetchServiceConfiguration();
//         console.log('AuthFlow initialized');
//     }
//
//     checkAuthorizationCompleted(): boolean {
//         return this.authorizationCompleted;
//     }
//
//     checkAuthorizationStarted(): boolean {
//         return this.authorizationStarted;
//     }
//
//     loggedIn(): boolean {
//         return !!this.accessTokenResponse && this.accessTokenResponse.isValid();
//     }
//
//     login(): Promise<void> {
//         if (!this.loggedIn()) {
//             console.log('Logging in');
//             this.authorizationStarted = true;
//             return this.makeAuthorizationRequest();
//             // return this.fetchServiceConfiguration().then(
//             //     () => this.makeAuthorizationRequest());
//         } else {
//             console.log('logged in already!');
//             return Promise.resolve();
//         }
//     }
//
//     completeAuthorizationIfPossible(): Promise<void> {
//         return this.authorizationHandler.completeAuthorizationRequestIfPossible();
//     }
//
//     fetchServiceConfiguration(): Promise<AuthorizationServiceConfiguration> {
//         console.log('Fetching service authorization');
//         return AuthorizationServiceConfiguration.fetchFromIssuer(openIdConnectUrl, this.requestor)
//             .then(response => {
//                 console.log('Fetched service configuration', response);
//                 this.configuration = response;
//                 return response;
//             })
//             // .catch(error => {
//             //     console.error('Something bad happened!', error);
//             // });
//     }
//
//     generateRedirectUrl(): string {
//         return redirectUri + '?path=' + window.location.pathname;
//     }
//
//     makeAuthorizationRequest(): Promise<void> {
//         console.log('Making authorization request');
//         // create a request
//         let request = new AuthorizationRequest({
//             client_id: clientId,
//             redirect_uri: this.generateRedirectUrl(),
//             scope: scope,
//             response_type: AuthorizationRequest.RESPONSE_TYPE_CODE,
//             state: undefined,
//             extras: {'prompt': 'consent', 'access_type': 'offline'}
//         });
//
//         if (this.configuration) {
//             console.log('Have configuration, in makeAuthorizationRequest');
//             this.authorizationHandler.performAuthorizationRequest(this.configuration, request);
//             return Promise.resolve();
//         } else {
//             console.log('No configuration yet!');
//             return this.fetchServiceConfiguration().then((config: AuthorizationServiceConfiguration | undefined) => {
//                 if (config !== undefined) {
//                     this.configuration = config;
//                     console.log('Got config', this.configuration);
//                     return this.authorizationHandler.performAuthorizationRequest(this.configuration, request);
//                 } else if (config === undefined) {
//                     console.error('Something bad happened!');
//                 }
//                 else {
//                     return Promise.resolve();
//                 }
//
//                 return Promise.reject();
//             })
//         }
//     }
//
//     // from google
//     private makeRefreshTokenRequest(code: string, codeVerifier: string|undefined): Promise<void> {
//         if (!this.configuration) {
//             console.log('Missing config, requesting...');
//             return this.fetchServiceConfiguration().then((config) => {
//                 return this.makeRefreshTokenRequest(code, codeVerifier);
//             });
//
//             // console.error('Unknown service configuration!');
//             // return Promise.resolve();
//         } else {
//             const extras: StringMap = {};
//
//             if(codeVerifier) {
//                 extras.code_verifier = codeVerifier;
//             }
//
//             // use the code to make the token request.
//             let request = new TokenRequest({
//                 client_id: clientId,
//                 redirect_uri: this.generateRedirectUrl(),
//                 grant_type: GRANT_TYPE_AUTHORIZATION_CODE,
//                 code: code,
//                 refresh_token: undefined,
//                 extras: extras
//             });
//
//             return this.tokenHandler
//                 .performTokenRequest(this.configuration, request)
//                 .then(response => {
//                     console.log(`Refresh Token is ${response.refreshToken}`);
//                     this.refreshToken = response.refreshToken;
//                     this.accessTokenResponse = response;
//                     return response;
//                 })
//                 .then(() => {});
//         }
//     }
//
//     performWithFreshTokens(): Promise<string> {
//         if (!this.configuration) {
//             console.log('No config, requesting...');
//             return this.fetchServiceConfiguration().then((config) => {
//                 return this.performWithFreshTokens();
//             });
//             // console.log("Unknown service configuration");
//             // return Promise.reject("Unknown service configuration");
//         }
//
//         if (this.configuration !== undefined) {
//             if (!this.refreshToken) {
//                 console.log("Missing refreshToken.");
//                 return Promise.resolve("Missing refreshToken.");
//             }
//             if (this.accessTokenResponse && this.accessTokenResponse.isValid()) {
//                 // do nothing
//                 return Promise.resolve(this.accessTokenResponse.accessToken);
//             }
//             let request = new TokenRequest({
//                 client_id: clientId,
//                 redirect_uri: this.generateRedirectUrl(),
//                 grant_type: GRANT_TYPE_REFRESH_TOKEN,
//                 code: undefined,
//                 refresh_token: this.refreshToken,
//                 extras: undefined
//             });
//
//             return this.tokenHandler
//                 .performTokenRequest(this.configuration, request)
//                 .then(response => {
//                     this.accessTokenResponse = response;
//                     return response.accessToken;
//                 });
//         }
//         return Promise.reject();
//     }
// }

export {}
