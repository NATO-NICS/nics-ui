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
import React, { useEffect, useState } from "react";
import { OrganizationModel, SymbolModel } from "../models";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import {
  AppBar,
  Box,
  Grid,
  Paper,
  Tab,
  Tabs,
  Typography,
} from "@material-ui/core";
import {
  getSpecEnableUser,
  getSpecDisableUser,
  updateOrg,
  getActiveIncidents,
  getIncidentTypes,
  getSymbology,
  getOrgSymbology,
} from "../services/api";
import {
  UserModel,
  ActiveIncidentModel,
  ActiveIncidentTypeModel,
  InactiveIncidentTypeModel,
  ArchivedIncidentModel,
} from "../models";
// import TreeView from '@material-ui/lab/TreeView';
// import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
// import ChevronRightIcon from '@material-ui/icons/ChevronRight';
// import TreeItem from '@material-ui/lab/TreeItem';
import Modal from "@material-ui/core/Modal";
import UserDetails from "./UserDetails";
import IncidentTypeOrgDetails from "./IncidentTypeOrgDetails";
import OrgForm from "./OrgForm";
import IncidentDetails from "./IncidentDetails";
import OrgSymbologyDetails from "./OrgSymbologyDetails";

// Tasks 2/25: tree structure and modal!!!



const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      margin: theme.spacing(1),
    },
    root: {
      "& > *": {
        margin: theme.spacing(1),
        alignItems: 'center',
        justifyContent: 'center',
        width: "25ch",
      },
    }
  })
);

function a11yProps(index: any) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
  className?: string;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

type OrgProps = {
  currentWorkspaceId: number,
  selectedOrg: OrganizationModel;
  setSelectedOrg?: (value: OrganizationModel) => void;
};

export default function OrgDetails(props: OrgProps) {
  const [org, setOrg] = useState<OrganizationModel>({...props.selectedOrg});

  const [currentTab, setCurrentTab] = React.useState(0);
  const classes = useStyles();

  const [enableList, setEnableList] = useState<UserModel[]>([]);
  const [disableList, setDisableList] = useState<UserModel[]>([]);

  const [activeIncidents, setActiveIncidents] = useState<ActiveIncidentModel[]>(
    []
  );
  const [archivedIncidents, setArchivedIncidents] = useState<
    ArchivedIncidentModel[]
  >([]);

  const [activeIncidentTypes, setActiveIncidentTypes] = useState<
    ActiveIncidentTypeModel[]
  >([]);
  const [inactiveIncidentTypes, setInactiveIncidentTypes] = useState<
    InactiveIncidentTypeModel[]
  >([]);


  const [allSymbologies, setAllSymbologies] = React.useState<SymbolModel[]>([]);
  const [activeSymbology, setActiveSymbology] = React.useState<SymbolModel[]>([]);
  const [inactiveSymbology, setInactiveSymbology] = React.useState<SymbolModel[]>([]);

  function notSymbology(a: SymbolModel[], b: SymbolModel[]) {
  
    var result = a.filter(function(symbologySet1: SymbolModel){
      return !b.some(function(symbologySet2: SymbolModel){
          return symbologySet1.symbologyid === symbologySet2.symbologyid;          
      });
    });
    return a.filter(symbologySet1 => !b.some(symbologySet2 => symbologySet1.symbologyid === symbologySet2.symbologyid));
  }

  function handleTabChange(event: React.ChangeEvent<{}>, newValue: number) {
    setCurrentTab(newValue);
  }

  useEffect(() => {
    let mounted = true;
    if (org?.orgId != null) {
      getSpecEnableUser(props.currentWorkspaceId, org?.orgId || 1).then((items) => {
        if (mounted && items != null) {
          setEnableList(items.data);
        }
      });
      return () => {
        mounted = false;
      };
    }
  }, [org?.orgId, props.currentWorkspaceId]);

  useEffect(() => {
    let mounted = true;
    if (org?.orgId != null) {
      getSpecDisableUser(props.currentWorkspaceId, org?.orgId).then((items) => {
        if (mounted && items != null) {
          setDisableList(items.data);
        }
      });
      return () => {
        mounted = false;
      };
    }
  }, [org?.orgId, props.currentWorkspaceId]);

  useEffect(() => {
    let mounted = true;
    if (org?.orgId != null) {
      getActiveIncidents(props.currentWorkspaceId, org?.orgId).then((items) => {
        if (mounted && items != null) {
          setActiveIncidents(items.data);
        }
      });
      return () => {
        mounted = false;
      };
    }
  }, [org?.orgId, props.currentWorkspaceId]);



  // Figure our archived incidents here

  useEffect(() => {
    let mounted = true;
    if (org?.orgId != null) {
      getIncidentTypes(props.currentWorkspaceId, org?.orgId).then((items) => {
        if (mounted && items != null) {
          setActiveIncidentTypes(items.activeIncidentTypes);
          setInactiveIncidentTypes(items.inactiveIncidentTypes);
        }
      });
      return () => {
        mounted = false;
      };
    }
  }, [org?.orgId, props.currentWorkspaceId]);


  useEffect(() => {
    let mounted = true;
    getSymbology().then((items) => {
      if (mounted) {
        setAllSymbologies(items.symbologies);
      }
    });

    return () => {
      mounted = false;
    };
  }, [org?.orgId]);

  useEffect(() => {
    let mounted = true;
    if (org?.orgId != null) {
      getOrgSymbology(org.orgId).then((items) => {
        if (mounted && allSymbologies && items.symbologies != null) {
          setActiveSymbology(items.symbologies);
          setInactiveSymbology(notSymbology(allSymbologies, items.symbologies));

        }
        else if (mounted && allSymbologies && items.symbologies == null) {
          setActiveSymbology([]);
          setInactiveSymbology(allSymbologies);

        }
      });
      return () => {
        mounted = false;
      };
    } 
  
    
  }, [org?.orgId, allSymbologies]);



  return (
    <Grid container spacing={2} alignItems="center" justify="center">
      <Grid item xs={12}>
        <AppBar position="static" color="transparent" elevation={0}>
          <Tabs
            centered
            variant="fullWidth"
            value={currentTab}
            onChange={handleTabChange}
            aria-label="Organization Tabs"
          >
            <Tab label="Details" {...a11yProps(0)} />
            <Tab label="Users" {...a11yProps(1)} />
            <Tab label="Incidents" {...a11yProps(2)} />
            <Tab label="Incident Types" {...a11yProps(3)} />
            <Tab label="Symbology" {...a11yProps(3)} />

          </Tabs>
        </AppBar>
      </Grid>
      <Grid item xs={12}>
        <TabPanel value={currentTab} index={0}>
          <OrgForm
            currentWorkspaceId={props.currentWorkspaceId}
            org={org}
            setOrg={setOrg}
            selectedOrg={props?.selectedOrg}
            setSelectedOrg={props?.setSelectedOrg}
          ></OrgForm>
        </TabPanel>
        <TabPanel value={currentTab} index={1}>
          <UserDetails
            currentWorkspaceId={props.currentWorkspaceId}
            enableList={enableList}
            setEnableList={setEnableList}
            disableList={disableList}
            setDisableList={setDisableList}
            orgId={org?.orgId}
          ></UserDetails>
        </TabPanel>
        <TabPanel value={currentTab} index={2}>
          <IncidentDetails
            activeIncidents={activeIncidents}
            setActiveIncidents={setActiveIncidents}
            archivedIncidents={archivedIncidents}
            setArchivedIncidents={setArchivedIncidents}
          ></IncidentDetails>
        </TabPanel>
        <TabPanel value={currentTab} index={3}>
          <IncidentTypeOrgDetails
            currentWorkspaceId={props.currentWorkspaceId}
            activeIncidentTypes={activeIncidentTypes}
            setActiveIncidentTypes={setActiveIncidentTypes}
            inactiveIncidentTypes={inactiveIncidentTypes}
            setInactiveIncidentTypes={setInactiveIncidentTypes}
            orgId={org?.orgId}
          ></IncidentTypeOrgDetails>
        </TabPanel>
        <TabPanel value={currentTab} index={4}>
          {props.selectedOrg?.orgId && <OrgSymbologyDetails
            orgId={props.selectedOrg.orgId} allSymbologies={allSymbologies} setAllSymbologies={setAllSymbologies} activeSymbology={activeSymbology} inactiveSymbology={inactiveSymbology} setActiveSymbology={setActiveSymbology} setInactiveSymbology={setInactiveSymbology}
          ></OrgSymbologyDetails>}
        </TabPanel>
      </Grid>
    </Grid>
  );
}
