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
import { numberComparer } from "@material-ui/data-grid";
import { UserPreferences } from "typescript";
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
  LanguageTranslationModel,
  AllIncidentModel,
  OrgsDefaultIncidentTypes,
  UserContactsModel,
  UserProfile,
  AllOrgTypesModel,
  AllCountriesModel,
  AllContactTypesModel,
  UserModel,
  ContactTypeModel,
  ContactModel,
  RegionModel,
  RegionsModel,
  CountriesModel,
  RegionEditPayload,
  LanguageModel,
  UserOverviewModel,
  GlobalUserModel,
  UserOrgModel,
  UserWorkspacesModel,
  LoggedInWhoAmIModel,
  LoggedInUserModel
} from "../models";

const { REACT_APP_API_URL } = process.env;

export function getUserWorkspaces() {
  return fetch(REACT_APP_API_URL + "/workspace", {
    credentials: "include",
  }).then((data) => {
    if (!data.ok) {
      throw new Error(data.statusText);
    }
    return data.json() as Promise<UserWorkspacesModel>;
  });
}


//TODO make sure this returns TRUE when it's actually true
export function checkIfSuper(workspaceId:number) {
    return fetch(`${REACT_APP_API_URL}/users/${workspaceId}/super`, {
      credentials: "include",
    })
    .then((response) => {     
      if (response.status == 200) {
        return true;
      }
      return false;
    })
  }

  export function getLoggedInUserModel(workspaceId:number) {
    return fetch(`${REACT_APP_API_URL}/users/${workspaceId}/whoami`, {
      credentials: "include",
    }).then((data) => {
      if (!data.ok) {
        throw new Error(data.statusText);
      }
      return data.json() as Promise<LoggedInWhoAmIModel>;
    })
  }


export function getLoggedInUser(workspaceId:number) {
  return fetch(REACT_APP_API_URL + "/users/" + workspaceId + "/whoami", {
    credentials: "include",
  }).then((data) => {
    if (!data.ok) {
      console.error(data.statusText);
    }
    return data.json() as Promise<whoAmIModel>;
  })
}



export function getSuperOrgs(workspaceId:number) {
  return fetch(REACT_APP_API_URL + "/orgs/" + workspaceId + "/all", {
    credentials: "include",
  }).then((data) => {
    if (!data.ok) {
      throw new Error(data.statusText);
    }
    return data.json() as Promise<OrgsModel>;
  });
}

export function getAdminOrgs(workspaceId:number, userid: number) {
  return fetch(REACT_APP_API_URL + "/orgs/" + workspaceId + "/admin?userId=" + userid.toString(), {
    credentials: "include",
  }).then((data) => {
    if (!data.ok) {
      console.error(data.statusText);
    }
    return data.json() as Promise<OrgsModel>;
  });
}

export function getOrgTypes(workspaceId:number) {
  return fetch(REACT_APP_API_URL + '/orgs/' + workspaceId + '/types', {
    credentials: "include",
  }).then((data) => {
    if (!data.ok) {
      throw new Error(data.statusText);
    }
    return data.json() as Promise<AllOrgTypesModel>;
  })
}


//TODO un-hardcode this URL
export function getLanguages() {
  return fetch('https://dev3.hadrsys.info/static/translations/registry.json', {
    credentials: "include",
  }).then((data) => {
    if (!data.ok) {
      throw new Error(data.statusText);
    }
    return data.json() as Promise<LanguageModel[]>;
  })
}

export function addOrgTypeToOrg(workspaceId:number, orgid: number, orgtypeid: number) {
  const requestOptions: RequestInit = {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  };

  return fetch(`${REACT_APP_API_URL}/orgs/${workspaceId}/orgtype/add/${orgid}/${orgtypeid}`, requestOptions)
    .then((data) => {      
      if (!data.ok) {
        throw new Error(data.statusText);
      }
      return data.json() as Promise<OrganizationModel>;
    })
    .catch((error) => {
      console.log(error);
      return null;
    });
}

export function getCountriesAddOrg() {
  return fetch(REACT_APP_API_URL + '/country', {
    credentials: "include",
  }).then((data) => {
    if (!data.ok) {
      throw new Error(data.statusText);
    }
    return data.json() as Promise<AllCountriesModel>;
  })
}


export function getAdminUsers(workspaceId:number) {
  return fetch(REACT_APP_API_URL + "/users/" + workspaceId + "/admin", {
    credentials: "include",
  }).then((data) => {
    if (!data.ok) {
      console.error(data.statusText);
    }
    return data.json() as Promise<AdminUsersModel>;
  });
}

export function getSpecEnableUser(workspaceId:number, orgId: number) {
  return fetch(REACT_APP_API_URL + "/users/" + workspaceId + "/enabled/" + orgId.toString(), {
    credentials: "include",
  })
    .then((data) => {
      if (!data.ok) {
        console.error(data.statusText);
      }
      return data.json() as Promise<UsersModel>;
    })
    .catch((error) => {
      console.log(error);
      return null;
    });
}

export function getSpecDisableUser(workspaceId:number, orgId: number) {
  return fetch(REACT_APP_API_URL + "/users/" + workspaceId + "/disabled/" + orgId.toString(), {
    credentials: "include",
  })
    .then((data) => {
      if (!data.ok) {
        console.error(data.statusText);
      }
      return data.json() as Promise<UsersModel>;
    })
    .catch((error) => {
      console.log(error);
      return null;
    });
}

//users/1/contacttypes
export function getAllContactTypes(workspaceId:number) {
  return fetch(REACT_APP_API_URL + "/users/" + workspaceId + "/contacttypes", {
    method: "GET",
    credentials: "include",
  })
    .then((data) => {

      if (!data.ok) {
        throw new Error(data.statusText);
      }
      return data.json() as Promise<AllContactTypesModel>;
    })
    .catch((error) => {
      console.log(error);
      return null;
    });
}

export function getUserContacts(workspaceId:number, username: string) {
  return fetch(REACT_APP_API_URL + "/users/" + workspaceId + "/contactinfo?userName=" + username, {
    method: "GET",
    credentials: "include",
  })
    .then((data) => {
      if (!data.ok) {
        throw new Error(data.statusText);
      }
      return data.json() as Promise<UserContactsModel>;
    })
    .catch((error) => {
      console.log(error);
      return null;
    });
}

export function getUserContactsOrgDetails(workspaceId:number, username: string) {
  return fetch(REACT_APP_API_URL + "/users/" + workspaceId + "/contactinfo?userName=" + username, {
    method: "GET",
    credentials: "include",
  })
    .then((data) => {
      if (!data.ok) {
        throw new Error(data.statusText);
      }
      return data.json() as Promise<AllContactTypesModel>;
    })
    .catch((error) => {
      console.log(error);
      return null;
    });
}

export function updateUserContacts(workspaceId:number, user: UserModel, contact: ContactModel) {
  const requestOptions: RequestInit = {
    method: "POST",
    credentials: "include",
    headers: { 
      "Content-Type": "application/json"
  
  },
    body: JSON.stringify({})
  };


  return fetch(REACT_APP_API_URL + "/users/" + workspaceId + "/updatecontactinfo?userName=" + user.username + "&contactTypeId=" + contact.contactType.contactTypeId.toString() + "&value=" + contact.value, requestOptions)
    .then((data) => {      
      if (!data.ok) {
        throw new Error(data.statusText);
      }
      return data.json() as Promise<UserContactsModel>;
    })
    .catch((error) => {
      console.log(error);
      return null;
    });
}

export function deleteUserContact(workspaceId:number, user: UserModel, contact: ContactModel) {
  

  const requestOptions: RequestInit = {
    method: "DELETE",
    credentials: "include",
    headers: { 
      "Content-Type": "application/json"
  
  },
    body: JSON.stringify({})
  };

  return fetch(REACT_APP_API_URL + "/users/" + workspaceId + "/deletecontactinfo?userName=" + user.username + "&contactId=" + contact.contactid.toString(), requestOptions)
    .then((data) => {      
      if (!data.ok) {
        throw new Error(data.statusText);
      }
      return data.json() as Promise<UserContactsModel>;
    })
    .catch((error) => {
      console.log(error);
      return null;
    });
}

export function getUserByFirstAndLastName(workspaceId:number, first : string, last: string) {

  first = first.toString();
  last = last.toString();
  return fetch(REACT_APP_API_URL + "/users/" + workspaceId + "/find??exact=true&firstName=" + first + "&lastName=" + last, {
    method: "GET",
    credentials: "include",
  })
    .then((data) => {
      if (!data.ok) {
        throw new Error(data.statusText);
      }
      return data.json() as Promise<searchUsersModel>;
    })
    .catch((error) => {
      console.log(error);
      return null;
    });
}

export function setUserActiveStatus(workspaceId:number, user : GlobalUserModel, requester : UserProfile) {
  const requestOptions: RequestInit = {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({})
  };

  //TODO get user org workspace id (ask Steph or Jared)
  return fetch(REACT_APP_API_URL + "/users/" + workspaceId + "/" + user.userid.toString() + "?active=" + user.active, requestOptions)
    .then((data) => {
      if (!data.ok) {
        throw new Error(data.statusText);
      }
      return data.json() as Promise<UserModel>;
    })
    .catch((error) => {
      console.log(error);
      return null;
    });
}



export function getUserOverview(workspaceId:number, userId: number) {
  return fetch(REACT_APP_API_URL + "/users/" + workspaceId + "/" + userId.toString(), {
    credentials: "include",
  })
    .then((data) => {

      if (!data.ok) {
        throw new Error(data.statusText);
      }
      return data.json() as Promise<UserOverviewModel>;
    })
    .catch((error) => {
      console.log(error);
      return null;
    });
}



export function postOrganization(workspaceId:number, addOrgPayload: OrganizationModel) {
  const requestOptions: RequestInit = {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(addOrgPayload)
  };

  return fetch(REACT_APP_API_URL + "/orgs/" + workspaceId,
    requestOptions,
  ).then((data) => {
    if (!data.ok) {
      throw new Error(data.statusText);
    }
    return data.json() as Promise<OrgsModel>;
  });
}


export function postUserToOrg(workspaceId:number, addToOrgPayload: addUserToOrgPayload) {
  const requestOptions: RequestInit = {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(addToOrgPayload.userIds),
  };
  return fetch(
    REACT_APP_API_URL + "/users/" + workspaceId + "/userorg?orgId=" + addToOrgPayload.orgId.toString(),
    requestOptions
  )
    .then((data) => {
      if (!data.ok) {
        console.error(data.statusText);
      }
      
      return data.json() as Promise<addUserToOrgResponse>;

    })
    .catch((error) => {
      console.log(error);
      return null;
    });
}

export function updateOrg(orgData: OrganizationModel) {
  const requestOptions: RequestInit = {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orgData),
  };
  return fetch(
    REACT_APP_API_URL + "/orgs/" + orgData.orgId.toString(),
    requestOptions
  )
    .then((data) => {
      
      if (!data.ok) {
        console.error(data.statusText);
      }
      return data.json() as Promise<UsersModel>;
    })
    .catch((error) => {
      console.log(error);
      return null;
    });
}

export function getUserDetails(
  workspaceId:number,
  username: string,
  userOrgId: number,
  orgId: number
) {
  return fetch(
    REACT_APP_API_URL +
      "/users/" + workspaceId + "/username/" +
      username +
      "/userOrgId/" +
      userOrgId.toString() +
      "/orgId/" +
      orgId.toString(),
    {
      credentials: "include",
    }
  )
    .then((data) => {

      if (!data.ok) {
        console.error(data.statusText);
      }
      return data.json() as Promise<UserDetailsModel>;
    })
    .catch((error) => {
      console.log(error);
      return null;
    });
}

export function getActiveIncidents(workspaceId:number, orgId: number) {
  return fetch(REACT_APP_API_URL + "/incidents/" + workspaceId + "/active/" + orgId.toString(), {
    credentials: "include",
  })
    .then((data) => {
      if (!data.ok) {
        console.error(data.statusText);
      }
      return data.json() as Promise<ActiveIncidentsModel>;
    })
    .catch((error) => {
      console.log(error);
      return null;
    });
}

export function getArchivedIncidents(workspaceId:number, orgId: number) {
  return fetch(
    REACT_APP_API_URL + "/folder/" + workspaceId + "/incident/archived/" + orgId.toString(),
    {
      credentials: "include",
    }
  )
    .then((data) => {
      if (!data.ok) {
        console.error(data.statusText);
      }
      return data.json() as Promise<ArchivedIncidentsModel>;
    })
    .catch((error) => {
      return null;
    });
}

export function getIncidentTypes(workspaceId:number, orgId: number) {
  return fetch(REACT_APP_API_URL + "/orgs/" + workspaceId + "/incidenttype/" + orgId.toString(), {
    credentials: "include",
  })
    .then((data) => {
      if (!data.ok) {
        console.error(data.statusText);
      }
      return data.json() as Promise<IncidentTypesModel>;
    })
    .catch((error) => {
      return null;
    });
}

//https://dev3.hadrsys.info/api/v1/users/1/disabled/1
export function getOrgInactiveUsers(workspaceId:number, orgId: number) {
  return fetch(REACT_APP_API_URL + "/users/" + workspaceId + "/disabled/" + orgId.toString(), {
    credentials: "include",
  })
    .then((data) => {
      if (!data.ok) {
        console.error(data.statusText);
      }
      return data.json() as Promise<getInactiveOrgUserListResponse>;
    })
    .catch((error) => {
      console.log(error);
      return null;
    });
}




export function updateUser(userData: UserDetailsModel) {
  let buffer: UserDetailsBody = Object.assign({}, userData);
  buffer = {
    ...buffer,
    userName: buffer.username,
    firstName: buffer.userFirstname,
    lastName: buffer.userLastname,
    jobDesc: buffer.description,
  };

  delete buffer.username;
  delete buffer.orgId;
  delete buffer.userFirstname;
  delete buffer.userLastname;
  delete buffer.description;

  const requestOptions: RequestInit = {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(buffer),
  };

  return fetch(
    REACT_APP_API_URL +
      "/users/" +
      userData.orgId.toString() +
      "/updateprofile?requestingUserOrgId=" +
      userData.userOrgId.toString(),
    requestOptions
  )
    .then((data) => {
      if (!data.ok) {
        console.error(data.statusText);
      }
      return data.json() as Promise<UserDetailsModel>;
    })
    .catch((error) => {
      console.log(error);
      return null;
    });
}


export function updateUserDefaultLanguages(userData: UserProfile, org: UserOrgModel) {
  let buffer: UserProfile = Object.assign({}, userData);
  buffer = {
    ...buffer,
    username: buffer.username,
    firstname: buffer.firstname,
    lastname: buffer.lastname,
    userorgs : buffer.userorgs,

  };

  const requestOptions: RequestInit = {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(buffer),
  };

  return fetch(
    REACT_APP_API_URL +
      "/users/" +
      org.orgId.toString() +
      "/updateprofile?requestingUserOrgId=" +
      org.userorgid.toString(),
    requestOptions
  )
    .then((data) => {
      console.log("after updating languages");
      console.log(data);
      if (!data.ok) {
        throw new Error(data.statusText);
      }
      return data.json() as Promise<UserDetailsModel>;
    })
    .catch((error) => {
      console.log(error);
      return null;
    });
}

export function addIncidentType(workspaceId:number, incidentTypeData: IncidentTypePayload) {
  const requestOptions: RequestInit = {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(incidentTypeData),
  };
  return fetch(REACT_APP_API_URL + "/incidents/" + workspaceId + "/incidenttypes", requestOptions)
    .then((data) => {
      if (!data.ok) {
        console.error(data.statusText);
      }
      return data.json() as Promise<IncidentTypePayload>;
    })
    .catch((error) => {
      console.log(error);
      return null;
    });
}

export function addActive(workspaceId:number, data: number[], orgid: number) {
  const requestOptions: RequestInit = {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };
  return fetch(
    REACT_APP_API_URL + "/orgs/" + workspaceId + "/incidenttype/add/" + orgid,
    requestOptions
  )
    .then((data) => {
      if (!data.ok) {
        console.error(data.statusText);
      }
      return data.json() as Promise<number[]>;
    })
    .catch((error) => {
      console.log(error);
      return null;
    });
}

export function addInactive(workspaceId:number, data: number[], orgid: number) {
  const requestOptions: RequestInit = {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };
  return fetch(
    REACT_APP_API_URL + "/orgs/" + workspaceId + "/incidenttype/remove/" + orgid,
    requestOptions
  )
    .then((data) => {
      if (!data.ok) {
        console.error(data.statusText);
      }
      return data.json() as Promise<number[]>;
    })
    .catch((error) => {
      console.log(error);
      return null;
    });
}



export function changeUserStatus(
  workspaceId:number,
  userorg_workspace_id: number,
  userid: number,
  status: boolean
) {
  const requestOptions: RequestInit = {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  };
  return fetch(
    REACT_APP_API_URL +
      "/users/" + workspaceId + "/enable/" +
      userorg_workspace_id.toString() +
      "/userid/" +
      userid.toString() +
      "?enabled=" +
      status,
    requestOptions
  )
    .then((data) => {
      if (!data.ok) {
        console.error(data.statusText);
      }
      return data.json() as Promise<UserDetailsModel>;
    })
    .catch((error) => {
      console.log(error);
      return null;
    });
}

export function getOrgincidenttypeid(workspaceId:number, orgid: number) {
  return fetch(REACT_APP_API_URL + "/orgs/" + workspaceId + "/incidenttype/" + orgid.toString(), {
    credentials: "include",
  }).then((data) => {
    if (!data.ok) {
      throw new Error(data.statusText);
    }
    return data.json() as Promise<IncidentTypesModel>;
  });
}

export function changeDefault(
  workspaceId:number,
  data: IncidentTypeDefaultPayload,
  orgIncidenttypeid: number
) {
  const requestOptions: RequestInit = {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };

  return fetch(
    REACT_APP_API_URL +
      "/orgs/" + workspaceId + "/incidenttype/default/" +
      orgIncidenttypeid.toString(),
    requestOptions
  )
    .then((data) => {
      if (!data.ok) {
        console.error(data.statusText);
      }
      return data.json() as Promise<IncidentTypesModel>;
    })
    .catch((error) => {
      console.log(error);
      return null;
    });
}



export function editIncidentType(workspaceId:number, data: IncidentTypeEditPayload) {
  const requestOptions: RequestInit = {
    method: "PUT",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };
  return fetch(
    REACT_APP_API_URL +
      "/incidents/" + workspaceId + "/incidenttypes/" +
      data.incidentTypeId.toString(),
    requestOptions
  )
    .then((data) => {
      if (!data.ok) {
        console.error(data.statusText);
      }
      return data.json() as Promise<UserDetailsModel>;
    })
    .catch((error) => {
      console.log(error);
      return null;
    });
}

export function getAllIncidentTypes(workspaceId:number) {
  return fetch(REACT_APP_API_URL + "/incidents/" + workspaceId + "/incidenttypes", {
    credentials: "include",
  }).then((data) => {
    if (!data.ok) {
      throw new Error(data.statusText);
    }
    return data.json() as Promise<AllIncidentModel>;
  });
}

export function getOrgsWithDefaultIncidentType(workspaceId:number, typeid: number) {
  return fetch(REACT_APP_API_URL + "/orgs/" + workspaceId + "/incidenttype/" + typeid.toString() + "/default", {
    credentials: "include",
  }).then((data) => {
    if (!data.ok) {
      throw new Error(data.statusText);
    }
    return data.json() as Promise<OrgsDefaultIncidentTypes>;
  });
}

//https://dev3.hadrsys.info/api/v1/orgs/{workspaceId}/incidenttype/{incidentTypeId}/active/{active}
export function getOrgsByActiveIncidentType(workspaceId:number, typeid: number, isActive: boolean) {
  return fetch(REACT_APP_API_URL + "/orgs/" + workspaceId + "/incidenttype/" + typeid.toString() + "/active/" + isActive, {
    credentials: "include",
  }).then((data) => {
    if (!data.ok) {
      throw new Error(data.statusText);
    }
    return data.json() as Promise<OrgsDefaultIncidentTypes>;
  });
}

export function getSymbology() {
  return fetch(REACT_APP_API_URL + "/symbology", {
    credentials: "include",
  }).then((data) => {
    if (!data.ok) {
      console.error(data.statusText);
    }
    return data.json() as Promise<SymbologyModel>;
  });
}

export function getSymbologyBySymbologyid(symbologyid: number) {
  return fetch(REACT_APP_API_URL + "/symbology/" + symbologyid, {
    credentials: "include",
  }).then((data) => {
    if (!data.ok) {
      console.error(data.statusText);
    }
    return data.json() as Promise<SymbolModel>;
  });
}

export function getOrgSymbology(orgid: number) {
  return fetch(REACT_APP_API_URL + "/symbology/org/" + orgid, {
    credentials: "include",
  }).then((data) => {
    if (!data.ok && data.status != 404) {
      console.error(data.statusText);
    }

      return data.json() as Promise<SymbologyModel>;

    }
  )
};


export function addActiveSymbology(orgid: number, symbologyid: number) {
  const requestOptions: RequestInit = {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  };

  return fetch(REACT_APP_API_URL + "/symbology/" + symbologyid + "/org/" + orgid,
    requestOptions,
  ).then((data) => {
    if (!data.ok) {
      console.error(data.statusText);
    }
    return data.json() as Promise<SymbologyModel>;
  });
}

export function addInactiveSymbology(orgid: number, symbologyid: number) {
  const requestOptions: RequestInit = {
    method: "DELETE",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  };
  return fetch(REACT_APP_API_URL + "/symbology/" + symbologyid + "/org/" + orgid,
    requestOptions,
  ).then((data) => {
    if (!data.ok) {
      console.error(data.statusText);
    }
    return data.json() as Promise<SymbologyModel>;
  });
}

export function postSymbologySet(addSymbolSetPayload: FormData) {
  const requestOptions: RequestInit = {
    method: "POST",
    credentials: "include",
    body: addSymbolSetPayload
  };
  return fetch(REACT_APP_API_URL + "/symbology",
    requestOptions,
  ).then((data) => {
    if (!data.ok) {
      console.error(data.statusText);
    }
    return data.json() as Promise<SymbolModel>;
  });
}

export function getRegions(countryId: number) {
  return fetch(REACT_APP_API_URL + '/country/region/' + countryId, {credentials: "include",}).then((data) => {
    if(!data.ok) {
      throw new Error(data.statusText);
    }
    return data.json() as Promise<RegionsModel>;
  })
  .catch((error) => {
    console.log(error);
    return null;
  })
}
export function getCountries() {
  return fetch(REACT_APP_API_URL +"/country/", {credentials: "include",}).then((data) => {
    if(!data.ok) {
      throw new Error(data.statusText);
    }
    return data.json() as Promise<CountriesModel>;
  })
  .catch((error) => {
    console.log(error);
    return null;
  })
}

export function addRegion(
  data: RegionEditPayload) {
    const requestOptions: RequestInit = {
      method: "POST",
      credentials: "include",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(data),
    };
    return fetch(REACT_APP_API_URL + "/country/",requestOptions)
    .then((data) => {
      if(!data.ok) {
        throw new Error(data.statusText);
      }
      return data.json() as Promise<RegionModel>;
    })
    .catch((error) => {
      console.log(error);
      return null;
    });
  }



export function addInactiveRegion(regionId: number) {
  const requestOptions: RequestInit = {
    method: "DELETE",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  };
  return fetch(REACT_APP_API_URL + "/country/region/" + regionId,
    requestOptions,
  ).then((data) => {
    if (!data.ok) {
      throw new Error(data.statusText);
    }
    return data.json() as Promise<RegionModel>;
  });
}
