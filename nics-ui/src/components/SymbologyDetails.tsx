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
import React from "react";
import {
  ColDef,

} from "@material-ui/data-grid";
import { FormControlLabel, InputAdornment, Switch } from "@material-ui/core";
import {getSymbologyBySymbologyid } from "../services/api";
import { SymbolModel, SymbolListingModel, SymbolListModel } from "../models";
import TextField from "@material-ui/core/TextField";
import {
  AppBar,
  Box,
  Grid,
  Paper,
  Tab,
  Tabs,
} from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";



const { REACT_APP_API_URL } = process.env;
const API_IMG_URL = "https://dev3.hadrsys.info/upload/symbology";


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


type SymbolProps = {
  created: number,
  description: string, 
  listing: string,
  name: string,
  owner: string,
  symbologyid: number,
  listingObject?: SymbolListModel
}

export default function SymbologyDetails(props: SymbolProps) {
  const [open, setOpen] = React.useState(false);
  const [modal, setModal] = React.useState<SymbolModel>();
  const [currentTab, setCurrentTab] = React.useState(0);
  const [selected, setSelected] = React.useState<SymbolModel[]>([]);
  const classes = useStyles();


  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setModal(undefined);
  };

  function handleTabChange(event: React.ChangeEvent<{}>, newValue: number) {
    setCurrentTab(newValue);
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let temp = { ...modal, [event.target.id]: event.target.value };
    setModal(temp as SymbolModel);
  };

  const handleEditingPermissions = (event: React.ChangeEvent<HTMLInputElement>) => {
    let temp = { ...modal, [event.target.id]: event.target.value };
  };

  const columns: ColDef[] = [
    { field: "username", headerName: "Username", flex: 2 },
  ];

  function callback(row: any) {
    setOpen(true);
    let symbologySet: SymbolModel = row;

    let mounted = true;
    if (symbologySet != null && props?.symbologyid != null) {
      getSymbologyBySymbologyid(symbologySet.symbologyid).then(
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

  const symbolList = (items: any) => (
    <Paper>
      <List dense component="div" role="list">
        {items.map((value: SymbolListingModel) => {
          const labelId = `symbol-list-item-${value.filename}-label`;

          return (
            <ListItem
              key={value.filename}
              role="listitem"
              button
              classes={{ selected: classes.selected}}
            >
              <Grid container>
                <Grid item xs={1}>
                  <img src={API_IMG_URL + "/" +  props?.listingObject?.parentPath + "/" + value.filename}></img>

                </Grid>
                <Grid item xs={11}>
                  <ListItemText id={labelId} primary={`${API_IMG_URL + "/" + props?.listingObject?.parentPath + "/" + value.filename}`} className={classes.body} />

                </Grid>
              </Grid>
            </ListItem>
          );
        })}
      </List>
      
    </Paper>
  );

  return (
    <Grid container spacing={2} alignItems="center" justify="center" className={classes.root}>
      <Grid item xs={12}>
        <AppBar position="static" color="transparent" elevation={0}>
          <Tabs
            centered
            variant="fullWidth"
            value={currentTab}
            onChange={handleTabChange}
            aria-label="Symbology Tabs"
          >
            <Tab label="Details" {...a11yProps(0)} />
            <Tab label="Editing" {...a11yProps(1)} />
            <Tab label="Usage" {...a11yProps(2)} />
            <Tab label="Symbols" {...a11yProps(3)} />
          </Tabs>
        </AppBar>
      </Grid>
      <Grid item xs={12}>
        <TabPanel value={currentTab} index={0}>
          <div>
            <form noValidate autoComplete="off" >
              <Grid container>
                <Grid item xs={3}>
                  <Grid container>
                    <Grid item xs={12}>
                        <TextField
                          id="setName"
                          label="Set Name"
                          fullWidth
                          style={{ marginRight: '20px' }}
                          value={props?.name}
                          InputLabelProps={{ shrink: true }}
                          onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        id="description"
                        label="Description"
                        fullWidth
                        style={{ marginRight: '20px' }}
                        value={props?.description}
                        InputLabelProps={{ shrink: true }}
                        onChange={handleChange}
                      />
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={3}>
                  <Grid container>
                    <Grid item xs={12}>
                        <TextField
                          id="uploadDate"
                          label="Uploaded On"
                          fullWidth
                          style={{ marginLeft: '20px' }}
                          value={props?.created.toString()}
                          InputLabelProps={{ shrink: true }}
                          onChange={handleChange}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          id="uploadedBy"
                          label="Uploaded By"
                          fullWidth
                          style={{ marginLeft: '20px' }}
                          value={props?.owner}
                          InputLabelProps={{ shrink: true }}
                          onChange={handleChange}
                        />
                      </Grid>
                    
                      <Grid item xs={12}>
                        <TextField
                              id="setIcon"
                              label="Set Icon"
                              fullWidth
                              style={{ marginLeft: '20px' }}
                              InputLabelProps={{ shrink: true }}
                              onChange={handleChange}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <img src={API_IMG_URL + "/" +  props?.listingObject?.parentPath + "/" + props?.listingObject?.listing[0].filename}></img>
                                  </InputAdornment>
                                ),
                              }}
                          />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          id="totalSymbols"
                          label="Total Symbols"
                          fullWidth
                          style={{ marginLeft: '20px' }}
                          value={100}
                          InputLabelProps={{ shrink: true }}
                          onChange={handleChange}
                        />
                      </Grid>
                  </Grid>

                </Grid>
                  
              </Grid>
              
              
              
            </form>
          </div>
        </TabPanel>
        <TabPanel value={currentTab} index={1}>
          <div>
            <form noValidate autoComplete="off" >
              <Grid container>
                <Grid item xs={3}>
                  <Grid container>
                    <Grid item xs={12}>
                        <TextField
                          id="lastEditedDate"
                          label="Last Edited On"
                          fullWidth
                          style={{ marginRight: '20px' }}
                          value={props.created}
                          InputLabelProps={{ shrink: true }}
                          onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        id="lastEditedBy"
                        label="Last Edited By"
                        value={"User 1"}
                        fullWidth
                        style={{ marginRight: '20px' }}
                        InputLabelProps={{ shrink: true }}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={true}
                          onChange={handleEditingPermissions}
                          name="enableEditing"
                        />
                      }
                      label="Enable Editing"
                      />

                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={3}>

                </Grid>
                  
              </Grid>
            </form>
          </div>
        </TabPanel>
        <TabPanel value={currentTab} index={2}>
         <div>
            <form noValidate autoComplete="off" >
              <Grid container>
                <Grid item xs={3}>
                  <Grid container>
                    <Grid item xs={12}>
                        <TextField
                          id="orgUsage"
                          label="Total Organization Usage"
                          fullWidth
                          style={{ marginRight: '20px' }}
                          value={10}
                          InputLabelProps={{ shrink: true }}
                          onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        id="lastEditedBy"
                        label="Last Edited By"
                        fullWidth
                        style={{ marginRight: '20px' }}
                        value={"User 1"}
                        InputLabelProps={{ shrink: true }}
                        onChange={handleChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={true}
                            onChange={handleEditingPermissions}
                            name="enableUsage"
                          />
                        }
                        label="Enable Usage"
                        />
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={3}>
                  <Grid container>
                    <Grid item xs={12}>
                        <TextField
                          id="usageList"
                          label="In Use By"
                          fullWidth
                          style={{ marginLeft: '20px' }}
                          value={"Organization 1, Organization 2"}
                          InputLabelProps={{ shrink: true }}
                          onChange={handleChange}
                      />
                    </Grid>  
                  </Grid>
                </Grid>
                  
              </Grid>
            </form>
          </div>
        </TabPanel>
        <TabPanel value={currentTab} index={3}>
          {props?.listingObject?.listing && symbolList(props.listingObject.listing)}
        </TabPanel>
      </Grid>
    </Grid>
  );
}
