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

// import {AuthFlow} from "../auth/authflow";

import {
  OrgsModel,
  UsersModel,
  AdminUsersModel,
  OrganizationModel,
  UserDetailsModel,
  UserDetailsBody,
  ActiveIncidentsModel,
  ArchivedIncidentsModel,
  IncidentTypesModel,
  IncidentTypePayload,
  IncidentTypeDefaultPayload,
  IncidentTypeEditPayload,
  searchUsersModel,
  addUserToOrgPayload,
  addUserToOrgResponse,
  getInactiveOrgUserListResponse,
  SymbologyModel,
  SymbolModel,
  whoAmIModel,
  LanguageTranslationResponse
} from "../models";

const { REACT_APP_API_URL } = process.env;


export class AuthFlow {

};


export default class API {
    private auth: AuthFlow | undefined;

    constructor(auth: AuthFlow | undefined) {
        //this.config = config
        this.auth = auth;
    }

    private buildURL(path: string, params?: URLSearchParams): URL {
        let url = REACT_APP_API_URL + path;
        if (params) {
            url += '?' + params?.toString();
        }
        return new URL(url);
    }

    public DateReviver(key: string, value: any): any {
        if (( key === 'bub_date' || key === 'est_arrival' || key === 'load_date' || key === 'eta'
                || key === 'report_generation_date' || key === 'create_date') && typeof value === 'string') {
            return new Date(value);
        }
        return value;
    }

    private async makeRequestWithDatePadding<T>(url: URL): Promise<T> {
        const res = await fetch(url.toString(), {
            credentials: 'include'
        });
        let results = await res.text();
        let typed: T = JSON.parse(results, this.DateReviver);
        return typed;
    }

    private async makeJSONRequest<T>(url: URL): Promise<T> {
        const res = await fetch(url.toString(), {
            credentials: 'include'
        });
        let results: T = await res.json();
        return results;
    }

    private async makePost<T>(url: URL, body: string): Promise<T> {
        try {
            let postRequestOptions = {
                method: 'POST',
                headers: { 'accept': 'application/json', 'Content-Type': 'application/json' },
                body: body
            };
            let postResp = await fetch(url.toString(), postRequestOptions)

            //update the date/ID map with the new record ID
            if (postResp.ok) {
                let results = await postResp.text();
                return JSON.parse(results, this.DateReviver);
            }
        }
        catch(error) {
            console.log(error)
            // POST 409 error means record already exists
        }

        return Promise.reject();
    }

    private async makePut<T>(url: URL, body: string): Promise<T> {
        try {
            let postRequestOptions = {
                method: 'PUT',
                headers: { 'accept': 'application/json', 'Content-Type': 'application/json' },
                body: body
            };
            let postResp = await fetch(url.toString(), postRequestOptions)
          console.log('Put response!');
            console.log(postResp);
            //update the date/ID map with the new record ID
            if (postResp.ok) {
                let results = await postResp.text();
                return JSON.parse(results, this.DateReviver);
            }
        }
        catch(error) {
            console.log(error)
            // POST 409 error means record already exists
        }

        return Promise.reject();
    }

    // translations
    public async fetchLanguageTranslationCodes(): Promise<LanguageTranslationResponse> {
        let url = this.buildURL('/translation');
        return this.makeJSONRequest<LanguageTranslationResponse>(url);
    }

  public async updateTranslationKey(code: string, data: string): Promise<LanguageTranslationResponse> {
    let url = this.buildURL(`/translation/${code}`);
    return this.makePut<LanguageTranslationResponse>(url, data);
  }

}
