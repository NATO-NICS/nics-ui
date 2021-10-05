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
import { getAllIncidentTypes } from "../services/api";
import { IncidentTypeModel, OrganizationModel } from "../models";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { CustomFooter } from "./CustomDatagridComponents";
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
      
      
    }
  })
);

export interface OrgsListProps {
  orgId: number;
  name: string;
  county: string;
  prefix: string;
}

type IncidentTypesProps = {
    currentWorkspaceId: number,
    filter?: string,
    isModalOpen?: boolean,
    setIsModalOpen?: (value: boolean) => void;
    setSelectedIncidentType: (value: IncidentTypeModel) => void;
};

export default function IncidentTypes(props: IncidentTypesProps) {
  const classes = useStyles();
  const [list, setList] = useState<IncidentTypeModel[]>([]);
  const [grid, setGrid] = useState<RowsProp>([]);
  const [loading, setLoading] = useState<boolean>(false);


  
  const columns: ColDef[] = [
    { field: "incidentTypeName", headerName: "Name", flex: 2 },
  ];

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getAllIncidentTypes(props.currentWorkspaceId).then((items) => {
      if (mounted) {
        setList(items.incidentTypes);
      }
    }).finally(() => setLoading(false));
    return () => {
      mounted = false;
    };
  }, [props.currentWorkspaceId]);

  useEffect(() => {
    let datagrid = list.map((item) => ({ ...item, id: item.incidentTypeId }));
    if (props.filter !== undefined) {
      var containsRegex = new RegExp( props.filter, "i");
      datagrid = datagrid.filter((item) => 
        containsRegex.test(item.incidentTypeName));
    }
    setGrid(datagrid);
  }, [list, props.filter]);

  function callback(row: any) {
    let incidentType: IncidentTypeModel = row.data;    
    props.setIsModalOpen && props.setIsModalOpen(true);
    props.setSelectedIncidentType(incidentType);

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
