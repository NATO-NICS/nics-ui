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
import {
  AppBar,
  Box,
  Button,
  Card,
  CardMedia,
  Chip,
  Collapse,
  Container,
  CssBaseline,
  Divider,
  Drawer,
  Fab,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  MenuItem,
  Modal,
  Paper,
  Select,
  Tab,
  Tabs,
  TextField,
  Toolbar,
  Typography,
} from "@material-ui/core";
import clsx from 'clsx';
import React, { useContext, useEffect } from "react";
import { useState } from "react";
import AnnouncementList from "../components/AnnouncementList";
import Organizations from "../components/Organizations";
import RegionsList from "../components/RegionsList";
import OrgDetails from "../components/OrgDetails";
import { FolderModel, IncidentTypeModel, OrganizationModel, SymbolListModel, SymbolModel,RegionModel, RegionsModel,RegionEditPayload, SingleCountryModel, SingleOrgTypeModel, LanguageTranslationModel, LanguageModel, LoggedInUserModel, WorkspaceModel } from "../models";
import { } from "@testing-library/react";
import { withStyles, WithStyles } from '@material-ui/core/styles';
import FolderIcon from '@material-ui/icons/Folder';
import PublicIcon from '@material-ui/icons/Public';
import AssignmentIcon from '@material-ui/icons/Assignment';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import AnnouncementIcon from '@material-ui/icons/Announcement';
import SearchIcon from '@material-ui/icons/Search';
import logoSmall from '../static/img/logo_small.png'
import logoExpanded from '../static/img/logo_expanded.png'
import SortIcon from '@material-ui/icons/Sort';
import GlobalUsers from "../components/GlobalUsers";
import PhotoIcon from '@material-ui/icons/Photo';
import Symbology from "../components/Symbology";
import SymbologyDetails from "../components/SymbologyDetails";
import GpsFixedIcon from '@material-ui/icons/GpsFixed';
import { addOrgTypeToOrg, addRegion, getCountries, getCountriesAddOrg, getLanguages, getLoggedInUser, getLoggedInUserModel, getOrgTypes, getSuperOrgs, getUserWorkspaces, postOrganization, postSymbologySet, updateOrg } from "../services/api";
import PersonIcon from '@material-ui/icons/Person';
import { MenuIcon } from "@material-ui/data-grid";
import Translations from "../components/Translations";
import IncidentTypes from "../components/IncidentTypes";
import IncidentTypeDetails from "../components/IncidentTypeDetails";
import {BrowserRouter as Router, Route, Redirect, NavLink, NavLinkProps} from "react-router-dom";
import Switch from "@material-ui/core/Switch";

const drawerWidth = '5%';

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
      fontFamily: 'Open Sans',

      '& .MuiFab-root' : {
        color: 'white',
        backgroundColor: "#181C25 !important",
        fontFamily: 'Open Sans',
        textTransform : 'lowercase',

      }
    },
    content : {
        marginLeft: '10%',
        margin: 'auto',
        flexGrow: 1,
        padding: theme.spacing(3),
    },
    full_row_paper: {
      width: "100%",
      height: "43vh",
    },
    header : {
        fontFamily: 'Abel',
        textTransform : 'uppercase',
        marginTop: '5%'
    },
    modalHeader : {
      backgroundColor: '#181C25',
      color: 'white',
      paddingTop: '25px',
      paddingBottom: '25px'
    },
    bodyFont : {

    },
    modal : {
        height: '75vh',
        width: '75%',
        margin: 'auto',
        marginTop: '100px',
        overflowY: 'scroll',
    },
    modalHeaderText : {
      textTransform : 'uppercase',
      fontFamily: 'Abel',
      textAlign: 'center'


    },
    modalRow : {
      width: '100%',
      marginTop: '20px',
      marginLeft: '30px'
    },
    modalFooter: {
      marginTop: '100px',
      marginLeft: '30px'

    },

    search : {
        width: "100%",
        height: '100%',
        backgroundColor: "white !important",
        fontFamily: 'Open Sans',
        textTransform: 'lowercase'

    },
    searchIcon : {
        paddingBottom: "5px",
        marginLeft : '10px'
    },
    sort: {
        width : '100%',
        textAlign : "center",
        display: 'flex',

        '& .MuiSelect-filled' : {
            backgroundColor: 'white !important',
            alignContent: 'center',
            fontFamily: 'Abel',
            textTransform : 'uppercase',
        },

        '& .MuiSelect-iconOutlined' : {
            backgroundColor: 'transparent !important'
        }

    },
    sortDropdown : {

    },
    searchBar : {

    },
    searchSort : {
        width: '78%'
    },
    profileButton : {
      margin: '0px',
      top: '20px',
      right: '20px',
      bottom: 'auto',
      left: 'auto',
      position: 'fixed',

      '&:hover' : {
        color: '#bf3e32'
      }
  },
  profileButtonLink : {
    fontFamily: 'Open Sans',
    textTransform: 'lowercase',
    color: 'white',


    '&:hover' : {
      color: '#bf3e32'
    }
  },
  menu : {
    position: "fixed",
    top: "0px",
    left: "0px",
    height: "100%",
    width: '5%',
    backgroundColor: "#181C25",
    color: "white",
    alignContent: "left"
},
menuTab : {
  marginRight: '20px',
  "& .MuiTab-wrapper" : {
      flexDirection: "row !important",
      position: 'absolute'
  },
  '&:hover' : {
      color: "white !important"
    }

},
menuTabIcon : {
  marginRight : 'auto',
  marginLeft : '25px'
},
tabs : {
  height: '100%',

  color: '#BEBFC3 !important',
  "& .MuiTabs-indicator" : {
      backgroundColor: "transparent"
  },
  '& .Mui-selected' : {
      color: '#bf3e32 !important',
      textTransform : 'uppercase',
      fontWeight: 'bold'

  },
  '& .MuiTabs-flexContainer': {
    height: '100%',
    justifyContent: 'space-evenly',
  }

},
logoWrapper: {
    backgroundColor: "transparent !important",
    alignContent: 'center',
    borderColor: 'transparent !important',
    marginBottom: '25px',

},
logo : {
  marginTop: '10px',
  paddingBottom: '5px',
  height: '75px'

},
logoName: {
  color: 'white !important',
  textAlign: 'center',
  fontFamily: 'Abel',
  textTransform : 'uppercase',
  fontWeight: 'bold',
  marginTop: '10px'
},
appBar: {
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.easeIn,
    duration: theme.transitions.duration.leavingScreen,
  }),
  position: "fixed",
  width: '4%',
  top: "0px",
  left: "0px",
  height: "100%",
  backgroundColor: "#181C25",
  color: "white",
  alignContent: "left"
},
appBarShift: {
  width: `18%`,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.easeOut,
    duration: theme.transitions.duration.enteringScreen,
  })
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  select : {
    width: '250px'
  },
  formControl : {
    width: '100%'
  }
}));

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

const LinkBehavior = React.forwardRef<any, NavLinkProps>((props, ref) => (
  <NavLink ref={ref}  {...props} />
));



export default function AdminPage(props: {}) {
  const classes = useStyles();

  const [loggedInUserObj,setLoggedInUserObj] = React.useState<LoggedInUserModel>({} as LoggedInUserModel);
  const [loggedInUser, setLoggedInUser] = React.useState<string>();
  const [loggedInUserName, setLoggedInUserName] = React.useState<string>("");
  const [userWorkspaces, setUserWorkspaces] = React.useState<WorkspaceModel[]>([]);
  const [userCurrentWorkspace, setUserCurrentWorkspace] = React.useState<WorkspaceModel>({} as WorkspaceModel);


  const [currentTab, setCurrentTab] = React.useState(0);
  const [selectedOrg, setSelectedOrg] = React.useState<OrganizationModel>({} as OrganizationModel);
  const [orgDetailsOpen, setOrgDetailsOpen] = React.useState(false);
  const [symbologyOpen, setSymbologyOpen] = React.useState(false);
  const [incidentTypeOpen, setIncidentTypeOpen] = React.useState(false);

  const [addNewSymbologyModalOpen, setAddNewSymbologyModalOpen] = useState<boolean>(false);
  const [isAddNewOrgOpen, setIsAddNewOrgOpen] = React.useState(false);

  const [isFolderPicked, setIsFolderPicked] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File>();
  const [uploadEnabled, setUploadDisabled] = useState<boolean>(true);

  // translations
  const [selectedLang, setSelectedLang] = React.useState<LanguageTranslationModel>();
  const [langOpen, setLangOpen] = React.useState(false);

  const [newSymbologySet, setNewSymbologySet] = useState<SymbolModel>();
  const [selectedSymbology, setSelectedSymbology] = React.useState<SymbolModel>();
  const [selectedSymbologyListing, setSelectedSymbologyListing] = React.useState<SymbolListModel>();

  const [allCountries, setAllCountries] = useState<SingleCountryModel[]>([]);
  const [allOrgTypes, setAllOrgTypes] = useState<SingleOrgTypeModel[]>([]);
  const [newOrg, setNewOrg] = useState<OrganizationModel>();
  const [saveNewOrgDisabled, setSaveNewOrgDisabled] = useState<boolean>(true);
  const [selectedNewOrgTypes, setSelectedNewOrgTypes] = useState<SingleOrgTypeModel[]>([]);
  const [selectedNewOrgTypeNames, setSelectedNewOrgTypeNames] = useState<string[]>([]);

  const [restrictNewOrgIncidents, setRestrictNewOrgIncidents] = useState<boolean>(false);
  const [requireNewOrgAdmin, setRequireNewOrgAdmin] = useState<boolean>(false);
  const [defaultLanguage, setDefaultLanguage] = React.useState<LanguageModel>();
  const [languages, setLanguages] = React.useState<LanguageModel[]>([]);
  const [selectedNewOrgCountry, setSelectedNewOrgCountry] = React.useState<SingleCountryModel>();
  const [newOrgParentOrg, setNewOrgParentOrg] = React.useState<OrganizationModel>();
  const [orgList, setOrgList] = React.useState<OrganizationModel[]>([]);

  const [filter, setFilter] = React.useState<string>();

  const [selectedIncidentType, setSelectedIncidentType] = React.useState<IncidentTypeModel>();

  const [globalUserDetailsOpen, setGlobalUserDetailsOpen] = React.useState(false);

  const [adminMenuLogoName, setAdminMenuLogoName] = React.useState<string>("NICS");
  const [sort, setSort] = React.useState('SORT');
  const [open, setOpen] = React.useState<boolean>(false);

  const[logoSource, setLogoSource] = React.useState(logoExpanded);



  const [regionOpen, setRegionOpen] = React.useState(false);
  const [addNewRegionModalOpen, setAddNewRegionModalOpen] = useState<boolean>(false);
  const [selectedRegion, setSelectedRegion] = React.useState<RegionModel>();
  const [selectedRegionList, setSelectedRegionList] = React.useState<RegionsModel>();
  const [newRegionSet, setNewRegionSet] = useState<RegionEditPayload>();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    let mounted = true;
    
    if (loggedInUser) {
      getUserWorkspaces().then((items) => {
        if (mounted) {
         setUserWorkspaces(items.workspaces);
         setUserCurrentWorkspace(items.workspaces[0]);
        }
      });
      return () => {
        mounted = false;
      };
    }
  }, [loggedInUser]);



  //TODO

  //user profile has field userid, but needs userId for workspace & admin rights to work properly
  //create a new model and logged in user endpoint that reflects this & change in the Organizations API call
  useEffect(() => {
    let mounted = true;
    getSuperOrgs(userCurrentWorkspace.workspaceid).then((items) => {
      if (mounted) {
        setOrgList(items.organizations);
      }
    });
    return () => {
      mounted = false;
    };
  }, [userCurrentWorkspace]);

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

    getLoggedInUserModel(userCurrentWorkspace.workspaceid).then((items) => {
      if (mounted && items.users != null) {
        setLoggedInUser(items.users[0].username);
        setLoggedInUserName(items.users[0].firstname + " " + items.users[0].lastname);
        setLoggedInUserObj(items.users[0]);
      }
    });
    return () => {
      mounted = false;
    };
  }, [userCurrentWorkspace]);

  useEffect(() => {
    let mounted = true;
  
    getOrgTypes(userCurrentWorkspace.workspaceid).then((items) => {
      if (mounted) {
        setAllOrgTypes(items.orgTypes);
      }
    });
    return () => {
      mounted = false;
    };
  }, [userCurrentWorkspace]);

  useEffect(() => {
    let mounted = true;
    getCountriesAddOrg().then((items) => {
      if (mounted) {
        setAllCountries(items.countries);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
  
    if (mounted) {
      handleAddNewOrgOpen();
    }
    return () => {
      mounted = false;
    };
  }, [isAddNewOrgOpen]);

  function handleTabChange(event: React.ChangeEvent<{}>, newValue: number) {
    setCurrentTab(newValue);
    setFilter('');
  }

  const handleOrgDetailsOpen = () => {
    
    setOrgDetailsOpen(true);
  };

  const handleAddNewOrgClose = () => {
    setIsAddNewOrgOpen(false);
  };

  const handleAddNewOrgOpen = () => {
    setSelectedNewOrgTypes([]); 
    
    //set default org info
    setNewOrg({
      orgId: 0,
      name: '',
      county: '',
      state: '',
      timezone: '',
      prefix: '',
      distribution: '',
      defaultlatitude : 0.00,
      defaultlongitude: 0.00,
      defaultlanguage: '',
      parentorgid: 1,
      countryId: 1,
      created: 1,
      restrictincidents: false,
      createincidentrequiresadmin: false,
      userorgs: [],
      orgTypes: []

    })
    
  }

  const handleOrgDetailsClose = () => {
    setSelectedOrg({} as OrganizationModel);
    setOrgDetailsOpen(false);
  };

  const handleLangOpen = () => {
      setLangOpen(true);
  };

  const handleLangClose = () => {
      setLangOpen(false);
  };

  const handleSymbologyClose = () => {
    setSymbologyOpen(false);
  };

  const handleIncidentTypeClose = () => {
    setIncidentTypeOpen(false);
  };

  const handleTabEnter = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {

  }

  const handleTabExit = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {}



  const handleSortChange = (event: React.ChangeEvent<{ value: unknown }>) => {
      setSort(event.target.value as string);
  
  }

  function handleAddNewSymbologyClose() {
    setAddNewSymbologyModalOpen(false);
  }

  function handleAddNewSymbologyOpen() {
    setAddNewSymbologyModalOpen(true);
  }

  function handleRegionAdd() {
    let testRegion: RegionEditPayload = newRegionSet!;
    addRegion(testRegion)

  }

  function handleAddNewRegionModalClose() {
    setAddNewRegionModalOpen(false);
  }
  function handleAddNewRegionModalOpen() {
    setAddNewRegionModalOpen(true);
  }

  function handleAddNewOrg() {
    if (newOrg != undefined) {
      
      let mounted = true;

      postOrganization(userCurrentWorkspace.workspaceid, newOrg).then((orgs) => {
        if (mounted) {
          selectedNewOrgTypes.map((orgType) => {
            addOrgTypeToOrg(userCurrentWorkspace.workspaceid, orgs.organizations[0].orgId, orgType.orgTypeId);
          })
          
          handleAddNewOrgClose();
        }
      })
    }
  }


function handleFileAdd() {
  if (isFolderPicked) {
      let data = new FormData();
      setUploadDisabled(true);
      if (loggedInUser != undefined && newSymbologySet?.name !== undefined && newSymbologySet?.description !== undefined &&
         selectedFile !== undefined) {
          data.append('name', newSymbologySet?.name);
          data.append('description', newSymbologySet?.description);
          data.append('owner', loggedInUser.toLowerCase());
          data.append('file', selectedFile);

          let mounted = true;
          postSymbologySet(data).then((items) => {
            if (mounted) {
              handleAddNewSymbologyClose();
              setUploadDisabled(false);
            }
          });
          return () => {
            mounted = false;
          };
      }
  }
  else {
    console.log("No file selected, could not accept.");
    setUploadDisabled(false);

  }
}

const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  let temp = { ...newSymbologySet, [event.target.id]: event.target.value };
  setNewSymbologySet(temp as SymbolModel);
};


const handleAddNewOrgChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  let temp = { ...newOrg, [event.target.id]: event.target.value };
  setNewOrg(temp as OrganizationModel);
  checkIfAddOrgFormComplete();

};


  //if all required fields are complete, enable save button
  //TODO there's likely be a better way to do this?
const checkIfAddOrgFormComplete = () => {
  if (newOrg != undefined && newOrg.name != '' && newOrg.county != '' && newOrg.state != '' && newOrg.timezone != '' && newOrg.prefix != '' &&
  newOrg.distribution != '' && newOrg.defaultlanguage != '' && newOrg.hasOwnProperty('restrictincidents') && newOrg.hasOwnProperty('createincidentrequiresadmin')) {
      setSaveNewOrgDisabled(false);
    }
}

const handleOrgSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  setNewOrg({
    ...newOrg,
    [event.target.name]: event.target.checked,
  } as OrganizationModel);
  
  checkIfAddOrgFormComplete();

};

const handleChangeNewOrgTypes = (event: React.ChangeEvent<{ value: unknown }>) => {
  let selectedTypes = event.target.value as string[];

  setSelectedNewOrgTypeNames(selectedTypes);
  let allSelected : SingleOrgTypeModel[] = [];
  
  selectedTypes.map((orgType) => {
    let selectedOrgType = allOrgTypes.find(compareOrgType => compareOrgType.orgTypeName == orgType);
    if (selectedOrgType) {
      allSelected.push(selectedOrgType);
    }
  });

  setSelectedNewOrgTypes(allSelected);
  checkIfAddOrgFormComplete();
};


const handleChangeParentOrg = (event: React.ChangeEvent<{ value: unknown }>) => {
  let selectedOrgId = event.target.value as number;
  let selectedOrg = orgList.find(org => org.orgId == selectedOrgId);

  if (selectedOrg) {
    setNewOrgParentOrg(selectedOrg);
    if (newOrg) {
      newOrg.parentorgid=selectedOrg.orgId;
    }
  }
  checkIfAddOrgFormComplete();

};

const handleChangeNewLanguage = (event: React.ChangeEvent<{ value: unknown }>) => {
  let selectedLanguageCode = event.target.value as string;
  let language = languages.find(language => language.code == selectedLanguageCode);


  if (language) {
      setDefaultLanguage(language);
      newOrg!.defaultlanguage = (event.target.value as string);

  }
}
const handleChangeWorkspace = (event: React.ChangeEvent<{ value: unknown }>) => {
  let selectedWorkspaceId = event.target.value as number;
  let selectedWorkspace = userWorkspaces.find(workspace => workspace.workspaceid == selectedWorkspaceId);

  if (selectedWorkspace) {
    setUserCurrentWorkspace(selectedWorkspace);
  }
};

const handleChangeNewCountry = (event: React.ChangeEvent<{ value: unknown }>) => {
  let countryid = event.target.value as number;
  let country = allCountries.find(country => country.countryId == countryid)

  if (country) {
    setSelectedNewOrgCountry(country);
    newOrg!.countryId = (event.target.value as number);
  }
  
  checkIfAddOrgFormComplete();
};

const handleFileChange = (event : any) => {
    setSelectedFile(event.target.files[0]);
    setIsFolderPicked(true);
    setUploadDisabled(false);
};

  const detailsPanel = (
      <Paper className={classes.modal}>
        <Grid container>
            <Grid item xs={12} className={classes.modalHeader}>
                <Typography variant="h4" className={classes.modalHeaderText}>
                {selectedOrg?.name || "No Organization Selected"}
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <OrgDetails
                    currentWorkspaceId={userCurrentWorkspace.workspaceid}
                    selectedOrg={selectedOrg}
                    setSelectedOrg={setSelectedOrg}                    
                />
            </Grid>
        </Grid>
      </Paper>
  )

  const incidentTypePanel = (
    <Paper className={classes.modal}>
      <Grid container>
          <Grid item xs={12} className={classes.modalHeader}>
              <Typography variant="h4" className={classes.modalHeaderText}>
              {selectedIncidentType?.incidentTypeName || "No Incident Type Selected"}
              </Typography>
          </Grid>
          <Grid item xs={12}>
              {selectedIncidentType && <IncidentTypeDetails currentWorkspaceId={userCurrentWorkspace.workspaceid} selectedIncidentType={selectedIncidentType}></IncidentTypeDetails>}
          </Grid>
      </Grid>
    </Paper>
)

  const symbologyPanel = (
    <Paper className={classes.modal}>
      <Grid container>
          <Grid item xs={12} className={classes.modalHeader}>
              <Typography variant="h4" className={classes.modalHeaderText}>
              {selectedSymbology?.name || "No Symbology Selected"}
              </Typography>
          </Grid>
          <Grid item xs={12}>
              {selectedSymbology && <SymbologyDetails created={selectedSymbology?.created} listing={selectedSymbology?.listing} owner={selectedSymbology?.owner} name={selectedSymbology?.name} description={selectedSymbology?.description} symbologyid={selectedSymbology?.symbologyid} listingObject={selectedSymbologyListing}></SymbologyDetails>}
          </Grid>
      </Grid>
    </Paper>
)

const addSymbologyPanel = (
  <Paper className={classes.modal}>
      <Grid container>
          <Grid item xs={12} className={classes.modalHeader}>
              <Typography variant="h4" className={classes.modalHeaderText}>
              Add New Symbology
              </Typography>
          </Grid>
          <Grid item xs={12} className={classes.modalRow}>
            <TextField
                id="name"
                label="Name"
                value={newSymbologySet?.name}
                InputLabelProps={{ shrink: true }}
                onChange={handleChange}

                  />

          </Grid>
          <Grid item xs={12} className={classes.modalRow}>
              <TextField
                id="description"
                label="Description"
                multiline
                value={newSymbologySet?.description}
                InputLabelProps={{ shrink: true }}
                onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} className={classes.modalRow}>
            {!isFolderPicked &&
            <Typography>
            Select a .zip file to upload:</Typography>}
          </Grid>
          <Grid item xs={12} className={classes.modalRow}>
            <input type="file" name="file" accept="application/zip" onChange={handleFileChange}
/>
          </Grid>
          <Grid item xs={12} className={classes.modalFooter}>
           <Button variant="contained" onClick={handleFileAdd} disabled={uploadEnabled}>Accept And Upload</Button>

          </Grid>

      </Grid>
    </Paper>
)

const addRegionPanel = (
  <Paper className={classes.modal}>
      <Grid container>
          <Grid item xs={12} className={classes.modalHeader}>
              <Typography variant="h4" className={classes.modalHeaderText}>
              Add New Region
              </Typography>
          </Grid>
          <Grid item xs={12} className={classes.modalRow}>
            <TextField
                id="regionName"
                label="Name"
                value={newRegionSet?.regionName}
                InputLabelProps={{ shrink: true }}
                onChange={handleChange}

                  />

          </Grid>
          <Grid item xs={12} className={classes.modalRow}>
              <TextField
                id="regionCode"
                label="region Code"
                multiline
                value={newRegionSet?.regionCode}
                InputLabelProps={{ shrink: true }}
                onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} className={classes.modalRow}>
              <TextField
                id="countryId"
                label="Country ID"
                multiline
                value={newRegionSet?.countryId}
                InputLabelProps={{ shrink: true }}
                onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} className={classes.modalFooter}>
           <Button variant="contained" onClick={handleRegionAdd}>Accept And Upload</Button>

          </Grid>

      </Grid>
    </Paper>
)



const addOrganizationPanel = (
  <Paper className={classes.modal}>
      <Grid container>
          <Grid item xs={12} className={classes.modalHeader}>
              <Typography variant="h4" className={classes.modalHeaderText}>
              Add New Organization
              </Typography>
          </Grid>
      <form className={classes.root} noValidate autoComplete="off" >
          <Grid item xs={12} style={{'width' : '100%'}}>
            <Grid item xs={6} className={classes.modalRow}>
              <TextField
                  className={classes.formControl}
                  id="name"
                  label="Name"
                  value={newOrg?.name}
                  placeholder="name"
                  InputLabelProps={{ shrink: true }}
                  onChange={handleAddNewOrgChange}
                />
              </Grid>
              <Grid item xs={6} className={classes.modalRow}>
                <TextField
                    className={classes.formControl}
                    id="county"
                    label="County"
                    value={newOrg?.county}
                    placeholder="county"
                    InputLabelProps={{ shrink: true }}
                    onChange={handleAddNewOrgChange}
                    />
                      
              </Grid>
          </Grid>

          <Grid item xs={12} style={{'width' : '100%'}}>
            <Grid item xs={6} className={classes.modalRow}>
                <TextField
                    className={classes.formControl}
                    id="state"
                    label="State"
                    value={newOrg?.state}
                    placeholder="state"
                    InputLabelProps={{ shrink: true }}
                    onChange={handleAddNewOrgChange}
                    />  
              </Grid>
              <Grid item xs={6} className={classes.modalRow} style={{'width' : '100%'}}>
                <FormControl className={classes.formControl}>
                  <InputLabel id="country-select-label">Parent Organization</InputLabel>
                    <Select
                      labelId="parent-org-select"
                      id="parent-org-select"
                      value={newOrgParentOrg}
                      onChange={handleChangeParentOrg}
                      input={<Input />}
                    >
                      {orgList.map((org) => (
                        <MenuItem key={org.orgId} value={org.name}>
                          {org.name}
                        </MenuItem>
                      ))}
                    </Select>
                </FormControl>
              </Grid>
          </Grid>

          <Grid item xs={6} className={classes.modalRow} style={{'width' : '100%'}}>
                <FormControl className={classes.formControl}>
                  <InputLabel id="type-select-label">Organization Type</InputLabel>
                    <Select
                      labelId="type-select"
                      id="type-select"
                      multiple
                      value={selectedNewOrgTypeNames}
                      onChange={handleChangeNewOrgTypes}
                      input={<Input />}
                      renderValue={(selected) => (
                        <div>
                          {(selected as string[]).map((orgTypeName) => (
                            
                            <Chip key={orgTypeName} label={orgTypeName}/>
                          ))}
                        </div>
                      )}
                    >
                      {allOrgTypes.map((orgType) => (
                        <MenuItem key={orgType.orgTypeName} value={orgType.orgTypeName}>
                          {orgType.orgTypeName}
                        </MenuItem>
                      ))}
                    </Select>
                </FormControl>
              </Grid>
          <Grid item xs={12}>
            <Grid item xs={6} className={classes.modalRow} style={{'width' : '100%'}}>
                <FormControl className={classes.formControl}>
                  <InputLabel id="country-select-label">Country</InputLabel>
                    <Select
                      labelId="country-select"
                      id="country-select"
                      value={selectedNewOrgCountry}
                      onChange={handleChangeNewCountry}
                      input={<Input />}
                    >
                      {allCountries.map((country) => (
                        <MenuItem key={country.countryId} value={country.countryId}>
                          {country.name}
                        </MenuItem>
                      ))}
                    </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6} className={classes.modalRow} style={{'width' : '100%'}}>
                <TextField
                    className={classes.formControl}
                    id="timezone"
                    label="Timezone"
                    value={newOrg?.timezone}
                    placeholder="timezone"
                    InputLabelProps={{ shrink: true }}
                    onChange={handleAddNewOrgChange}
                />
              </Grid>
          </Grid>

          <Grid item xs={12} style={{'width' : '100%'}}>
            <Grid item xs={6} className={classes.modalRow} style={{'width' : '100%'}}>
                <TextField
                    className={classes.formControl}
                    id="prefix"
                    label="Prefix"
                    value={newOrg?.prefix}
                    placeholder="prefix"
                    InputLabelProps={{ shrink: true }}
                    onChange={handleAddNewOrgChange}

                />  
              </Grid>
              <Grid item xs={6} className={classes.modalRow} style={{'width' : '100%'}}>
                <TextField
                    className={classes.formControl}
                    id="distribution"
                    label="Distribution"
                    value={newOrg?.distribution}
                    placeholder="distribution"
                    InputLabelProps={{ shrink: true }}
                    onChange={handleAddNewOrgChange}

                />  
              </Grid>
          </Grid>
          <Grid item xs={12} style={{'width' : '100%'}}> 
            <Grid item xs={6} className={classes.modalRow} style={{'width' : '100%'}}>
              <TextField
                  className={classes.formControl}
                  id="defaultlatitude"
                  label="Default Latitude"
                  value={newOrg?.defaultlatitude}
                  placeholder="Default Latitude"
                  InputLabelProps={{ shrink: true }}
                  onChange={handleAddNewOrgChange}

              />  
            </Grid>
            <Grid item xs={6} className={classes.modalRow} style={{'width' : '100%'}}>
              <TextField
                  className={classes.formControl}
                  id="defaultlongitude"
                  label="Default Longitude"
                  value={newOrg?.defaultlongitude}
                  placeholder="Default Longitude"
                  InputLabelProps={{ shrink: true }}
                  onChange={handleAddNewOrgChange}

              />  
            </Grid>

          </Grid>
          <Grid item xs={6} className={classes.modalRow} >
            <FormControl className={classes.formControl}>
              <InputLabel id="type-select-label">Default Language</InputLabel>
                <Select
                  labelId="type-select"
                  id="defaultlanguage"
                  value={defaultLanguage}
                  onChange={handleChangeNewLanguage}
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
          <Grid item xs={12} className={classes.modalRow} style={{'width' : '100%'}}> 
            <FormControlLabel
            control={<Switch value={newOrg?.restrictincidents} checked={newOrg?.restrictincidents != undefined ? newOrg.restrictincidents : false} onChange={handleOrgSwitchChange} name="restrictincidents" />}
            label="Restrict Incidents"
            />
          </Grid>
          <Grid item xs={12} className={classes.modalRow} style={{'width' : '100%'}}>
            <FormControlLabel
            control={<Switch value={newOrg?.createincidentrequiresadmin} checked={newOrg?.createincidentrequiresadmin != undefined ? newOrg?.createincidentrequiresadmin : false} onChange={handleOrgSwitchChange} name="createincidentrequiresadmin" />}
            label="Require Admin to Create Incidents"
            />
          </Grid>
          <Grid item xs={12} className={classes.modalFooter} >
            <Button variant="contained" onClick={handleAddNewOrg} disabled={saveNewOrgDisabled}>Save</Button>
          </Grid>
          
          </form>
      </Grid>  
    </Paper>
  );


  return (
    <div>
    <Grid container spacing={1} alignItems="center" justify="center" className={classes.root}>
          <Grid item xs={12} onMouseOver={handleDrawerOpen} onMouseOut={handleDrawerClose}>
            <CssBaseline />
            <AppBar
              position="fixed"
              className={clsx(classes.appBar, {
                [classes.appBarShift]: open,
              })}
            >
              <Grid container>
              <Card className={classes.logoWrapper}>
                    <CardMedia
                      className={classes.logo}
                      component="img"
                      image={logoSource}
                      title={adminMenuLogoName}
                    />
              </Card>
              </Grid>

            <Grid item xs={12}>
              <Tabs
                className={classes.tabs}
                variant="scrollable"
                orientation="vertical"
                value={currentTab}
                onChange={handleTabChange}
                aria-label="Admin Tabs"
                indicatorColor='primary'
                >
                <Tab label={open ? "Organizations" : "-"} icon={<FolderIcon className={classes.menuTabIcon}/>} onMouseEnter={handleTabEnter} onMouseLeave={handleTabExit} {...a11yProps(0)} className={classes.menuTab}/>
                <Tab label={open ? "Users" : "-"} icon={<PeopleAltIcon className={classes.menuTabIcon}/>} {...a11yProps(1)} onMouseEnter={handleTabEnter} onMouseLeave={handleTabExit} className={classes.menuTab}/>
                <Tab label={open ? "Symbology" : "-"} {...a11yProps(2)} icon={<PhotoIcon className={classes.menuTabIcon}/>} onMouseEnter={handleTabEnter} onMouseLeave={handleTabExit} className={classes.menuTab}/>
                <Tab label={open ? "Incident Types" : "-"} {...a11yProps(4)} icon={<GpsFixedIcon className={classes.menuTabIcon}/>} onMouseEnter={handleTabEnter} onMouseLeave={handleTabExit} className={classes.menuTab}/>
                {/*
                <Tab label={open ? "Regions" : "-"} {...a11yProps(3)} icon={<PublicIcon className={classes.menuTabIcon}/>} onMouseEnter={handleTabEnter} onMouseLeave={handleTabExit} className={classes.menuTab}/>
                */}
                <Tab label={open ? "Announcements" : "-"} {...a11yProps(3)} icon={<AnnouncementIcon className={classes.menuTabIcon}/>} onMouseEnter={handleTabEnter} onMouseLeave={handleTabExit} className={classes.menuTab}/>
                <Tab label={open ? "Translations" : "-"} {...a11yProps(6)} icon={<AssignmentIcon className={classes.menuTabIcon}/>} onMouseEnter={handleTabEnter} onMouseLeave={handleTabExit} className={classes.menuTab}/>
              </Tabs>

            </Grid>

          </AppBar>
      </Grid>

      <Grid item xs={11} className={classes.content}>
        <Grid container item xs={6}>
                  <FormControl>
                    <InputLabel id="type-select-label">Workspace</InputLabel>
                      <Select
                        className={classes.select}
                        labelId="type-select"
                        placeholder="Workspace"
                        id="type-select"
                        value={userCurrentWorkspace?.workspaceid || ''}
                        onChange={handleChangeWorkspace}
                        input={<Input />}
                      >
                        {userWorkspaces.map((workspace) => (
                          <MenuItem key={workspace.workspaceid} value={workspace.workspaceid}>
                            {workspace.workspacename}
                          </MenuItem>
                        ))}
                      </Select>
                  </FormControl>
          </Grid>
        <Grid container item xs={6}>
        <Fab aria-label="profile" variant="extended" className={classes.profileButton} >
          <Button
            className={classes.profileButtonLink}
              component={LinkBehavior}
              to="/profile"
              startIcon={<PersonIcon />}
              >
            {loggedInUserName}
          </Button>
        </Fab>
        </Grid>
        <TabPanel value={currentTab} index={0} >
          <div className={classes.root}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography gutterBottom variant="h4" className={classes.header}>
                  Organizations
                </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Grid container className={classes.searchSort}>
                        <Grid item xs={12} className={classes.searchBar}>
                            <Input
                                id="input-with-icon-adornment"
                                className={classes.search}
                                placeholder = "search for an organization..."
                                value={filter}
                                onChange={ (e) => setFilter(e.target.value) }
                                startAdornment={
                                    <InputAdornment position="start">
                                    <SearchIcon className={classes.searchIcon} />
                                    </InputAdornment>
                                }/>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs={12}>
                    <Organizations
                    filter={filter}
                    currentWorkspaceId={userCurrentWorkspace.workspaceid}
                    currentUser={loggedInUserObj}
                    isAddNewModalOpen={isAddNewOrgOpen}
                    setIsAddNewModalOpen={setIsAddNewOrgOpen}
                    isModalOpen={orgDetailsOpen}
                    setIsModalOpen={handleOrgDetailsOpen}
                    selectedOrg={selectedOrg}
                    setSelectedOrg={setSelectedOrg}
                    />
                </Grid>
              <Grid item xs={2}>
              </Grid>
              <Modal
                open={orgDetailsOpen}
                onClose={handleOrgDetailsClose}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                {detailsPanel}
            </Modal>

            <Modal
                  open={isAddNewOrgOpen}
                  onClose={handleAddNewOrgClose}
                  aria-labelledby="simple-modal-title"
                  aria-describedby="simple-modal-description"
                  >
                  {addOrganizationPanel}
                </Modal>
            </Grid>
          </div>
        </TabPanel>
        <TabPanel value={currentTab} index={1}>
          <div className={classes.root}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography gutterBottom variant="h4" className={classes.header}>
                      Users
                    </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container className={classes.searchSort}>
                            <Grid item xs={12} className={classes.searchBar}>
                                <Input
                                    id="input-with-icon-adornment"
                                    className={classes.search}
                                    placeholder = "search users..."
                                    value={filter}
                                    onChange={ (e) => setFilter(e.target.value) }
                                    startAdornment={
                                        <InputAdornment position="start">
                                        <SearchIcon className={classes.searchIcon} />
                                        </InputAdornment>
                                    }/>
                            </Grid>
                          </Grid>
                    </Grid>

                    <Grid item xs={12}>
                      <GlobalUsers currentWorkspaceId={userCurrentWorkspace.workspaceid} filter={filter} isModalOpen={globalUserDetailsOpen} setIsModalOpen={setGlobalUserDetailsOpen}/>
                    </Grid>
                </Grid>
              </div>
        </TabPanel>
        <TabPanel value={currentTab} index={2} >
          <div className={classes.root}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography gutterBottom variant="h4" className={classes.header}>
                  Symbology
                </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Grid container className={classes.searchSort}>
                        <Grid item xs={12} className={classes.searchBar}>
                            <Input
                                id="input-with-icon-adornment"
                                className={classes.search}
                                placeholder = "search symbology..."
                                value={filter}
                                onChange={ (e) => setFilter(e.target.value) }
                                startAdornment={
                                    <InputAdornment position="start">
                                    <SearchIcon className={classes.searchIcon} />
                                    </InputAdornment>
                                }/>
                        </Grid>
                        <Modal
                          open={symbologyOpen}
                          onClose={handleSymbologyClose}
                          aria-labelledby="simple-modal-title"
                          aria-describedby="simple-modal-description"
                          >
                          {symbologyPanel}
                        </Modal>
                    </Grid>
                </Grid>

                <Grid item xs={12}>
                  <Symbology filter={filter} isModalOpen={symbologyOpen} setIsModalOpen={setSymbologyOpen} addNewSymbologyModalOpen={addNewSymbologyModalOpen} setAddNewSymbologyModalOpen={setAddNewSymbologyModalOpen} setSelectedSymbology={setSelectedSymbology} selectedSymbology={selectedSymbology} symbologyListing={selectedSymbologyListing} setSymbologyListing={setSelectedSymbologyListing}></Symbology>
                </Grid>
                <Modal
                  open={addNewSymbologyModalOpen}
                  onClose={handleAddNewSymbologyClose}
                  aria-labelledby="simple-modal-title"
                  aria-describedby="simple-modal-description"
                  >
                  {addSymbologyPanel}
                </Modal>
            </Grid>
          </div>
          </TabPanel>
        <TabPanel value={currentTab} index={3}>
        <div className={classes.root}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography gutterBottom variant="h4" className={classes.header}>
                      Incident Types
                    </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container className={classes.searchSort}>
                            <Grid item xs={12} className={classes.searchBar}>
                                <Input
                                    id="input-with-icon-adornment"
                                    className={classes.search}
                                    placeholder = "search incident types..."
                                    value={filter}
                                    onChange={ (e) => setFilter(e.target.value) }
                                    startAdornment={
                                        <InputAdornment position="start">
                                        <SearchIcon className={classes.searchIcon} />
                                        </InputAdornment>
                                    }/>
                            </Grid>
                          </Grid>
                    </Grid>

                    <Grid item xs={12}>
                      <IncidentTypes currentWorkspaceId={userCurrentWorkspace.workspaceid} filter={filter} isModalOpen={incidentTypeOpen} setIsModalOpen={setIncidentTypeOpen}  setSelectedIncidentType={setSelectedIncidentType}></IncidentTypes>
                    </Grid>
                    <Modal
                      open={incidentTypeOpen}
                      onClose={handleIncidentTypeClose}
                      aria-labelledby="simple-modal-title"
                      aria-describedby="simple-modal-description"
                      >
                      {incidentTypePanel}
                    </Modal>
                </Grid>
              </div>
        </TabPanel>
        {/*
        <TabPanel value={currentTab} index={10}>
          <div className={classes.root}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography gutterBottom variant="h4" className={classes.header}>
                  Regions
                </Typography>
                </Grid>
                <Grid item xs={12}>
                  <RegionsList isModalOpen={regionOpen} setIsModalOpen={setRegionOpen} addNewRegionModalOpen={addNewRegionModalOpen} setAddNewRegionModalOpen={setAddNewRegionModalOpen} setSelectedRegion={setSelectedRegion} selectedRegion={selectedRegion} RegionListing={selectedRegionList} setRegionListing={setSelectedRegionList}></RegionsList>
                </Grid>
                <Modal
                  open={addNewRegionModalOpen}
                  onClose={handleAddNewRegionModalClose}
                  aria-labelledby="simple-modal-title"
                  aria-describedby="simple-modal-description"
                  >
                  {addRegionPanel}
                </Modal>
              </Grid>
            </div>
        </TabPanel>
        */}
        <TabPanel value={currentTab} index={4}>
          <AnnouncementList />
        </TabPanel>
        <TabPanel value={currentTab} index={5}>
            <div className={classes.root}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Typography gutterBottom variant="h4" className={classes.header}>
                            Translations
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Translations
                            selectedLang={undefined}
                            isModalOpen={false}
                            setIsModalOpen={handleOrgDetailsOpen}
                            setSelectedLang={setSelectedLang}
                        />
                    </Grid>
                </Grid>
            </div>
        </TabPanel>
      </Grid>
    </Grid>
    </div>
  );
}
