import { Button, FormControl, Grid, Input, InputLabel, makeStyles, MenuItem, Select, TextField, Typography } from '@material-ui/core';
import clsx from 'clsx';
import React, { useContext, useEffect } from "react";
import { useState } from "react";
import {BrowserRouter as Router, Route, Switch, Redirect, NavLink, NavLinkProps} from "react-router-dom";
import { AllContactTypesModel, ContactModel, ContactTypeModel, LanguageModel, SingleContactTypeModel, UserDetailsModel, UserOrgModel, UserProfile } from '../models';
import { deleteUserContact, getAllContactTypes, getLanguages, getLoggedInUser, getUserByFirstAndLastName, getUserDetails, updateUser, updateUserContacts, updateUserDefaultLanguages } from '../services/api';


  const useStyles = makeStyles((theme) => ({
    contactInfoPage: {
      alignContent: 'center',
      justifyContent: 'center'

    },
    contactInfoBox : {
      marginTop : '15px',
      width: '100%'

    },
    saveButton : {
      margin: '50px'
    },
    backButton : {
      marginTop: 'auto'
    },
    select : {
      width: '50vw'
    },
    userSettingsContainer: {
      width: '100%'
    },
    userSettingsRow: {
      width: '50vw'
    }
  }));
  
const LinkBehavior = React.forwardRef<any, NavLinkProps>((props, ref) => (
    <NavLink ref={ref}  {...props} />
  ));

export default function UserSettings() {
    const classes = useStyles();


    const [currentUser, setCurrentUser] = React.useState<UserProfile>();
    const [userContacts, setUserContacts] = React.useState<ContactModel[]>([]);
    const [alLContactTypes, setAllContactTypes] = React.useState<SingleContactTypeModel[]>([]);

    const [defaultLanguage, setDefaultLanguage] = React.useState<LanguageModel>();
    const [languages, setLanguages] = React.useState<LanguageModel[]>([]);

    const [userOrgs, setUserOrgs] = React.useState<UserOrgModel[]>([]);
    const [selectedOrg, setSelectedOrg] = React.useState<UserOrgModel>();


    useEffect(() => {
        let mounted = true;
      
        getLoggedInUser(currentUser?.userorg_workspace_id || 1).then((items) => {         
          if (mounted && items.users != null) {
            setCurrentUser(items.users[0]);
            setUserOrgs(items.users[0].userorgs);
            if (items.users[0].contacts) {
              setUserContacts(items.users[0].contacts);
            }
          }
        });
        return () => {
          mounted = false;
        };
      }, []);


      //TODO also add a language dropdown to the org creation modal in addition to country selection
      
      useEffect(() => {
        let mounted = true;
      
        getLanguages().then((items) => {
          
          if (mounted) {
            setLanguages(items);
          }
        });
        return () => {
          mounted = false;
        };
      }, []);


      useEffect(() => {
        let mounted = true;
      
        getAllContactTypes(currentUser?.userorg_workspace_id || 1).then((items) => {
          if (mounted && items?.contactTypes != null) {
           setAllContactTypes(items.contactTypes);
          }
        });
        return () => {
          mounted = false;
        };
      }, []);


      const checkIfContactExistsByTypeId =  (contact : ContactTypeModel) => {
        let contactFound = false;

        userContacts.map((value) => {
          if (value.contactType.contactTypeId == contact.contactTypeId) {
            contactFound = true;
          }
        });
        return contactFound;
      }

      const checkIfContactExistsOnCurrentUser =  (contact : ContactModel) => {
        let contactFound = false;

        currentUser?.contacts?.map((value) => {
          if (value.contactType.contactTypeId == contact.contactType.contactTypeId) {
            contactFound = true;
          }
        });
        return contactFound;
      }


      const getContactTypeId =  (contact : string) => {
        let id = 0;

        alLContactTypes.map((value) => {
          if (value.type.toLowerCase() == contact.toLowerCase()) {
            id = value.contactTypeId;
          }
        });
        return id;
      }

      const getContactType =  (contactTypeId: number) => {
        let id = 'N/A';

        alLContactTypes.map((value) => {
          if (value.contactTypeId == contactTypeId) {
            id = value.type;
          }
        });
        return id;
      }

      const getContactTypeDisplayName = (contact : string) => {
        let displayName = "N/A";

        alLContactTypes.map((value) => {
          if (value.type.toLowerCase() == contact.toLowerCase()) {
            displayName = value.display;
          }
        });

        return displayName;

      }

    const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      let contactFound = false;
      //search through user contacts -> check .ContactType for contact type info, and if target id contains that string, change the value
      userContacts.map((value) => {
        
        if (value.contactType.contactTypeId.toString() == event.target.id) {
          let temp = { ...value, 'value': event.target.value };
          userContacts.pop();
          userContacts.push(temp);
          contactFound = true;
        }
      })

      //TODO only add to user contacts when finished



      //for contact types that don't already exist for this user, get their ID and add them as new
      if (!contactFound) {
        let tempContactType : ContactTypeModel = {
            'type' : getContactType(parseInt(event.target.id)),
            'contactTypeId' : parseInt(event.target.id)
          
        };

        if (currentUser) {
          let temp : ContactModel = {
            'contactType' : tempContactType,
            'contactid' : 0,
            'contacttypeid' : parseInt(event.target.id),
            'created' : new Date(),
            'enableLogin' : true,
            'enabled' : true,
            'userId' : currentUser.userid,
            'value' : event.target.value,
          }

          userContacts.push(temp);

        }
      }
    };


    //loop through all contacts and post them individually
    function postUser() {
        if (currentUser) {
          userContacts.map((contact) => {

            //if contact already exists in current user's contacts, and if so, delete existing entry and add new one
            //TODO can there be more than one of each contact type? If so, change this logic
            if (checkIfContactExistsOnCurrentUser(contact)){
              deleteUserContact(currentUser?.userorg_workspace_id || 1, currentUser, contact).then((data) => {
                updateUserContacts(currentUser?.userorg_workspace_id || 1, currentUser, contact);
              });
            }
            else {
              updateUserContacts(currentUser?.userorg_workspace_id || 1, currentUser, contact);
            }

            
          })

          userOrgs.map( org => {
            if (org.defaultLanguage && org.orgId) {
              updateUserDefaultLanguages(currentUser, org);
            }
            
          })

        }
      }

      function deleteAllContacts() {
        if (currentUser) {
          userContacts.map((contact) => {
            deleteUserContact(currentUser?.userorg_workspace_id || 1, currentUser, contact);
          })
        }
        
      }

      const handleLanguageChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        let selectedLanguageCode = event.target.value as string;       
        let language = languages.find(language => language.code == selectedLanguageCode);
        
        if (language) {
          //set default language 
          setDefaultLanguage(language);
          let org = userOrgs.find(org => org.orgId == selectedOrg?.orgId);

          //set language on current org
          if (org) {
            org.defaultLanguage = language.code;
          }

        }
      };

      /*[Yesterday 1:55 PM] Foster, Stephanie - 0223 - MITLL
    POST /users/1/updateprofile?requestingUserOrgId={​id}​ <--- the userorgid is in the whoami / GET users payload
*/
      const handleOrgChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        let selectedOrgId = event.target.value as number;        
        let org = userOrgs.find(org => org.orgId == selectedOrgId);
        
        if (org) {
          setSelectedOrg(org);
          if (org.defaultLanguage != null) {
            let language = languages.find(language => language.code == org?.defaultLanguage);

            //set current default language if there is one
            if (language) {
              setDefaultLanguage(language);
            }
          }
        }

      };

      const userContactsView = (
          userContacts.map((contact, index) => {
            const labelId = `${contact.contactType.contactTypeId}`;
            const contactType = (contact.contactType != null ? contact.contactType.type : "n/a");
            return (
              <Grid item xs={12}>
                <TextField
                  className={classes.contactInfoBox}
                  id={labelId}
                  label={getContactTypeDisplayName(contactType)}
                  placeholder={contact.value}
                  InputLabelProps={{ shrink: true }}
                  onChange={handleFormChange}
                />
              </Grid>
              
            )
          })
      )

      const emptyContactsView = (
        alLContactTypes.map((possibleType) => {
          const labelId = `${possibleType.contactTypeId}`;

          if (!checkIfContactExistsByTypeId(possibleType)) {
            return (
              <Grid item xs={12}>
                <TextField
                  className={classes.contactInfoBox}
                  id={labelId}
                  label={possibleType.display}
                  placeholder={possibleType.display}
                  InputLabelProps={{ shrink: true }}
                  onChange={handleFormChange}
                />
              </Grid>
              
            )
          }
        })
      )

    return (
    <div>
      <Grid container justify="center" className={classes.userSettingsContainer}>
        {currentUser != null && currentUser != undefined && 
        <form noValidate autoComplete="off" >
          <Grid item xs={12} className={classes.userSettingsRow}>
            <TextField
                className={classes.contactInfoBox}
                id="username"
                label="Username"
                value={currentUser?.username}
                InputLabelProps={{ shrink: true }}
                onChange={handleFormChange}
              />
          </Grid>
          <Grid item xs={12} className={classes.userSettingsRow}>
            <TextField
                className={classes.contactInfoBox}
                id="firstname"
                label="First Name"
                value={currentUser?.firstname}
                InputLabelProps={{ shrink: true }}
                onChange={handleFormChange}
              />
          </Grid>
          <Grid item xs={12} className={classes.userSettingsRow}>
            <TextField
              className={classes.contactInfoBox}
                id="lastname"
                label="Last Name"
                value={currentUser?.lastname}
                InputLabelProps={{ shrink: true }}
                onChange={handleFormChange}
              />
          </Grid>
            {userContacts && 
              userContactsView}
            {emptyContactsView}


              <Grid item xs={12} className={classes.userSettingsRow}>
                <FormControl>
                    <InputLabel id="type-select-label">Default Language (Select an Organization)</InputLabel>
                      <Select
                        className={classes.select}
                        labelId="type-select"
                        id="type-select"
                        value={selectedOrg}
                        onChange={handleOrgChange}
                        input={<Input />}
                      >
                        {userOrgs?.map((org: UserOrgModel) => (
                          <MenuItem key={org.org.name} value={org.orgId}>
                            {org.org.name}
                          </MenuItem>
                        ))}
                      </Select>
                  </FormControl>
              </Grid>
              <Grid item xs={12} className={classes.userSettingsRow}>
                <FormControl>
                  <InputLabel id="type-select-label">Organization Default Language</InputLabel>
                    <Select
                      className={classes.select}
                      labelId="type-select"
                      id="type-select"
                      value={defaultLanguage}
                      onChange={handleLanguageChange}
                      input={<Input />}
                    >
                      {languages?.map((language: LanguageModel) => (
                        <MenuItem key={language.language} value={language.code}>
                          {language.language}
                        </MenuItem>
                      ))}
                    </Select>
                </FormControl>
              </Grid>
            <Grid item xs={12} className={classes.userSettingsRow}>
                <Button
                  variant="contained"
                  className={classes.saveButton}
                  component={LinkBehavior}
                  to="/admin"
                  >
                  Back
                </Button>
              <Button
                variant="contained"
                className={classes.saveButton}
                onClick={postUser}
                  >
              Save Changes
              </Button>
            </Grid>

          </form>
        }
      </Grid>
    </div>
  )
}
