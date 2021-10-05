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
  Pagination,
} from "@material-ui/data-grid";
import { getSymbology } from "../services/api";
import { SymbolListModel, SymbolModel } from "../models";
import { createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import AddBoxIcon from '@material-ui/icons/AddBox';
import { Box, Grid, Typography } from "@material-ui/core";
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
      
      
    },
    footerText : {
      color: '#707070 !important',
      ontFamily: 'Open Sans',
      textTransform: 'lowercase'
      
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
  
  }
  })
);


export interface SymbologyListProps {
  name: string;
  owner: string;
  created: Date;
}

type SymbologyProps = {
  filter?: string,
  isModalOpen?: boolean,
  setIsModalOpen?: (value: boolean) => void;
  addNewSymbologyModalOpen : boolean,
  setAddNewSymbologyModalOpen: (value: boolean) => void;
  selectedSymbology?: SymbolModel,
  setSelectedSymbology?: (value: SymbolModel) => void;
  setSymbologyListing?: (value: SymbolListModel) => void;
  symbologyListing?: SymbolListModel;
};



export default function Symbology(props: SymbologyProps) {
  const classes = useStyles();
  const [list, setList] = useState<SymbolModel[]>([]);
  const [grid, setGrid] = useState<RowsProp>([]);
  const [loading, setLoading] = useState<boolean>(false);

  //for DataGrid
  function CustomFooter() {  
    function handleAddNewMenuOpen() {
      props.setAddNewSymbologyModalOpen(true);
    }
  
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
  
  const columns: ColDef[] = [
    { field: "name", headerName: "Name", flex: 2 },
    { field: "owner", headerName: "Uploaded By", flex: 2 },
    { field: "created", headerName: "Created On", flex: 1 },
  ];

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getSymbology().then((items) => {
      if (mounted) {
        setList(items.symbologies);
      }
    }).finally(() => setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let datagrid = list.map((item) => ({ ...item, id: item.symbologyid }));
    if (props.filter !== undefined) {
      var containsRegex = new RegExp( props.filter, "i");
      datagrid = datagrid.filter((item) => 
        containsRegex.test(item.name) || containsRegex.test(item.owner));
    }
    setGrid(datagrid);
  }, [list, props.filter]);

  function callback(row: any) {
    let symbology: SymbolModel = row.data;
    let symbologyListing: SymbolListModel = JSON.parse(symbology.listing);
    props.setIsModalOpen && props.setIsModalOpen(true);
    props.setSelectedSymbology && props.setSelectedSymbology(symbology);
    props.setSymbologyListing && props.setSymbologyListing(symbologyListing);
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
          Footer: CustomFooter,
          LoadingOverlay: LoadingOverlay
        }}      
      />
    </div>
  );
}






