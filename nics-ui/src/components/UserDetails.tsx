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
  RowsProp,
  ValueFormatterParams,
  RowSelectedParams,
} from "@material-ui/data-grid";
import { Button } from "@material-ui/core";
import { getUserDetails, updateUser, changeUserStatus, getUserByFirstAndLastName, postUserToOrg, getSpecEnableUser, getOrgInactiveUsers } from "../services/api";
import { UserModel, UserDetailsModel, addUserToOrgPayload } from "../models";
import TextField from "@material-ui/core/TextField";
import {
  AppBar,
  Box,
  Grid,
  Paper,
  Tab,
  Tabs,
  Typography,
} from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Checkbox from "@material-ui/core/Checkbox";
import { convertCompilerOptionsFromJson } from "typescript";

// take the selectred org
// fetch the user detail
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
      
      "& > *": {
        margin: theme.spacing(1),
        width: "25ch"
        
      },
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

    }
  })
);


type UserProps = {
  currentWorkspaceId: number,
  enableList?: UserModel[];
  setEnableList?: (value: UserModel[]) => void;

  disableList?: UserModel[];
  setDisableList?: (value: UserModel[]) => void;

  orgId?: number;
};

export default function UserDetails(props: UserProps) {
  const [enableGrid, setEnableGrid] = useState<RowsProp>([]);
  const [disableGrid, setDisableGrid] = useState<RowsProp>([]);
  const [open, setOpen] = React.useState(false);
  const [modal, setModal] = React.useState<UserDetailsModel>();


  const [selected, setSelected] = React.useState<UserModel[]>([]);
  const [active, setActive] = React.useState<UserModel[]>([]);
  const [inactive, setInactive] = React.useState<UserModel[]>([]);
  const [addUserName, setAddUserName] = React.useState<String>();
  const [addUserToOrgPayload, setAddUserToOrgPayload] = React.useState<addUserToOrgPayload>({userIds: [], orgId: 0, message: ""});
  const [roleName, setRoleName] = React.useState<string>("user");

  const defaultAddUserLabel = "Add new...";
  const defaultAddUserPlaceholder = "Enter a first and last name.";
  const defaultAddUserHelperText = "";
  const defaultErrorText = "Please enter both a first and last name.";
  const [addUserLabel, setAddUserLabel] = React.useState<String>(defaultAddUserLabel);
  const [addUserPlaceholder, setAddUserPlaceholder] = React.useState<string>(defaultAddUserPlaceholder);
  const [addUserHelperText, setAddUserHelperText] = React.useState<string>("");
  const [manualShrink, setManualShrink] = React.useState<boolean>(false);
  const [manualError, setManualError] = React.useState<boolean>(false);


  const activeSelected = intersection(selected, active);
  const inactiveSelected = intersection(selected, inactive);

  const classes = useStyles();

  function postActive(data: UserModel[]) {
    for (var item of data) {
      changeUserStatus(props.currentWorkspaceId, item.userorg_workspace_id, item.userid, true);
    }
  }

  function postInactive(data: UserModel[]) {
    for (var item of data) {
      changeUserStatus(props.currentWorkspaceId, item.userorg_workspace_id, item.userid, false);
    }
  }

  const handleToggle = (value: UserModel) => () => {
    const currentIndex = selected.indexOf(value);
    const newSelected = [...selected];

    if (currentIndex === -1) {
      newSelected.push(value);
    } else {
      newSelected.splice(currentIndex, 1);
    }

    setSelected(newSelected);
  };

  const handleAllInactive = () => {
    setInactive(inactive.concat(active));
    postInactive(active);
    setActive([]);
  };

  const handleSelectedInactive = () => {
    setInactive(inactive.concat(activeSelected));
    postInactive(activeSelected);
    setActive(not(active, activeSelected));
    setSelected(not(selected, activeSelected));
  };

  const handleSelectedActive = () => {
    setActive(active.concat(inactiveSelected));
    postActive(inactiveSelected);
    setInactive(not(inactive, inactiveSelected));
    setSelected(not(selected, inactiveSelected));
  };

  const handleAllActive = () => {
    setActive(active.concat(inactive));
    postActive(inactive);
    setInactive([]);
  };

  const updateEnabledUsers = () => {
    let mounted = true;
    if (props.orgId != null) {
      getSpecEnableUser(props.currentWorkspaceId, props.orgId || 1).then((items) => {
        if (mounted && items != null && props.setEnableList) {
          props.setEnableList(items.data);
        }
      });
      return () => {
        mounted = false;
      };
    }
  }

  const updateDisabledUsers = () => {
    let mounted = true;
    if (props.orgId != null) {
      getSpecEnableUser(props.currentWorkspaceId, props.orgId || 1).then((items) => {
        if (mounted && items != null && props.setDisableList) {
          props.setDisableList(items.data);
        }
      });
      return () => {
        mounted = false;
      };
    }
    
  }

  const customList = (items: UserModel[]) => (
    <Paper>
      <List dense component="div" role="list">
        {items.map((value: UserModel) => {
          const labelId = `transfer-list-item-${value.userid}-label`;

          return (
            <ListItem
              key={value.userid}
              role="listitem"
              button
              onClick={handleToggle(value)}
              onDoubleClick={() => callback(value)}
              selected={selected.indexOf(value) !== -1}
              classes={{ selected: classes.selected}}
            >
              <ListItemText id={labelId} primary={`${value.username}`} className={classes.body} />
            </ListItem>
          );
        })}
      </List>
      
    </Paper>
  );


  const searchForUser = () => {

    //split string by space to get first and last
    let first = addUserName?.split(" ")[0];
    let last = addUserName?.split(" ")[1];

    if (!first || !last) {
      setAddUserHelperText(defaultErrorText);
      setManualError(true);
      setManualShrink(true);


      const resetLabels = setTimeout(() => {
        setManualError(false);
        setManualShrink(true);
        setAddUserHelperText(defaultAddUserHelperText);
        setAddUserPlaceholder(defaultAddUserPlaceholder);
        setAddUserLabel(defaultAddUserLabel);
        setAddUserName("");
      }, 2500);

      return;
    }

    setAddUserLabel("Searching for " + addUserName + "...");

    //call POST to add user to org with username & org ID
    if (first != null && last != null) {
      let mounted = true;
      if (first != null && last != null && props?.orgId != null) {
        getUserByFirstAndLastName(props.currentWorkspaceId, first, last)
        .then(
          (items) => {
            if (mounted && items?.users) {
              if (items.users.length > 0 && items.users[0] != undefined) {
  
                //TODO: display all results and let user pick correct one to add, should there be more than one returned
                //TODO show if user is already part of org, do not add again
                //TODO: add multiple users at a time?
                const userIds = [items.users[0].userId];


                let temp = { ...addUserToOrgPayload, userIds: userIds, orgId: props?.orgId };     
                setAddUserToOrgPayload(temp as addUserToOrgPayload);                
                addUserToOrg();
              } 
              else {
                setAddUserLabel("No user found with the name " + first + " " + last + ".");
              
                const resetLabels = setTimeout(() => {
                  setAddUserPlaceholder(defaultAddUserPlaceholder);
                  setAddUserLabel(defaultAddUserLabel);
                  setAddUserName("");
                }, 2500);
              }
            }
          }
        );
        return () => {
          mounted = false
        };
      }
    }
    
  }

  function addUserToOrg() {

      let buffer: addUserToOrgPayload = Object.assign({}, addUserToOrgPayload);
      
      if (buffer.userIds != null && buffer.orgId != null) {
        let mounted = true;
        postUserToOrg(props.currentWorkspaceId, buffer)
        .then(
          (items) => {
            if (mounted && items) {
              updateDisabledUserList();
              
            }
          }
        );
        return () => {
          mounted = false
        };
        
      }
}

function updateDisabledUserList() {
  let mounted = true;
      if (props?.orgId != null) {
        getOrgInactiveUsers(props.currentWorkspaceId, props.orgId)
        .then(
          (items) => {
            if (mounted && items) {
              if (items != null && props.setDisableList) {
                props.setDisableList(items.data);
                //add timeout function to change back to 'add new'
                setAddUserLabel("Added user " + items.data[items.data.length - 1].username + " to inactive users.");
              
                const resetLabels = setTimeout(() => {
                  setAddUserPlaceholder(defaultAddUserPlaceholder);
                  setAddUserLabel(defaultAddUserLabel);
                  setAddUserName("");
                }, 2500);

              }
            }
          }
        );
        return () => {
          mounted = false
        };
      }
}

  function not(a: UserModel[], b: UserModel[]) {
    return a.filter((value) => b.indexOf(value) === -1);
  }

  function intersection(a: UserModel[], b: UserModel[]) {
    return a.filter((value) => b.indexOf(value) !== -1);
  }
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setModal(undefined);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let temp = { ...modal, [event.target.id]: event.target.value };
    setModal(temp as UserDetailsModel);
  };
  const columns: ColDef[] = [
    { field: "username", headerName: "Username", flex: 2 },
  ];

  useEffect(() => {
    if (props?.enableList != null) {
      let datagrid = props?.enableList.reduce<UserModel[]>(
        (arr, curr) => [
          ...arr,
          {
            username: curr.username,
            active: curr.active,
            userorg_workspace_id: curr.userorg_workspace_id,
            userid: curr.userid,
            userorgid: curr.userorgid,
          },
        ],
        []
      );
      setActive(datagrid);
    }
  }, [props?.enableList]);


  useEffect(() => {
    //TODO update this to include the other 2 roles
    if (modal != undefined) {
      if (modal.isSuperUser) {
        setRoleName("super");
      }
      else if (modal.isAdminUser) {
        setRoleName("admin");
      }
      else {
        setRoleName("user");
      }
    }
  }, [modal]);

  useEffect(() => {
    if (props?.disableList != null) {
      let datagrid = props?.disableList.reduce<UserModel[]>(
        (arr, curr) => [
          ...arr,
          {
            username: curr.username,
            active: curr.active,
            userorg_workspace_id: curr.userorg_workspace_id,
            userid: curr.userid,
            userorgid: curr.userorgid,
          },
        ],
        []
      );
      setInactive(datagrid);
    }
  }, [props?.disableList]);

  function callback(row: any) {
    setOpen(true);

    let user: UserModel = row;

    let mounted = true;
    if (user != null && props?.orgId != null) {
      getUserDetails(props.currentWorkspaceId, user.username, user.userorgid, props?.orgId).then(
        (items) => {
          if (mounted && items != null) {
            setModal(items);
          }
        }
      );
      return () => {
        mounted = false;
      };
    }
  }

  

  var section = (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={classes.modal}
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={open}>
        <div className={classes.paper}>
          <form className={classes.root} noValidate autoComplete="off">
            <TextField
              id="username"
              label="Username"
              value={modal?.username}
              InputLabelProps={{ shrink: true }}
              onChange={handleChange}
              InputProps={{
                readOnly: true,
              }}
            />
            <TextField
              id="userFirstname"
              label="First Name"
              value={modal?.userFirstname}
              InputLabelProps={{ shrink: true }}
              onChange={handleChange}
            />
            <TextField
              id="userLastname"
              label="Last Name"
              value={modal?.userLastname}
              InputLabelProps={{ shrink: true }}
              onChange={handleChange}
            />
            <TextField
              id="orgName"
              label="Organization"
              value={modal?.orgName}
              InputLabelProps={{ shrink: true }}
              onChange={handleChange}
              InputProps={{
                readOnly: true,
              }}
            />
            <TextField
              id="jobTitle"
              label="Job Title"
              value={modal?.jobTitle}
              InputLabelProps={{ shrink: true }}
              onChange={handleChange}
            />
            <TextField
              id="rank"
              label="Rank"
              value={modal?.rank}
              InputLabelProps={{ shrink: true }}
              onChange={handleChange}
            />
            <TextField
              id="description"
              label="Job Description"
              value={modal?.description}
              InputLabelProps={{ shrink: true }}
              onChange={handleChange}
            />
            <TextField
              id="defaultLanguage"
              label="Default Language"
              value={modal?.defaultLanguage}
              InputLabelProps={{ shrink: true }}
              onChange={handleChange}
            />
            <TextField
              label="System Role"
              value={roleName}
              InputLabelProps={{ shrink: true }}
            />

            <Button
              variant="contained"
              color="primary"
              size="small"
              className={classes.button}
              onClick={() => postUser()}
            >
              Save
            </Button>
          </form>
        </div>
      </Fade>
    </Modal>
  );

  function postUser() {
    if (modal !== undefined) {
      let buffer: UserDetailsModel = Object.assign({}, modal);
      delete buffer.message;
      delete buffer.incidentTypes;
      delete buffer.childOrgs;
      delete buffer.createIncidentRequiresAdmin;
      delete buffer.isAdminUser;
      delete buffer.isSuperUser;
      delete buffer.orgDefaultLanguage;

      delete buffer.orgName;
      delete buffer.workspaceId;
      delete buffer.usersessionId;
      delete buffer.restrictIncidents;
      delete buffer.orgPrefix;

      updateUser(buffer);
      setOpen(false);
    }
  }

  return (
    <Grid container spacing={1}>
      <Grid item xs={5}>
        <Typography gutterBottom variant="h5" className={classes.header}>
          Active Users
        </Typography>
        <div style={{ height: 550, width: "100%" }}>{customList(active)}</div>
      </Grid>
      <Grid item xs={2}>
        <Grid container spacing={1} direction="column" alignItems="center">
          <Button
            variant="outlined"
            size="small"
            className={classes.button}
            onClick={handleAllInactive}
            disabled={active.length === 0}
            aria-label="move all inactive"
          >
            ≫
          </Button>
          <Button
            variant="outlined"
            size="small"
            className={classes.button}
            onClick={handleSelectedInactive}
            disabled={activeSelected.length === 0}
            aria-label="move selected inactive"
          >
            &gt;
          </Button>
          <Button
            variant="outlined"
            size="small"
            className={classes.button}
            onClick={handleSelectedActive}
            disabled={inactiveSelected.length === 0}
            aria-label="move selected active"
          >
            &lt;
          </Button>
          <Button
            variant="outlined"
            size="small"
            className={classes.button}
            onClick={handleAllActive}
            disabled={inactive.length === 0}
            aria-label="move all active"
          >
            ≪
          </Button>
        </Grid>
      </Grid>
      <Grid item xs={5}>
        <Typography gutterBottom variant="h5" className={classes.header}>
          Inactive Users
        </Typography>
        <div style={{ height: 550, width: "100%" }}>{customList(inactive)}
          <ListItem
              key={'addUser'}
              role="listitem"
              button
              classes={{ selected: classes.selected}}
              >
            <form className={classes.root} noValidate autoComplete="off">
              <ListItemText>
                <TextField 
                  InputLabelProps={{ shrink: manualShrink, error: manualError }}
                  id='addNewUser' 
                  value={addUserName}
                  className={classes.addNewUserRow}
                  onClick={() => {
                    setAddUserPlaceholder("");
                    setAddUserLabel(defaultAddUserLabel);
                    setAddUserHelperText(defaultAddUserHelperText);
                    setAddUserName("");
                    setManualShrink(true);

                  }}
                  onBlur={(event) => {
                    setAddUserPlaceholder("");
                    setAddUserLabel(addUserLabel);
                    setAddUserName("");
                    setAddUserHelperText(defaultAddUserHelperText);
                    setManualShrink(false);


                  }}
                  onKeyPress={(ev) => {
                    if (ev.key === 'Enter') {
                      searchForUser();
                      ev.preventDefault();
                    }
                  }}
                  onChange={(event) => {
                    setAddUserName(event.target.value)
                  }}
                  label={addUserLabel}
                  placeholder={addUserPlaceholder}
                  helperText={addUserHelperText}
                  />
              </ListItemText>
            </form> 
          </ListItem>
        </div>
        
      </Grid>
      <div>{section}</div>
    </Grid>
  );
}
