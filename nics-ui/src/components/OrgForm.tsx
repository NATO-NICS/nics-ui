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
import React, { useEffect} from "react";

import { Button, Grid } from "@material-ui/core";
import { AllOrgTypesModel, OrganizationModel } from "../models";
import TextField from "@material-ui/core/TextField";
import Switch from "@material-ui/core/Switch";
import {
  getOrgTypes,
  updateOrg,
} from "../services/api";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      margin: theme.spacing(1),
    },
    root: {
      fontFamily: 'Open Sans',
      textTransform: 'lowercase',
      alignItems: 'center',
      justifyContent: 'center',
      
      "& > *": {
        margin: theme.spacing(1),
        
      }
    },
    header : {
      fontFamily: "Abel",
      textTransform: 'uppercase'
    },
    body : {
      fontFamily: 'Open Sans',
      textTransform: 'lowercase',
    },
    gridRow : {
      width: '100%'
    },
    typeList: {
      width: '90%'
    }
  })
);

type OrgFormProps = {
  currentWorkspaceId: number, 
  selectedOrg?: OrganizationModel;
  setSelectedOrg?: (value: OrganizationModel) => void;

  org?: OrganizationModel;
  setOrg?: (value: OrganizationModel) => void;
};

export default function OrgForm(props: OrgFormProps) {
  const classes = useStyles();
  const [orgTypes, setOrgTypes] = React.useState<AllOrgTypesModel>();
  const [orgTypeStringList, setOrgTypeStringList] = React.useState("");

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (props?.setOrg != undefined && props?.org != undefined) {
      props?.setOrg({
        ...props?.org,
        [event.target.name]: event.target.checked,
      } as OrganizationModel);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (props?.setOrg !== undefined && props?.org !== undefined) {
      let temp = { ...props?.org, [event.target.id]: event.target.value };
      props?.setOrg(temp as OrganizationModel);
    }
  };

  useEffect(() => {
    if (props?.setOrg !== undefined && props?.selectedOrg !== undefined) {
      props?.setOrg({...props?.selectedOrg});


    }
  }, [props?.selectedOrg]);

  useEffect(() => {
    getOrgTypeListAsString();
  }, [orgTypes]);

  
  useEffect(() => {
    getOrgTypeListAsString();
  }, [props?.org]);



  useEffect(() => {
    let mounted = true;
    getOrgTypes(props.currentWorkspaceId).then((items) => {
      if (mounted) {
        setOrgTypes(items);
      }
    });
    return () => {
      mounted = false;
    };
  }, [props?.selectedOrg, props.currentWorkspaceId]);


  function postOrg() {
    if (props?.org !== undefined && props?.org.id) {
      let buffer: OrganizationModel = Object.assign({}, props?.org);
      delete buffer.id;
      updateOrg(buffer);
    }

  }

  function getOrgTypeNameById(orgTypeId: number) {
    let foundOrgName = "";
    orgTypes?.orgTypes.map((orgType) => {
      if (orgType.orgTypeId == orgTypeId) {
        foundOrgName = orgType.orgTypeName;
      }
    })
    return foundOrgName;
  }

  function getOrgTypeListAsString() {

    let orgTypesString = "";
    props?.org?.orgTypes.map((orgType) => {
      orgTypesString += getOrgTypeNameById(orgType.orgtypeid) + ", ";
    })
    setOrgTypeStringList(orgTypesString);
  };

  return (
    <div>
        <form className={classes.root} noValidate autoComplete="off" >
          <Grid container className={classes.gridRow}>
              <Grid item xs={3}>
                <TextField
                  id="countryId"
                  label="Country"
                  value={props?.org?.countryId}
                  InputLabelProps={{ shrink: true }}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  id="state"
                  label="State"
                  value={props?.org?.state}
                  InputLabelProps={{ shrink: true }}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  id="county"
                  label="County"
                  value={props?.org?.county}
                  InputLabelProps={{ shrink: true }}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  label="Default Language"
                  defaultValue={props?.selectedOrg?.defaultlanguage}
                  value={props?.selectedOrg?.defaultlanguage}
                  onChange={handleChange}
                />  
              </Grid>
              
              
            </Grid>
            <Grid container className={classes.gridRow}>
              <Grid item xs={3}>
                <TextField
                  id="defaultlatitude"
                  label="Latitude"
                  value={props?.org?.defaultlatitude}
                  InputLabelProps={{ shrink: true }}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  id="defaultlongitude"
                  label="Longitude"
                  value={props?.org?.defaultlongitude}
                  InputLabelProps={{ shrink: true }}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={3}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={props?.org?.restrictincidents}
                      onChange={handleSwitchChange}
                      name="restrictincidents"

                    />
                  }
                  label="Restrict Incidents"
              />
              </Grid>
              <Grid item xs={3}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={props?.org?.createincidentrequiresadmin}
                      onChange={handleSwitchChange}
                      name="createincidentrequiresadmin"
                    />
                  }
                  label="Require Admin"
                />
              </Grid>
            </Grid>
            <Grid container className={classes.gridRow}>
              <Grid item xs={12} className={classes.gridRow}>
                <TextField
                  id="standard-helperText"
                  label="Org Type(s)"
                  value={orgTypeStringList}
                  className={classes.typeList}

                />
              </Grid>
            </Grid>
          <Button
            variant="contained"
            color="primary"
            size="small"
            className={classes.button}
            onClick={() => postOrg()}
          >
            Save
          </Button>
          </form>              
    </div>
  );
}
