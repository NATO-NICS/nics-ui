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
import { IncidentTypeDefaultPayload, IncidentTypeModel, IncidentTypeOrgIdMap, IncidentTypesModel, OrganizationModel, SymbolModel } from "../models";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import {
  AppBar,
  Box,
  Button,
  Grid,
  List,
  ListItem,
  ListItemText,
  Paper,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@material-ui/core";
import {
  addActive,
  addInactive,
  changeDefault,
  getOrgincidenttypeid,
  getOrgsByActiveIncidentType,
  getOrgsWithDefaultIncidentType,
  getSuperOrgs,
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
import { ValueGetterParams } from "@material-ui/data-grid";

// Tasks 2/25: tree structure and modal!!!



const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    modal: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    paper: {
      position: "absolute",
      width: 400,
      backgroundColor: theme.palette.background.paper,
      border: "2px solid #000",
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
      ontFamily: 'Open Sans',
      textTransform: 'lowercase',
    },
    root: {
      fontFamily: 'Open Sans',
      textTransform: 'lowercase',
      alignItems: 'center',
      justifyContent: 'center',
      "& > *": {
        margin: theme.spacing(1),
        
        width: "25ch"
        
      }
    },
    button: {
      margin: theme.spacing(1),
    },
    selected: {
      backgroundColor: "blue",
      fontFamily: 'Open Sans',
      textTransform: 'lowercase'
    },
    header : {
      fontFamily: "Abel",
      textTransform: 'uppercase'
    },
    body : {
      fontFamily: 'Open Sans',
      textTransform: 'lowercase',
    },
    addNewUserRow : {
      textTransform: 'lowercase',
      fontFamily: 'Open Sans',
      fontStyle: 'italic',
      width: '200%',
      '& .MuiInput-underline::before' : {
        borderBottom: 'none!important'
      },
      '& input' : {
        cursor: 'pointer !important'
      }
    },
    table: {
      fontFamily: 'Open Sans',
      textTransform: 'lowercase',
      '& .MuiDataGrid-colCellWrapper' : {
        backgroundColor: '#181C25',
      },
      '& .MuiDataGrid-colCell' : {
        fontFamily: 'Abel',
        textTransform: 'uppercase',
        color: 'white'
      }
    },
    '.MuiListItem-root' : {
      width : 'inherit!important',
      padding : '0 !important',
      color: 'red !important',
      '& form' : {
        width : '100% !important',
      }

    },
    setIconLabel : {
      fontSize: '2px'
    },
    '.MuiTextField-root' : {
      marginRight: '50px'
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

function convertModelType(targetOrg: OrganizationModel) {
  let model: IncidentTypeOrgIdMap = {
      orgid: targetOrg.orgId,
      name: targetOrg.name
  };
  return model;
}

function not(a: IncidentTypeOrgIdMap[], b: IncidentTypeOrgIdMap[]) {
  var result = a.filter(function(list1: IncidentTypeOrgIdMap){
      // filter out (!) items in result2
      return !b.some(function(list2: IncidentTypeOrgIdMap){
          return list1.orgid === list2.orgid;          
      });
});
return a.filter(list1 => !b.some(list2 => list1.orgid === list2.orgid));
}

type IncidentTypeDetailsProps = {
  currentWorkspaceId: number, 
  selectedIncidentType: IncidentTypeModel;
};

export default function IncidentTypeDetails(props: IncidentTypeDetailsProps) {
  const classes = useStyles();
  const [currentTab, setCurrentTab] = React.useState(0);

  const [selected, setSelected] = React.useState<IncidentTypeOrgIdMap[]>([]);
  const [allOrgs, setAllOrgs] = React.useState<IncidentTypeOrgIdMap[]>([]);

  const [orgsWithTypeAsDefault, setOrgsWithTypeAsDefault] = React.useState<IncidentTypeOrgIdMap[]>([]);
  const [orgsWithoutTypeAsDefault, setOrgsWithoutTypeAsDefault] = React.useState<IncidentTypeOrgIdMap[]>([]);

  const [orgsWithTypeAsActive, setOrgsWithTypeAsActive] = React.useState<IncidentTypeOrgIdMap[]>([]);
  const [orgsWithTypeAsInactive, setOrgsWithTypeAsInactive] = React.useState<IncidentTypeOrgIdMap[]>([]);

  

  //get all orgs
  useEffect(() => {
    let mounted = true;
    getSuperOrgs(props.currentWorkspaceId)
        .then(items => {
          if(mounted && orgsWithTypeAsDefault) {
            let convertedList = items.organizations.map((org) => {
                return convertModelType(org);
            });
          setAllOrgs(convertedList);
          setOrgsWithTypeAsInactive(not(allOrgs, orgsWithTypeAsActive));

      }})
      return () => {
        mounted = false;
      };
    },[props.selectedIncidentType, orgsWithTypeAsActive, props.currentWorkspaceId]);

  //get info for specific incident type
  //sort into orgs that have type set as default and orgs that don't
  useEffect(() => {
    let mounted = true;
    getOrgsWithDefaultIncidentType(props.currentWorkspaceId, props.selectedIncidentType.incidentTypeId).then((items) => {
      if (mounted) {
        setOrgsWithTypeAsDefault(items.orgIdNameMap);
      }
    });
    return () => {
      mounted = false;
    };
  }, [props.selectedIncidentType, props.currentWorkspaceId]);

  //only show orgs that have this incident type as active
  useEffect(() => {
    let mounted = true;
    getOrgsByActiveIncidentType(props.currentWorkspaceId, props.selectedIncidentType.incidentTypeId, true).then((items) => {
      if (mounted) {
        setOrgsWithoutTypeAsDefault(not(items.orgIdNameMap, orgsWithTypeAsDefault));
        setOrgsWithTypeAsActive(items.orgIdNameMap);
      }
    });
    return () => {
      mounted = false;
    };
  }, [orgsWithTypeAsDefault, props.currentWorkspaceId]);

  
  function changeDefaultStatusIfActive(items: IncidentTypesModel, changeToDefault: boolean) {
    items.activeIncidentTypes.map((incident) => {
      if (incident.incidenttypeid == props?.selectedIncidentType.incidentTypeId) {
        
        let incidenttype: IncidentTypeDefaultPayload = {
          defaulttype: changeToDefault,
          orgIncidenttypeid:  incident.orgIncidenttypeid || 0,
        };
      
        if (incidenttype != null && incident.orgIncidenttypeid != null) {
          changeDefault(props.currentWorkspaceId, incidenttype, incidenttype.orgIncidenttypeid);
        }

      }
    });
  }

  const handleToggle = (value: IncidentTypeOrgIdMap) => () => {
    const currentIndex = selected.indexOf(value);
    
    const newSelected : any = [];

    if (currentIndex === -1) {
      newSelected.push(value);
    } else {
      newSelected.splice(currentIndex, 1);
    }

    setSelected(newSelected);
  };


const handleSelectedNondefault = () => {
  setOrgsWithTypeAsDefault(orgsWithTypeAsDefault.concat(selected));

  getOrgincidenttypeid(props.currentWorkspaceId, selected[0].orgid).then((items) => {
      changeDefaultStatusIfActive(items, true);
  })
  setOrgsWithoutTypeAsDefault(not(orgsWithoutTypeAsDefault, selected));

};

const handleSelectedDefault = () => {
  setOrgsWithoutTypeAsDefault(orgsWithoutTypeAsDefault.concat(selected));

  getOrgincidenttypeid(props.currentWorkspaceId, selected[0].orgid).then((items) => {
    changeDefaultStatusIfActive(items, false);
  })
  setOrgsWithTypeAsDefault(not(orgsWithTypeAsDefault, selected));

};

const handleSelectedInactive = () => {
  setOrgsWithTypeAsActive(orgsWithTypeAsActive.concat(selected));

  getOrgincidenttypeid(props.currentWorkspaceId, selected[0].orgid).then((items) => {
    addActive(props.currentWorkspaceId, [props?.selectedIncidentType.incidentTypeId], selected[0].orgid);
  })
  setOrgsWithTypeAsInactive(not(orgsWithTypeAsInactive, selected));

};

const handleSelectedActive = () => {
  setOrgsWithTypeAsInactive(orgsWithTypeAsInactive.concat(selected));

  getOrgincidenttypeid(props.currentWorkspaceId, selected[0].orgid).then((items) => {
    addInactive(props.currentWorkspaceId, [props?.selectedIncidentType.incidentTypeId], selected[0].orgid);
  })
  setOrgsWithTypeAsActive(not(orgsWithTypeAsActive, selected));

};

function handleTabChange(event: React.ChangeEvent<{}>, newValue: number) {
  setCurrentTab(newValue);
}

  function customList(items: IncidentTypeOrgIdMap[], status: boolean) {
    if (status) {
      return (
        <Paper>
          <List dense component="div" role="list">
            {items.map((value: IncidentTypeOrgIdMap) => {
              const labelId = `transfer-list-item-${value.orgid}-label`;

              return (
                <ListItem
                  key={value.orgid}
                  role="listitem"
                  button
                  onClick={handleToggle(value)}
                  selected={selected.indexOf(value) !== -1}
                  classes={{ selected: classes.selected }}
                >
                  <ListItemText
                    id={labelId}
                    primary={`${value.name}`}
                  />
                </ListItem>
              );
            })}
            <ListItem />
          </List>
        </Paper>
      );
    } else {
      return (
        <Paper>
          <List dense component="div" role="list">
            {items.map((value: IncidentTypeOrgIdMap) => {
              const labelId = `transfer-list-item-${value.orgid}-label`;

              return (
                <ListItem
                  key={value.orgid}
                  role="listitem"
                  button
                  onClick={handleToggle(value)}
                  selected={selected.indexOf(value) !== -1}
                  classes={{ selected: classes.selected }}
                >
                  <ListItemText
                    id={labelId}
                    primary={`${value.name}`}
                  />
                </ListItem>
              );
            })}
            <ListItem />
          </List>
        </Paper>
      );
    }
  }

  return (


    <Grid container spacing={1}>
      <Grid item xs={12}>
        <AppBar position="static" color="transparent" elevation={0}>
          <Tabs
            centered
            variant="fullWidth"
            value={currentTab}
            onChange={handleTabChange}
            aria-label="Organization Tabs"
          >
            <Tab label="Default Status" {...a11yProps(0)} />
            <Tab label="Active Status" {...a11yProps(1)} />
          </Tabs>
        </AppBar>
      </Grid>
      <Grid item xs={12}>
        <TabPanel value={currentTab} index={0}>
          <Grid container>
            <Grid item xs={5}>
              <Typography gutterBottom variant="h5" className={classes.header}>
                Default
              </Typography>
              <div style={{ height: 550, width: "100%" }}>
                  {orgsWithTypeAsDefault && customList(orgsWithTypeAsDefault, true)}
              </div>
            </Grid>
            <Grid item xs={2}>
              <Grid container spacing={1} direction="column" alignItems="center">
                  <Button
                  variant="outlined"
                  size="small"
                  className={classes.button}
                  onClick={handleSelectedDefault}
                  disabled={selected == null}
                  aria-label="move selected default"
                  >
                  &gt;
                  </Button>
                  <Button
                  variant="outlined"
                  size="small"
                  className={classes.button}
                  onClick={handleSelectedNondefault}
                  disabled={selected == null}
                  aria-label="move selected nondefault"
                  >
                  &lt;
                  </Button>
              </Grid>
            </Grid>
            <Grid item xs={5}>
              <Typography gutterBottom variant="h5" className={classes.header}>
                Non-Default
              </Typography>
              <div style={{ height: 550, width: "100%" }}>
                  {orgsWithoutTypeAsDefault && customList(orgsWithoutTypeAsDefault, false)}
              </div>
            </Grid>
          </Grid>
        </TabPanel>


        <TabPanel value={currentTab} index={1}>
          <Grid container>
            <Grid item xs={5}>
              <Typography gutterBottom variant="h5" className={classes.header}>
                Active
              </Typography>
              <div style={{ height: 550, width: "100%" }}>
                  {orgsWithTypeAsActive && customList(orgsWithTypeAsActive, true)}
              </div>
            </Grid>
            <Grid item xs={2}>
              <Grid container spacing={1} direction="column" alignItems="center">
                  <Button
                  variant="outlined"
                  size="small"
                  className={classes.button}
                  onClick={handleSelectedActive}
                  disabled={selected == null}
                  aria-label="move selected active"
                  >
                  &gt;
                  </Button>
                  <Button
                  variant="outlined"
                  size="small"
                  className={classes.button}
                  onClick={handleSelectedInactive}
                  disabled={selected == null}
                  aria-label="move selected inactive"
                  >
                  &lt;
                  </Button>
              </Grid>
            </Grid>
            <Grid item xs={5}>
              <Typography gutterBottom variant="h5" className={classes.header}>
                Inactive
              </Typography>
              <div style={{ height: 550, width: "100%" }}>
                  {orgsWithTypeAsInactive && customList(orgsWithTypeAsInactive, false)}
              </div>
            </Grid>
          </Grid>
        </TabPanel>
      </Grid>
    </Grid>
  );
}
