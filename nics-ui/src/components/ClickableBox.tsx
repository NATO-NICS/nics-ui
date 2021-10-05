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
import React, { useEffect, ReactNode } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import grey from '@material-ui/core/colors/grey';
import Box from '@material-ui/core/Box';


const useStyles = makeStyles((theme) => ({
    boxDefault: {
        border: '1px solid',
        borderColor: grey[200],
        backgroundColor: grey[50],
        padding: theme.spacing(1),
        margin: theme.spacing(1),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        width: '100%'
    },
    boxClicked: {
        border: '1px solid',
        borderColor: '#d75c37',
        backgroundColor: '#efbdaf', // alternate dark to light:'#e38c73' '#e79d87' #ebad9b #efbdaf
        padding: theme.spacing(1),
        margin: theme.spacing(1),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        width: '100%'
    }
}));

export interface ClickableBoxProps {
    checked: boolean,

    onClick: Function,

    children?: (ReactNode | ReactNode[])
}

function ClickableBox(props: ClickableBoxProps) {
    const classes = useStyles();

    useEffect(() => {
        props.checked && props.onClick();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.checked]);

    function onClick() {
        props.onClick();
    }

    return (
        <React.Fragment>
            <Box className={props.checked? classes.boxClicked: classes.boxDefault} onClick={onClick}>
                {props.children}
            </Box>
        </React.Fragment>
    );
}

export default ClickableBox;