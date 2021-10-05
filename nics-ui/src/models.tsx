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
import { stringNumberComparer } from "@material-ui/data-grid";
import React from "react";


export type LanguageModel = {
  code: string,
  language: string,
  default: boolean,
  selectAnOrg: string
}


export type OrgsModel = {
  message: string;
  orgAdminList: string[];
  orgOrgTypes: string[];
  orgCaps: string[];
  caps: string[];
  count: number;
  organizations: OrganizationModel[];
};

export type OrganizationModel = {
  orgId: number;
  name: string;
  county: string;
  state: string;
  timezone: string;
  prefix: string;
  distribution: string;
  defaultlatitude: number;
  defaultlongitude: number;
  defaultlanguage: string;
  parentorgid: number;
  countryId: number;
  created: number | undefined;
  restrictincidents: boolean;
  createincidentrequiresadmin: boolean;
  userorgs: string[];
  orgTypes: OrgTypeModel[];
  id?: number;
};

//for an org type nested in an organization model (above)
export type OrgTypeModel = {
  orgOrgtypeid: number;
  orgid: number | undefined;
  orgtypeid: number;
  org: string | undefined;
  orgtype: string | undefined;
};

//from the orgs/1/types endpoints
export type AllOrgTypesModel = {
  message: string;
  orgTypes: SingleOrgTypeModel[];
  
}

export type SingleOrgTypeModel = {
  orgTypeName: string;
  orgTypeId: number;
  //orgOrgTypes: [];
}

export type AllCountriesModel = {
  message: string;
  countries: SingleCountryModel[];
}

export type SingleCountryModel = {
  countryId: number;
  countryCode: string;
  name: string;
}

export type UsersModel = {
  message: string;
  data: UserModel[];
};

export type UserModel = {
  username: string;
  active: boolean;
  userid: number;
  userorgid: number;
  userorg_workspace_id: number;
};

export type UserOrgModel = {
  enabled: boolean;
  name: string;
  role: string;
  orgId: number;
  defaultLanguage: string | null;
  org: OrganizationModel,
  userorgid: number

};

export type AdminUsersModel = {
  message: string;
  count: number;
  adminUsers: GlobalUserModel[];
};


export type UserProfile = {
  username: string;
  active: boolean;
  auth: boolean;
  firstname: string;
  lastname: string;
  userid: number;
  userorgid: number;
  userorg_workspace_id: number;
  roles: string[];
  contacts?: ContactModel[],
  userorgs : UserOrgModel[];
};


export type UserOverviewModel = {
  orgCount: number,
  users: UserModel[]
}

export type whoAmIModel = {
  users : UserProfile[],
  count: number,
  orgcount: number,
  defaultLanguage : string | null;
}

export type UserContactsModel = {
  message: string;
  contacts: ContactModel[];
}

export type GlobalUserModel = {
  createdUTC: Date,
  lastUpdatedUTC: Date,
  username: string;
  active: boolean;
  userid: number;
  firstname: string;
  lastname: string;
  //cellphone: string;
  userorgs: UserOrgModel[];
};
export type SearchedUserModel = {
  active: boolean;
  firstname: string;
  lastname: string;
  userId: number;
  username: string;
}

export type searchUsersModel = {
   message: string;
   users: SearchedUserModel[];
   count: number;
   orgCount: number;
   userSession: null
}


export type UserWorkspacesModel = {
  workspaces: WorkspaceModel[],
  count: number
}

export type WorkspaceModel = {
  workspaceid: number,
  workspacename: string,
  enabled: boolean
}

export type ActiveIncidentsModel = {
  message: string;
  data: ActiveIncidentModel[];
};

export type ActiveIncidentModel = {
  incidentname: string;
  incidentid: number;
};

export type ArchivedIncidentsModel = {
  message: string;
  folder: ArchivedIncidentFolderModel[];
  incidents: ArchivedIncidentModel[];
};



export type ArchivedIncidentFolderModel = {
  folderid: string;
  foldername: string;
  parentfolderid: string;
  workspaceid: number;
  index: number;
};

export type ArchivedIncidentModel = {
  incidentname: string;
  incidentid: number;
};

export type IncidentTypesModel = {
  message: string;
  activeIncidentTypes: ActiveIncidentTypeModel[];
  inactiveIncidentTypes: InactiveIncidentTypeModel[];
  defaultIncidentTypes: IncidentTypeModel[];
};

export type IncidentTypeModel = {
  defaulttype: boolean;
  incidentTypeId: number;
  incidentTypeName: string;

}

export type AllIncidentModel = {
  message: string;
  incidentTypes: IncidentTypeModel[];
}

export type OrgsDefaultIncidentTypes = {
  message: string;
  orgIdNameMap: IncidentTypeOrgIdMap[];
  count: number;
}

export type IncidentTypeOrgIdMap = {
  orgid: number;
  name: string;
}


export type ActiveIncidentTypeModel = {
  orgIncidenttypeid: number;
  orgid: number;
  incidenttypeid: number;
  defaulttype: boolean;
  incidenttype: {
    defaulttype: boolean;
    incidentTypeId: number;
    incidentTypeName: String;
  };
};

export type InactiveIncidentTypeModel = {
  defaulttype: boolean;
  incidentTypeId: number;
  incidentTypeName: string;
};

export type UserDetailsModel = {
  userOrgId: number;
  orgId: number;
  username: string;
  orgName?: string;
  userFirstname: string;
  userLastname: string;
  jobTitle: string;
  rank: string;
  defaultLanguage: string;
  sysRoleId: number;
  description: string;
  message?: string;
  incidentTypes?: InactiveIncidentTypeModel[];
  childOrgs?: OrganizationModel[];
  createIncidentRequiresAdmin?: boolean;
  jobDesc?: string;
  isAdminUser?: boolean;
  isSuperUser?: boolean;
  orgDefaultLanguage?: string;
  workspaceId?: number;
  usersessionId?: number;
  restrictIncidents?: boolean;
  orgPrefix?: string;
};

export type UserDetailsBody = {
  userOrgId: number;
  orgId?: number;
  userName?: string;
  username?: string;
  userFirstname?: string;
  firstName?: string;
  userLastname?: string;
  lastName?: string;
  jobTitle: string;
  rank: string;
  defaultLanguage: string;
  sysRoleId: number;
  description?: string;
  jobDesc?: string;
};

export type IncidentTypePayload = {
  incidentTypeName: string;
};

export type addUserToOrgPayload = {
  orgId : number;
  userIds: number[];
  message: string;
};



export type addUserToOrgResponse = {
  users: UserModel[];
  failedUsers: UserModel[];
};

export type getInactiveOrgUserListResponse = {
  count: number;
  data: UserModel[];
  message: string;
};

export type IncidentTypeDefaultPayload = {
  defaulttype: boolean;
  orgIncidenttypeid: number;
};

export type IncidentTypeEditPayload = {
  incidentTypeName: string;
  incidentTypeId: number;
};

export type IncidentTypeNumber = {
  incidentTypeName: string;
  incidentTypeId: number;
  orgIncidenttypeid?: number;
  defaulttype?: boolean;
};

export type Row = {
  id?: string;
};

export type UserNumber = {
  userorg_workspace_id: number;
  userid: number;
  username: string;
};

export type SymbologyModel = {
  count: number,
  message: string;
  symbologies: SymbolModel[],
  orgSymbologies: SymbolModel[]
};

export type SymbolModel = {
  created: number,
  description: string,
  listing: string,
  name: string,
  owner: string,
  symbologyid: number
}

export type SymbolListModel = {
  parentPath: string,
  listing: SymbolListingModel[]
}

export type SymbolListingModel = {
  desc: string,
  filename: string
}

export type FolderModel = {
  lastModifiedDate: Date,
  name: string,
  type: string,
  size: number
}

export type addSymbologySetPayload = {
  name : string;
  description: string;
  owner: string;
  file: FolderModel
};

export type ContactModel = {
  contactType: ContactTypeModel;
  contactid: number;
  contacttypeid: number;
  created: Date;
  enableLogin: boolean;
  enabled: boolean;
  userId: number
  value: string;
}

export type ContactTypeModel = {
  contactTypeId: number;
  type: string;
}

//"message":"Successfully retrieved ContactTypes","users":[],"contactTypes":[{"contactTypeId":0,"type":"email","display":"Email","contacts":[]},

export type AllContactTypesModel = {
  message: string;
  users: UserProfile[];
  contactTypes: SingleContactTypeModel[];
}

export type SingleContactTypeModel = {
  contactTypeId: number;
  type: string;
  display: string;
  //contacts: []
}

// translations
export type LanguageTranslationEntry = {
  id?: string | number,
  key: string,
  value: string
}

export type LoggedInUserModel = {
  active: boolean;
  username: string;
  firstname: string;
  lastname: string;
  userId: number;
};

export type LoggedInWhoAmIModel = {
  users : LoggedInUserModel[],
  count: number,
  orgcount: number
}

export type LanguageTranslationModel = {
  code: string,
  language: string,
  selectOrgText: string,
  translations?: string // json
};

export type LanguageTranslationUpdateRequest = {
  code: string,
  key: string,
  value: string
};

export type LanguageTranslationResponse = {
  message: string,
  translations: LanguageTranslationModel[]
}

export type RegionEditPayload = {
    countryId: number;
    regionName: string;
    regionCode: string;
  };
  export type CountriesModel = {
    message: string;
    countries: CountryModel[];
  };

  export type CountryModel = {
    name: string;
    countryId: number;
    countryCode: string;
  };

  export type RegionModel = {
    regionId: number;
    regionName: string;
    regionCode: string;
    countryId: number;
  }
  export type RegionsModel = {
    message: string;
    countries: CountryModel[];
    regions: RegionModel[];
  }
  export type DropdownItem = {
  id : number;
  text : string
}
