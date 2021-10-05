import React, { useEffect, useContext, useState } from "react";
import {
  DataGrid,
  ColDef,
  RowsProp,
  RowSelectedParams
} from "@material-ui/data-grid";
import {addIncidentType, getSuperOrgs} from "../services/api";
import {
  LanguageTranslationEntry,
  LanguageTranslationModel,
  LanguageTranslationResponse,
  LanguageTranslationUpdateRequest, SingleOrgTypeModel
} from "../models";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import {Box, Button, Grid, Typography, Select, FormControl, InputLabel, Input, Chip, MenuItem} from "@material-ui/core";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import AddBoxIcon from '@material-ui/icons/AddBox';
import { CustomFooter, CustomLoadingOverlay } from "./CustomDatagridComponents";

import ApiContext from "../context/APIContext";
import TextField from "@material-ui/core/TextField";

import ClearIcon from '@material-ui/icons/Clear';
import SearchIcon from '@material-ui/icons/Search';




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
    searchBar : {

    },
    searchSort : {
      width: '78%'
    },
    textField: {
      [theme.breakpoints.down('xs')]: {
        width: '100%',
      },
      margin: theme.spacing(1, 0.5, 1.5),
      '& .MuiSvgIcon-root': {
        marginRight: theme.spacing(0.5),
      },
      '& .MuiInput-underline:before': {
        borderBottom: `1px solid ${theme.palette.divider}`,
      },
    },
    select : {
      width: '170px'
    }
  })
);

interface pageState {
    selectedLang: string;
}

const emptyState = {
    selectedLang: ''
}

export interface TranslationListProps {
  code: string;
  name: string;
  prefix: string;
}

type TranslationProps = {
  selectedLang?: LanguageTranslationModel;
  setSelectedLang?: (value: LanguageTranslationModel) => void;
  isModalOpen?: boolean,
  setIsModalOpen?: (value: boolean) => void;
};

function escapeRegExp(value: string) {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

export default function Translations(props: TranslationProps) {
  const classes = useStyles();
  const api = useContext(ApiContext);

  const [values, setValues] = React.useState<pageState>(emptyState);
  const [langs, setLangs] = useState<LanguageTranslationModel[]>();
  const [lang, setLang] = useState<LanguageTranslationModel>();
  const [grid, setGrid] = useState<RowsProp>([]);
  const [gridfull, setGridfull] = useState<RowsProp>([]);
  const [modal, setModal] = useState<LanguageTranslationEntry>();
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [update, setUpdate] = React.useState<LanguageTranslationUpdateRequest>();

    const columns = [
      { field: 'key', headerName: 'English Key', flex: 2},
      { field: 'value', headerName: 'Translation', flex: 2}
    ];

  useEffect(() => {
    const fetchData = async () => {
        let res: LanguageTranslationResponse = await api.fetchLanguageTranslationCodes();
        if (res.translations !== undefined) {
            setLangs(res.translations);
        }
    };

    fetchData();
  }, [setLangs]);

  function handleLanguageChange(event: any) {
    console.log(event);
    console.log(event.target);
    let code: string = event.target.value;
    if (code.length > 0) {
      setValues({ ...values, ['selectedLang']: code });
    }
  }

  useEffect( () => {
    const postData = async () => {
      if (update !== undefined) {
        let res = await api.updateTranslationKey(update.code, JSON.stringify(update));
        if (res && res.message && res.message.toLowerCase() !== 'success') {
          throw new Error(`Unable to update Translation key/value! ${res.message}`);
        }

        handleClose();
      }
    };

    postData();
  }, [update, setUpdate]);

  useEffect(() => {
    if (langs !== undefined) {
      let l: LanguageTranslationModel | undefined = langs.find(x => x.code === values.selectedLang);
      if (l !== undefined) {
        setLang(l);
        if (l.translations !== undefined) {
            let count = 1;
            let translationsJSON: { [key: string]: string; } = JSON.parse(l.translations);
            let datagrid = Object.keys(translationsJSON).sort().map((k: string, i: number) => ({ key: k, value: translationsJSON[k], id: count++ }));
            setGrid(datagrid);
            setGridfull(datagrid);
        }
      }
    }
  }, [values, setGrid, setGridfull])

  const onSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let searchValue: string = event.target.value;
    if (searchValue === undefined) {
      return;
    }
    clearSearch();

    if (searchValue.length > 0) {
      setSearch(searchValue);
      const searchRegex = new RegExp(escapeRegExp(searchValue), 'i');
      const filteredRows = grid.filter((row) => {
        return Object.keys(row).some((field) => {
          return searchRegex.test(row[field].toString());
        });
      });
      setGrid(filteredRows);
    }
  };

  const clearSearch = () => {
    setSearch('');
    setGrid(gridfull);
  };

  const handleModalChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      let temp = { ...modal, [event.target.id]: event.target.value };
      setModal(temp as LanguageTranslationEntry);
  };

    // modal edit window
    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
      setUpdate(undefined);
      setOpen(false);
      setModal(undefined);
    };

    function updateTranslation() {
        if (modal !== undefined && lang !== undefined) {
            let req: LanguageTranslationUpdateRequest = {
              code: lang.code,
              key: modal.key,
              value: modal.value
            };
            console.log(req);
            setUpdate(req);
        }
    }

  function callback(row: RowSelectedParams) {
    if (row.data && row.data.key && row.data.value) {
      let data: LanguageTranslationEntry = {
        id: row.data.id ? row.data.id : 1,  // set an id > 0 so the key is not editable
        key: row.data.key,
        value: row.data.value
      }
      setModal(data);
      handleOpen();
    }
  }

  const addNew = () => {
    let data: LanguageTranslationEntry = {
      id: -1,
      key: '',
      value: ''
    }
    setModal(data);
    handleOpen();
  }

  return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <FormControl>
            <InputLabel id="type-select-label">Language</InputLabel>
            <Select
              className={classes.select}
              labelId="type-select"
              id="language-select"
              value={values.selectedLang}
              onChange={handleLanguageChange}
              input={<Input />}
            >
              {langs !== undefined && langs.map((l) => (
                <MenuItem key={l.code} value={l.code}>
                  {l.language}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={3}>
            {/* search bar */}
            <Grid item xs={10} className={classes.searchBar}>
              <TextField
                variant="standard"
                value={search}
                onChange={onSearchChange}
                placeholder="search…"
                className={classes.textField}
                InputProps={{
                  startAdornment: <SearchIcon fontSize="small" />,
                  endAdornment: (
                      <ClearIcon fontSize="small"
                                 style={{ visibility: search ? 'visible' : 'hidden' }}
                                 onClick={clearSearch}
                      />
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <div className={classes.tableDiv}>
                <DataGrid
                  className= {classes.table}
                  pagination
                  loading
                  rows={grid}
                  columns={columns}
                  autoPageSize
                  onRowSelected={(row: RowSelectedParams) => callback(row)}
                  components={{
                    Footer: CustomFooter,
                    LoadingOverlay: CustomLoadingOverlay
                  }}
                  componentsProps={{
                    footer: {addCallback : addNew}
                  }}
                />
              </div>
            </Grid>

            <Grid item xs={12}>
              <Modal
                open={open}
                onClose={handleClose}
                className={classes.modal}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
              >
                <Fade in={open}>
                  <div className={classes.paper}>
                    <form className={classes.root} noValidate autoComplete="off">
                      <TextField
                        id="key"
                        label="English Key"
                        value={modal?.key}
                        InputLabelProps={{ shrink: true }}
                        onChange={handleModalChange}
                        InputProps={{
                          readOnly: (modal?.id !== undefined && modal?.id > 0) ? true : false,
                        }}
                      />
                      <TextField
                        id="value"
                        label="Translation"
                        value={modal?.value}
                        InputLabelProps={{ shrink: true }}
                        onChange={handleModalChange}
                      />
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        className={classes.button}
                        onClick={() => updateTranslation()}
                      >
                        Save
                      </Button>
                    </form>
                  </div>
                </Fade>
              </Modal>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
  );
}
