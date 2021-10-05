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
  RowSelectedParams,
  Pagination
} from "@material-ui/data-grid";
import { checkIfSuper, getAdminOrgs, getSuperOrgs } from "../services/api";
import { OrganizationModel, SearchedUserModel, UserModel } from "../models";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import AddBoxIcon from '@material-ui/icons/AddBox';
import { Box, Grid, Typography } from "@material-ui/core";
import { LoadingOverlay } from "./LoadingOverlay";



const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    table: {
      backgroundColor: "white",
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
    tableDiv : {
      height: 550,
      marginLeft: '1%',
      width: "75%"
    },
    footer : {
      margin: '10px 10px 10px 20px',
      color: "#bf3e32 !important",
      '&:hover':{        
        cursor: 'pointer',
        "& $footerIcon": {
        },
        "& $footerText": {
          color: '#bf3e32 !important',
        }
        
      }
      
    },
    footerIcon : {
      color: '#bf3e32 !important',
      
    },
    footerText : {
      color: '#707070 !important',
      
      
    },
    pagination : {
      marginLeft: '10%',
      opacity: '85%'
    
    }
  })
);

export interface OrgsListProps {
  orgId: number;
  name: string;
  county: string;
  prefix: string;
}

type OrgProps = {
  filter?: string,
  currentWorkspaceId: number;
  currentUser: SearchedUserModel;
  selectedOrg?: OrganizationModel;
  setSelectedOrg?: (value: OrganizationModel) => void;
  isModalOpen?: boolean,
  setIsModalOpen?: (value: boolean) => void;
  isAddNewModalOpen?: boolean;
  setIsAddNewModalOpen?: (value : boolean) => void;
};

export default function Organizations(props: OrgProps) {
  const classes = useStyles();
  const [list, setList] = useState<OrganizationModel[]>([]);
  const [grid, setGrid] = useState<RowsProp>([]);
  const [isSuperUser, setIsSuperUser] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  
  const columns: ColDef[] = [
    { field: "name", headerName: "Name", flex: 2 },
    { field: "county", headerName: "Country", flex: 2 },
    { field: "prefix", headerName: "Prefix", flex: 1 },
  ];


  //for DataGrid
  function CustomFooter() {  
    
  
    return (
        <Grid container>
          <Grid item xs={12} container className={classes.footer}>
            <Grid item xs={4} container className={classes.footerText}
            direction="row"
            alignItems="center"
            justify="flex-start"
            >
              <AddBoxIcon className={classes.footerIcon}></AddBoxIcon>
              <Typography>
              <Box fontWeight={350} onClick={handleAddNewMenuOpen}>Add new...</Box>
              </Typography>
            </Grid>
            
            <Grid item xs={6} container
              direction="row"
              alignItems="center"
              justify="flex-end"
              className={classes.pagination}>
              <Pagination />
            </Grid>
          </Grid>
         
          
        </Grid>
    );
  }

  //API returns true if logged in user is super
  useEffect(() => {
    setLoading(true);
    checkIfSuper(props.currentWorkspaceId).then(response => {

      if (response) {
        setIsSuperUser(true);
      }
      else {
      setIsSuperUser(false);
      }
    }).finally(() => setLoading(false));
  }, [props?.currentUser, props.currentWorkspaceId]); 

  useEffect(() => {
    let mounted = true;

    if (isSuperUser) {
      setLoading(true);
      getSuperOrgs(props.currentWorkspaceId).then((items) => {
        if (mounted) {
          setList(items.organizations);
        }
      }).finally(() => setLoading(false));
    }
    else {
      if (props?.currentUser.userId != undefined) {
        setLoading(true);
        getAdminOrgs(props.currentWorkspaceId, props?.currentUser.userId).then((items) => {
          if (mounted) {
            setList(items.organizations);
          }
        }).finally(() => setLoading(false));
      }
     
    
      }
    return () => {
      mounted = false;
    };
  }, [isSuperUser, props.currentUser, props.currentWorkspaceId]);

  useEffect(() => {
    let datagrid = list.map((item) => ({ ...item, id: item.orgId }));
    if (props.filter !== undefined) {
      var containsRegex = new RegExp( props.filter, "i");
      datagrid = datagrid.filter((item) => 
        containsRegex.test(item.name) || containsRegex.test(item.county) || containsRegex.test(item.prefix));
    }
    setGrid(datagrid);
  }, [list, props.filter]);

  function callback(row: any) {
    let org: OrganizationModel = row.data;
    props.setSelectedOrg && props.setSelectedOrg(org);
    props.setIsModalOpen && props.setIsModalOpen(true);
    
  }

  function handleAddNewMenuOpen() {
    props.setIsAddNewModalOpen && props.setIsAddNewModalOpen(true);
  }

  return (
    <div className={classes.tableDiv}>
      <DataGrid
        className= {classes.table}
        pagination
        rows={grid}
        columns={columns}
        autoPageSize
        onRowSelected={(row: RowSelectedParams) => callback(row)}
        loading={loading}
        components={{
          Footer: CustomFooter,
          LoadingOverlay: LoadingOverlay
        }}
      />
    </div>
  );
}
