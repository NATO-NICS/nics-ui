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
import {createContext} from 'react';
import {UserProfile} from "../models";

export const anonymous : UserProfile = {
    username: 'Anonymous',
    active: true,
    firstname: 'N',
    lastname: 'A',
    auth: true,
    userid: 0,
    userorgid: 0,
    userorg_workspace_id: 0,
    roles: [],
    userorgs : []
}



export default createContext<UserProfile>(anonymous);

export function hasRole(user: UserProfile, role: string) {
    if (user.auth) {
        return user.roles.includes(role) || user.roles.includes('superuser');
    } else {
        return true;
    }
}

// basic
export function isUser(user: UserProfile) {
    return hasRole(user, 'nics-user');
}
// org roles
export function isOrgOwner(user: UserProfile) {
    return hasRole(user, 'org-owner');
}

export function isOrgAdmin(user: UserProfile) {
    return hasRole(user, 'org-admin');
}

export function isOrgManager(user: UserProfile) {
    return hasRole(user, 'org-manager');
}