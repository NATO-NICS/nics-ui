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
  ColDef,
  RowsProp,
  ValueGetterParams,
} from "@material-ui/data-grid";
import { Button } from "@material-ui/core";
import {
  ActiveIncidentTypeModel,
  InactiveIncidentTypeModel,
  IncidentTypePayload,
  IncidentTypeNumber,
  IncidentTypeEditPayload,
  IncidentTypeDefaultPayload,
} from "../models";
import TextField from "@material-ui/core/TextField";
import {
  Grid,
  Paper,
  Typography,
} from "@material-ui/core";
import {
  addIncidentType,
  addActive,
  addInactive,
  changeDefault,
  editIncidentType,
} from "../services/api";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";

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
    },
    root: {
      "& > *": {
        margin: theme.spacing(1),
        width: "25ch",
      },
      margin: "auto",
    },
    button: {
      margin: theme.spacing(1),
    },
    selected: {
      backgroundColor: "blue",
    },
    header : {
      fontFamily: "Abel",
      textTransform: 'uppercase'
    },
    body : {
      fontFamily: 'Open Sans',
      textTransform: 'lowercase',
    },
    addIncidentButton : {
      position: 'absolute'
    }
  })
);

type IncidentTypeProps = {
  currentWorkspaceId: number, 
  activeIncidentTypes?: ActiveIncidentTypeModel[];
  setActiveIncidentTypes?: (value: ActiveIncidentTypeModel[]) => void;

  inactiveIncidentTypes?: InactiveIncidentTypeModel[];
  setInactiveIncidentTypes?: (value: InactiveIncidentTypeModel[]) => void;

  orgId?: number;
};

function getIncidentTypeName(params: ValueGetterParams) {
  return params.row.incidenttype?.incidentTypeName || String("");
}

function not(a: IncidentTypeNumber[], b: IncidentTypeNumber[]) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a: IncidentTypeNumber[], b: IncidentTypeNumber[]) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

export default function IncidentTypeOrgDetails(props: IncidentTypeProps) {
  const [checked, setChecked] = React.useState<IncidentTypeNumber[]>([]);
  const [selected, setSelected] = React.useState<IncidentTypeNumber[]>([]);

  const [active, setActive] = React.useState<IncidentTypeNumber[]>([]);
  const [inactive, setInactive] = React.useState<IncidentTypeNumber[]>([]);

  const activeSelected = intersection(selected, active);
  const inactiveSelected = intersection(selected, inactive);

  const [activeGrid, setActiveGrid] = useState<RowsProp>([]);
  const [inactiveGrid, setInactiveGrid] = useState<RowsProp>([]);
  const [open, setOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [modal, setModal] = React.useState<IncidentTypePayload>();
  const [editModal, setEditModal] = React.useState<IncidentTypeEditPayload>();
  const classes = useStyles();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let temp = { ...modal, [event.target.id]: event.target.value };
    setModal(temp as IncidentTypePayload);
  };

  const handleEditChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let temp = { ...editModal, [event.target.id]: event.target.value };
    setEditModal(temp as IncidentTypeEditPayload);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleEditOpen = () => {
    setEditOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setModal(undefined);
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setEditModal(undefined);
  };

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
              id="incidentTypeName"
              label="Incident Type Name"
              value={modal?.incidentTypeName}
              InputLabelProps={{ shrink: true }}
              onChange={handleChange}
            />
            <Button
              variant="contained"
              color="primary"
              size="small"
              className={classes.button}
              onClick={() => postIncidentType()}
            >
              Save
            </Button>
          </form>
        </div>
      </Fade>
    </Modal>
  );
  function editCallback(row: any) {
    setEditOpen(true);

    let incidenttype: IncidentTypeNumber = row;

    if (incidenttype != null && props?.orgId != null) {
      setEditModal(incidenttype as IncidentTypeEditPayload);
    }
  }
  var editSection = (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={classes.modal}
      open={editOpen}
      onClose={handleEditClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={editOpen}>
        <div className={classes.paper}>
          <form className={classes.root} noValidate autoComplete="off">
            <TextField
              id="incidentTypeName"
              label="Incident Type Name"
              value={editModal?.incidentTypeName}
              InputLabelProps={{ shrink: true }}
              onChange={handleEditChange}
            />
            <Button
              variant="contained"
              color="primary"
              size="small"
              className={classes.button}
              onClick={() => editIncident()}
            >
              Save
            </Button>
          </form>
        </div>
      </Fade>
    </Modal>
  );
  function postIncidentType() {
    if (modal !== undefined) {
      let buffer: IncidentTypePayload = Object.assign({}, modal);

      addIncidentType(props.currentWorkspaceId, buffer);
      setOpen(false);
    }
  }

  function editIncident() {
    if (editModal !== undefined) {
      let buffer: IncidentTypeNumber = Object.assign({}, editModal);
      delete buffer.defaulttype;
      delete buffer.orgIncidenttypeid;

      editIncidentType(props.currentWorkspaceId, buffer);
      setEditOpen(false);
    }
  }
  function callback(row: IncidentTypeNumber, defaulttype: boolean) {
    const currentIndex = checked.indexOf(row);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(row);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);

    let incidenttype: IncidentTypeDefaultPayload = {
      defaulttype: defaulttype,
      orgIncidenttypeid: row.orgIncidenttypeid || 0,
    };

    if (incidenttype != null && props?.orgId != null) {
      changeDefault(props.currentWorkspaceId, incidenttype, incidenttype.orgIncidenttypeid);
    }
  }

  const activeColumns: ColDef[] = [
    {
      field: "incidenttype",
      headerName: "Name",
      flex: 2,
      valueGetter: getIncidentTypeName,
    },
  ];

  const inactiveColumns: ColDef[] = [
    { field: "incidentTypeName", headerName: "Name", flex: 2 },
  ];

  useEffect(() => {
    if (props?.activeIncidentTypes != null) {
      let datagrid = props?.activeIncidentTypes.reduce<IncidentTypeNumber[]>(
        (arr, curr) => [
          ...arr,
          {
            incidentTypeName:
              String(curr.incidenttype?.incidentTypeName) || String(""),
            incidentTypeId: curr.incidenttype?.incidentTypeId,
            orgIncidenttypeid: curr.orgIncidenttypeid,
            defaulttype: curr.defaulttype,
          },
        ],
        []
      );
      setActive(datagrid);

      setChecked(datagrid.filter((curr) => curr.defaulttype));
    }
  }, [props?.activeIncidentTypes]);

  useEffect(() => {
    if (props?.inactiveIncidentTypes != null) {
      let datagrid = props?.inactiveIncidentTypes.reduce<IncidentTypeNumber[]>(
        (arr, curr) => [
          ...arr,
          {
            incidentTypeName: curr.incidentTypeName || String(""),
            incidentTypeId: curr.incidentTypeId,
            defaulttype: curr.defaulttype,
          },
        ],
        []
      );
      setInactive(datagrid);
    }
  }, [props?.inactiveIncidentTypes]);

  function postActive(data: number[]) {
    if (props?.orgId != null) {
      addActive(props.currentWorkspaceId, data, props?.orgId);
    }
  }

  function postInactive(data: number[]) {
    if (props?.orgId != null) {
      addInactive(props.currentWorkspaceId, data, props?.orgId);
    }
  }

  const handleToggle = (value: IncidentTypeNumber) => () => {
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
    postInactive(active.map((curr) => curr.incidentTypeId));
    setActive([]);
  };

  const handleSelectedInactive = () => {
    setInactive(inactive.concat(activeSelected));
    postInactive(activeSelected.map((curr) => curr.incidentTypeId));
    setActive(not(active, activeSelected));
    setSelected(not(selected, activeSelected));
  };

  const handleSelectedActive = () => {
    setActive(active.concat(inactiveSelected));
    postActive(inactiveSelected.map((curr) => curr.incidentTypeId));
    setInactive(not(inactive, inactiveSelected));
    setChecked(not(selected, inactiveSelected));
  };

  const handleAllActive = () => {
    setActive(active.concat(inactive));
    postActive(inactive.map((curr) => curr.incidentTypeId));
    setInactive([]);
  };

  function customList(items: IncidentTypeNumber[], status: boolean) {
    if (status) {
      return (
        <Paper>
          <List dense component="div" role="list">
            {items.map((value: IncidentTypeNumber) => {
              const labelId = `transfer-list-item-${value.incidentTypeId}-label`;

              return (
                <ListItem
                  key={value.incidentTypeId}
                  role="listitem"
                  button
                  onClick={handleToggle(value)}
                  onDoubleClick={() => editCallback(value)}
                  selected={selected.indexOf(value) !== -1}
                  classes={{ selected: classes.selected }}
                >
                  <ListItemText
                    id={labelId}
                    primary={`${value.incidentTypeName}`}
                  />
                </ListItem>
              );
            })}
            <ListItem />
          </List>
        </Paper>
      );
    } else {
      return (
        <Paper>
          <List dense component="div" role="list">
            {items.map((value: IncidentTypeNumber) => {
              const labelId = `transfer-list-item-${value.incidentTypeId}-label`;

              return (
                <ListItem
                  key={value.incidentTypeId}
                  role="listitem"
                  button
                  onClick={handleToggle(value)}
                  onDoubleClick={() => editCallback(value)}
                  selected={selected.indexOf(value) !== -1}
                  classes={{ selected: classes.selected }}
                >
                  <ListItemText
                    id={labelId}
                    primary={`${value.incidentTypeName}`}
                  />
                </ListItem>
              );
            })}
            <ListItem />
          </List>
        </Paper>
      );
    }
  }

  return (
    <Grid container spacing={1}>
      <Grid item xs={5}>
        <Typography gutterBottom variant="h5" className={classes.header}>
          Active Incident Types
        </Typography>
        <div style={{ height: 550, width: "100%" }}>
          {customList(active, true)}
        </div>
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
          <Button variant="contained" onClick={handleOpen}>
        Add Incident Type
      </Button>

        </Grid>
      </Grid>
      <Grid item xs={5}>
        <Typography gutterBottom variant="h5" className={classes.header}>
          Inactive Incident Types
        </Typography>
        <div style={{ height: 550, width: "100%" }}>
          {customList(inactive, false)}
        </div>
      </Grid>
      <div>{section}</div>
      <div>{editSection}</div>
    </Grid>
  );
}
