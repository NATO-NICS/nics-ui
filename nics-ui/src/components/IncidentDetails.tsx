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
} from "@material-ui/data-grid";
import { ActiveIncidentModel, ArchivedIncidentModel } from "../models";
import {
  Grid,
  Typography,
} from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
    header : {
      fontFamily: "Abel",
      textTransform: 'uppercase'
    },
    body : {
      fontFamily: 'Open Sans',
      textTransform: 'lowercase',
    },
  })
);
type IncidentProps = {
  activeIncidents?: ActiveIncidentModel[];
  setActiveIncidents?: (value: ActiveIncidentModel[]) => void;

  archivedIncidents?: ArchivedIncidentModel[];
  setArchivedIncidents?: (value: ArchivedIncidentModel[]) => void;
};
export default function IncidentDetails(props: IncidentProps) {
  const classes = useStyles();
  const [activeGrid, setActiveGrid] = useState<RowsProp>([]);
  const [archivedGrid, setArchivedGrid] = useState<RowsProp>([]);

  const activeColumns: ColDef[] = [
    { field: "incidentname", headerName: "Name", flex: 2 },
  ];

  const archivedColumns: ColDef[] = [
    { field: "incidentname", headerName: "Name", flex: 2 },
  ];

  useEffect(() => {
    if (props?.activeIncidents != null) {
      let datagrid = props?.activeIncidents.map((item) => ({
        ...item,
        id: item.incidentid,
      }));
      setActiveGrid(datagrid);
    }
  }, [props?.activeIncidents]);

  useEffect(() => {
    if (props?.archivedIncidents != null) {
      let datagrid = props?.archivedIncidents.map((item) => ({
        ...item,
        id: item.incidentid,
      }));
      setArchivedGrid(datagrid);
    }
  }, [props?.archivedIncidents]);
  return (
    <Grid container spacing={1}>
      <Grid item xs={6}>
        <Typography gutterBottom variant="h5" className={classes.header}>
          Active Incidents
        </Typography>
        <div style={{ height: 550, width: "100%" }}>
          <DataGrid rows={activeGrid} columns={activeColumns} pageSize={25} className={classes.table}
/>
        </div>
      </Grid>
      <Grid item xs={6}>
        <Typography gutterBottom variant="h5" className={classes.header}>
          Archived Incidents
        </Typography>
        <div style={{ height: 550, width: "100%" }}>
          <DataGrid
            pagination
            className={classes.table}
            rows={archivedGrid}
            columns={archivedColumns}
            pageSize={25}
          />
        </div>
      </Grid>
    </Grid>
  );
}
