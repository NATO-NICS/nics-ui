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

import { Box, createStyles, Grid, LinearProgress, makeStyles, Theme, Typography } from "@material-ui/core";
import { GridOverlay, Pagination } from "@material-ui/data-grid";
import React, { useEffect, useState } from "react";
import AddBoxIcon from '@material-ui/icons/AddBox';



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


export function CustomFooter(props: any)
  {
    const classes = useStyles();

  function handleAddNewMenuOpen() {
    // TODO?
  }

  return (
       <Grid container className={classes.footerContainer}>
          <Grid item xs={12} container className={classes.footer}>
            <Grid item xs={4} container className={classes.footerText}
            direction="row"
            alignItems="center"
            justify="flex-start"
            >
              <AddBoxIcon className={classes.footerIcon}></AddBoxIcon>
              <Typography>
              <Box fontWeight={350} onClick={props.addCallback? props.addCallback : handleAddNewMenuOpen}>Add new...</Box>
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

export function CustomLoadingOverlay() {
  return (
    <GridOverlay>
      <div style={{ position: 'absolute', top: 0, width: '100%' }}>
        <LinearProgress />
      </div>
    </GridOverlay>
  );
}
