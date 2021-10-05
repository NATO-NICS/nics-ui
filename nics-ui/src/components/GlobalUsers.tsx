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
  RowSelectedParams
} from "@material-ui/data-grid";
import { createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import { GlobalUserModel, SingleContactTypeModel } from "../models";
import { getAdminUsers, getAllContactTypes, getUserContacts, getUserContactsOrgDetails } from "../services/api";
import GlobalUserDetails from "./GlobalUserDetails";
import { Box } from "@material-ui/core";
import { LoadingOverlay } from "./LoadingOverlay";

declare module 'react' {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    // extends React's HTMLAttributes
    custom?: string;
  }
}


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root : {},
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
      marginRight: '10px',
      paddingBottom: '2px'
      
      
      
    },
    footerText : {
      color: '#707070 !important',
      ontFamily: 'Open Sans',
      textTransform: 'lowercase',
      display: "flex", 
      alignItems: "center" 
      
    },
    modal : {
      height: '75vh',
      width: '75%',
      margin: 'auto',
      marginTop: '100px',
      overflowY: 'scroll'
  },
  pagination : {
    marginLeft: '10%',
    opacity: '85%'

  },
  addNew : {
  },
  footerContainer : {
    
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


export interface SymbologyListProps {
  name: string;
  owner: string;
  created: Date;
}

type UsersProps = {
    currentWorkspaceId: number,
    filter?: string,
    isModalOpen: boolean,
    setIsModalOpen: (value: boolean) => void;
  
};



export default function GlobalUsers(props: UsersProps) {
  const classes = useStyles();
  const [list, setList] = useState<GlobalUserModel[]>([]);
  const [grid, setGrid] = useState<RowsProp>([]);
  const [selectedUser, setSelectedUser] = useState<GlobalUserModel>();
  const [loading, setLoading] = useState<boolean>(false);

    const columns: ColDef[] = [
    { field: "firstname", headerName: "First Name", flex: 2 },
    { field: "lastname", headerName: "Last Name", flex: 2 },
    { field: "username", headerName: "Email", flex: 2 },
    {field: "cellphone", headerName: "Mobile", flex : 2}
  ];


  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getAdminUsers(props.currentWorkspaceId).then((items) => {
      if (mounted) {
        setList(items.adminUsers);    
      }
    }).finally(() => setLoading(false));;
    return () => {
      mounted = false;
    };
  }, [props.currentWorkspaceId]);

  useEffect(() => {
    let datagrid = list.map((item) => ({ ...item, id: item.userid }));
    if (props.filter !== undefined) {
      var containsRegex = new RegExp( props.filter, "i");
      datagrid = datagrid.filter((item) => 
        containsRegex.test(item.firstname) || containsRegex.test(item.lastname) || containsRegex.test(item.username));
    }
    setGrid(datagrid);
  }, [list, props.filter]);


  function callback(row: any) {
    let user: GlobalUserModel = row.data;
    setSelectedUser(user);
    props.setIsModalOpen && props.setIsModalOpen(true);
  }

  return (
    <div className={classes.tableDiv}>
      <DataGrid
        className= {classes.table}
        rows={grid}
        columns={columns}
        autoPageSize
        pagination
        onRowSelected={(row: RowSelectedParams) => callback(row)}
        loading={loading}
        components={{
          LoadingOverlay: LoadingOverlay
        }}
      />
      {selectedUser && <GlobalUserDetails currentWorkspaceId={props.currentWorkspaceId} isModalOpen={props?.isModalOpen} setIsModalOpen={props?.setIsModalOpen} selectedUser={selectedUser} setSelectedUser={setSelectedUser}  orgsList={selectedUser.userorgs}></GlobalUserDetails>}
    </div>
  );
}