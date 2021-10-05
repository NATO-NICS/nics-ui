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
import React, { useEffect } from "react";

import { Button } from "@material-ui/core";
import {
  SymbolModel,
} from "../models";
import {
  Grid,
  Paper,
  Typography,
} from "@material-ui/core";
import {
  getOrgSymbology,
  addActiveSymbology,
  addInactiveSymbology,
} from "../services/api";

import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

const API_IMG_URL = "https://dev3.hadrsys.info/upload/symbology";


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
  orgId: number;
  allSymbologies: SymbolModel[];
  setAllSymbologies?: (value: SymbolModel[]) => void;
  activeSymbology: SymbolModel[];
  setActiveSymbology: (value: SymbolModel[]) => void;
  inactiveSymbology: SymbolModel[];
  setInactiveSymbology: (value: SymbolModel[]) => void;

};

function notSymbology(a: SymbolModel[], b: SymbolModel[]) {
  //return a.filter((value) => b.indexOf(value) === -1);

  var result = a.filter(function(symbologySet1: SymbolModel){
    // filter out (!) items in result2
    return !b.some(function(symbologySet2: SymbolModel){
        return symbologySet1.symbologyid === symbologySet2.symbologyid;          
    });
  });
  return a.filter(symbologySet1 => !b.some(symbologySet2 => symbologySet1.symbologyid === symbologySet2.symbologyid));
}

function intersectionSymbology(a: SymbolModel[], b: SymbolModel[]) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

function symbolExistsInSet(symbolSet: SymbolModel[], symbol: SymbolModel) {
  return symbolSet.some(function(el) {
    return el.symbologyid === symbol.symbologyid;
  }); 
}

export default function OrgSymbologyDetails(props: IncidentTypeProps) {
  const [selectedSymbology, setSelectedSymbology] = React.useState<SymbolModel[]>([]);
  const classes = useStyles();

  useEffect(() => {
    let mounted = true;
  
    getOrgSymbology(props.orgId).then((items) => {
      if (mounted && props?.allSymbologies && items.symbologies != null) {
        props.setActiveSymbology(items.symbologies);
        props.setInactiveSymbology(notSymbology(props?.allSymbologies, items.symbologies));
      }
      else if (mounted && props?.allSymbologies && items.symbologies == null) {
        props.setInactiveSymbology(props?.allSymbologies)
        props.setActiveSymbology([]);
      }
    });
    return () => {
      mounted = false;
    };
  }, [props?.orgId]);
  
  function postActive() {
    if (props?.orgId && selectedSymbology) {
      addActiveSymbology(props?.orgId, selectedSymbology[0].symbologyid);
    }
  }

  function postInactive() {
    if (props?.orgId  && selectedSymbology) {
      addInactiveSymbology(props?.orgId, selectedSymbology[0].symbologyid);
    }
  }

  const handleSymbolToggle = (value: SymbolModel) => () => {
    const currentIndex = selectedSymbology.indexOf(value);
    
    const newSelected : any = [];

    if (currentIndex === -1) {
      newSelected.push(value);
    } else {
      newSelected.splice(currentIndex, 1);
    }

    setSelectedSymbology(newSelected);
  };

  //POST to API
  const handleSelectedInactiveSymbology = () => {
    props.setInactiveSymbology(props.inactiveSymbology.concat(selectedSymbology));
    postInactive();
    props.setActiveSymbology(notSymbology(props.activeSymbology, selectedSymbology));

  };

  const handleSelectedActiveSymbology = () => {
    props.setActiveSymbology(props.activeSymbology.concat(selectedSymbology));
    postActive();
    props.setInactiveSymbology(notSymbology(props.inactiveSymbology, selectedSymbology));
  };


  function customSymbologyList(items: SymbolModel[], status: boolean) {
    if (status) {
      return (
        <Paper>
          <List dense component="div" role="list">
            {items != null && items.map((value: SymbolModel) => {
              const labelId = `transfer-list-item-${value.name}-label`;

              return (
                <ListItem
                  key={value.name}
                  role="listitem"
                  button
                  onClick={handleSymbolToggle(value)}
                  selected={symbolExistsInSet(selectedSymbology, value)}
                  classes={{ selected: classes.selected }}
                >
                  <Grid container>
                    <Grid item xs={1}>
                    </Grid>
                    <Grid item xs={11}>
                      <ListItemText
                      id={labelId}
                      primary={`${value.name}`}
                    />
                    </Grid>
                  </Grid>
                  
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
            {items.map((value: SymbolModel) => {
              const labelId = `transfer-list-item-${value.name}-label`;

              return (
                <ListItem
                  key={value.name}
                  role="listitem"
                  button
                  onClick={handleSymbolToggle(value)}
                  selected={symbolExistsInSet(selectedSymbology, value)}
                  classes={{ selected: classes.selected }}
                >
                  <ListItemText
                    id={labelId}
                    primary={`${value.name}`}
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
          Active Symbology Sets
        </Typography>
        <div style={{ height: 550, width: "100%" }}>
          {customSymbologyList(props.activeSymbology, true)}
        </div>
      </Grid>
      <Grid item xs={2}>
        <Grid container spacing={1} direction="column" alignItems="center">
          <Button
            variant="outlined"
            size="small"
            className={classes.button}
            onClick={handleSelectedInactiveSymbology}
            disabled={selectedSymbology == null}
            aria-label="move selected inactive"
          >
            &gt;
          </Button>
          <Button
            variant="outlined"
            size="small"
            className={classes.button}
            onClick={handleSelectedActiveSymbology}
            disabled={selectedSymbology == null}
            aria-label="move selected active"
          >
            &lt;
          </Button>
        </Grid>
      </Grid>
      <Grid item xs={5}>
        <Typography gutterBottom variant="h5" className={classes.header}>
          Inactive Symbology Sets
        </Typography>
        <div style={{ height: 550, width: "100%" }}>
          {customSymbologyList(props.inactiveSymbology, false)}
        </div>
      </Grid>
    </Grid>
  );
}
