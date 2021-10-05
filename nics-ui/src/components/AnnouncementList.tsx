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
import { Grid, makeStyles, TextField, Typography } from "@material-ui/core";
import React, {useState } from "react";
import ClickableBox from "./ClickableBox";

function DateReviver(key: string, value: any) {
  if (
    (key === "date" || key === "updated" || key === "as_of") &&
    typeof value === "string"
  ) {
    return new Date(value);
  }
  return value;
}

const useStyles = makeStyles((theme) => ({
  grid_container: {
    display: "flex",
    alignItems: "stretch",
  },
}));

export interface AnnouncementListProps {}

function AnnouncementList(props: AnnouncementListProps) {
  const classes = useStyles();
  const [checked, setChecked] = useState(0);

  return (
    <Grid container spacing={1} className={classes.grid_container}>
      <Grid item xs={12}>
        <ClickableBox
          checked={checked === 1}
          onClick={() => {
            setChecked(1);
          }}
        >
          <div>
            <Typography variant="subtitle1" align="center">
              Announcement Component
            </Typography>
          </div>
        </ClickableBox>
      </Grid>
    </Grid>
  );
}

export default AnnouncementList;
