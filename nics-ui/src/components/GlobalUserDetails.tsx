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
import {
  DataGrid,
  ColDef,
  RowSelectedParams,
  RowsProp,
} from "@material-ui/data-grid";
import { GlobalUserModel, SingleContactTypeModel, UserOrgModel, UserProfile } from "../models";

import {
  AppBar,
  Box,
  Button,
  Grid,
  Paper,
  Tab,
  Tabs,
  Typography,
} from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import { getAllContactTypes, getLoggedInUser, getUserContactsOrgDetails, getUserDetails, getUserOverview, setUserActiveStatus } from "../services/api";
import { isWhiteSpaceLike } from "typescript";
import { hasRole } from "../context/UserInfo";

// take the selectred org
// fetch the user detail
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    modal : {
        height: '75vh',
        width: '75%',
        margin: 'auto',
        marginTop: '100px',
        overflowY: 'scroll'
    },
    '.button' : {
      '& .MuiButton-outlinedPrimary' : {
        color: 'yellow'
      }
    },
    modalContent: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    org : {
      backgroundColor: '#181C25',
      color: 'white',
      paddingTop: '25px',
      paddingBottom: '25px',
      alignContent: 'center',
      '& .orgHeader' : {
          fontFamily: 'Abel',
          textTransform : 'uppercase',
          textAlign: 'center',
      }

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
    inactiveButton : {
      color: 'green !important',
      borderColor: 'green !important',
      marginTop: '5px'

    },
    activeButton : {
      color: 'red !important',
      borderColor: 'red !important',
      marginTop: '5px'


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
      width: 'inherit !imporant',
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
    },
    tableDiv : {
      height: 500,
      marginLeft: '2%',
      marginRight : '2%',
      width: "96%"
    },

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

type GlobalUserDetailsProps = {
  currentWorkspaceId: number,
  selectedUser : GlobalUserModel,
  setSelectedUser : (value : GlobalUserModel) => void;
  isModalOpen: boolean,
  orgsList: UserOrgModel[],
  setIsModalOpen: (value: boolean) => void;
};

export default function GlobalUserDetails(props: GlobalUserDetailsProps) {
  const classes = useStyles();
  const [grid, setGrid] = useState<RowsProp>([]);
  const [contactsGrid, setContactsGrid] = useState<RowsProp>([]);
  const [alLContactTypes, setAllContactTypes] = React.useState<SingleContactTypeModel[]>([]);
  const [currentTab, setCurrentTab] = React.useState(0);
  const [isActive, setIsActive] = React.useState<boolean>(true);
  const [loggedInUser, setLoggedInUser] = React.useState<UserProfile>();


  const columns: ColDef[] = [
    { field: "name", headerName: "Organization Name", flex: 2 },
    { field: "role", headerName: "Role", flex: 2 },
    { field: "enabled", headerName: "Enabled", flex: 2 },
  ];

  const contactsColumns: ColDef[] = [
    { field: "contactType", headerName: "Contact Type", flex: 2 },
    { field: "value", headerName: "Contact Information", flex: 2 }
  ];

  useEffect(() => {
    let mounted = true;
  
    if (props?.selectedUser?.userid) {
      getUserOverview(props.currentWorkspaceId, props?.selectedUser?.userid).then((items) => {
        if (mounted && items) {
         setIsActive(items.users[0].active);
        }
      });
    }
   
    return () => {
      mounted = false;
    };
  }, [props?.selectedUser, props.currentWorkspaceId]);


  useEffect(() => {
    let mounted = true;
  
    getAllContactTypes(props.currentWorkspaceId).then((items) => {
      if (mounted && items?.contactTypes != null) {
       setAllContactTypes(items.contactTypes);
      }
    });
    return () => {
      mounted = false;
    };
  }, [props.currentWorkspaceId]);

  useEffect(() => {
    if (props?.orgsList !== undefined) {
      let datagrid = props?.orgsList.map((org) => ({ ...org, id: org.name }));
      setGrid(datagrid);
    }
    
  }, [props?.selectedUser]);


  useEffect(() => {
    let mounted = true;

    getLoggedInUser(props.currentWorkspaceId).then((items) => {


      if (mounted && items.users != null) {
        setLoggedInUser(items.users[0]);

      }  
    });
    return () => {
      mounted = false;
    };
  }, [props.currentWorkspaceId]);


  //userorg_workspace_id
  useEffect(() => {
    let mounted = true;

    getUserContactsOrgDetails(props.currentWorkspaceId, props?.selectedUser.username).then((items) => {
     if (mounted && items?.users) {
       if (items.users[0].contacts) {
        let datagrid = items.users[0].contacts.map((contact: any) => ({ ...contact, id: contact.contactid, contactType : getContactTypeDisplayName(contact.contacttypeid) }));
        setContactsGrid(datagrid);
       }
     }
    });
    return () => {
      mounted = false;
    };
  }, [props?.selectedUser, alLContactTypes, props.currentWorkspaceId]);

  const getContactTypeDisplayName = (contactId : number) => {
    let displayName = "N/A";

    alLContactTypes.map((value) => {
      if (value.contactTypeId == contactId) {
        displayName = value.display;
      }
    });

    return displayName;

  }


  function handleClose()  {
    props?.setIsModalOpen(false);
    props?.setSelectedUser({} as GlobalUserModel);

  }


  //get user org id by getting the org and then the user id

  function handleActiveSwitch() {
    setIsActive(!isActive);

    let tempUser = {...props?.selectedUser, 'active': !isActive}
    if (loggedInUser && hasRole(loggedInUser, 'admin')) {
      setUserActiveStatus(props.currentWorkspaceId, tempUser, loggedInUser).then((items) => {
        console.log("activity changed");
        console.log(items);
      });
    }
    else {
      console.log("user is not admin or super");
    }
    
  }

  function handleTabChange(event: React.ChangeEvent<{}>, newValue: number) {
    setCurrentTab(newValue);
  }

  function datagridCallback(row: any) {
    
  }

  //TODO add tabs for contacts & organizations

return (

  
  <Modal
    open={props?.isModalOpen}
    onClose={handleClose}
    aria-labelledby="simple-modal-title"
    aria-describedby="simple-modal-description"
    className={classes.modal}
  >
    <Paper className={classes.modalContent}>
        <Grid container>
            
            <Grid item xs={12} className={classes.org}>
                <Grid container>
                  <Grid item xs={12} >
                      <Typography variant="h4" className="orgHeader">
                        {props?.selectedUser.firstname + " " + props?.selectedUser.lastname  || "No User Selected"}
                      </Typography>
                      <Typography variant="h6" className="orgHeader">
                        {props?.selectedUser.username || "No User Selected"}
                      </Typography>
                  </Grid>
                  <Grid item container justify="center">
                    {isActive && 
                    <Button className={classes.activeButton} onClick={handleActiveSwitch} variant="outlined" >Make Inactive</Button>
                    }
                    {!isActive && 
                    <Button className={classes.inactiveButton} onClick={handleActiveSwitch} variant="outlined">Make Active</Button>
                    }
                  </Grid>
                </Grid>
  
            </Grid>
            <Grid item xs={12}>
              <AppBar position="static" color="transparent" elevation={0}>
                <Tabs
                  centered
                  variant="fullWidth"
                  value={currentTab}
                  onChange={handleTabChange}
                  aria-label="User Detail Tabs"
                >
                  <Tab label="Organizations" {...a11yProps(0)} />
                  <Tab label="Contact Information" {...a11yProps(1)} />


                </Tabs>
              </AppBar>
          </Grid>

          <Grid item xs={12}>
            <TabPanel value={currentTab} index={0}>
            <Grid item xs={12}>
              <Grid container spacing={2} alignItems="center" justify="center" className={classes.root}>
                <Grid item xs={12}>
                <div className={classes.tableDiv}>
                  <DataGrid
                    pagination
                    autoPageSize
                    className= {classes.table}
                    rows={grid}
                    columns={columns}
                    onRowSelected={(row: RowSelectedParams) => datagridCallback(row)}
                />
                </div>
                </Grid>
              </Grid>
            </Grid>
            </TabPanel>
          </Grid>

          <Grid item xs={12}>
            <TabPanel value={currentTab} index={1}>
              <Grid container spacing={2} alignItems="center" justify="center" className={classes.root}>
                <Grid item xs={12}>
                <div className={classes.tableDiv}>
                  <DataGrid
                    pagination
                    autoPageSize
                    className= {classes.table}
                    rows={contactsGrid}
                    columns={contactsColumns}
                    onRowSelected={(row: RowSelectedParams) => datagridCallback(row)}
                />
                </div>
                </Grid>
              </Grid>
            </TabPanel>
          </Grid>
        </Grid>  
      </Paper>
    </Modal>
  );
}

