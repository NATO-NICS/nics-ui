
import {Grid, makeStyles, Select, TextField, Typography,Box,Modal,Backdrop,Fade, FormControl, MenuItem, InputLabel} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import ClickableBox from "./ClickableBox";
import { getCountries, getRegions,addRegion,addInactiveRegion} from '../services/api';
import { DropdownItem,CountryModel,CountriesModel,RegionsModel,RegionModel,RegionEditPayload} from "../models";
import {
    DataGrid,
    RowSelectedParams,
    keyboardCellSelector,
    ColDef,
    RowsProp
  } from "@material-ui/data-grid";
import AddBoxIcon from '@material-ui/icons/AddBox';
import { isNotEmittedStatement, isTemplateSpan } from "typescript";
import { LoadingOverlay } from "./LoadingOverlay";

function DateReviver(key: string, value: any) {
    if ((key === 'date' || key === 'updated' || key === 'as_of') && typeof value === "string") {
        return new Date(value);
    }
    return value;
}
const emptyDropdownItem: DropdownItem = {id: 1, text: ''};
const useStyles = makeStyles((theme) => ({
    grid_container: {
        display : 'flex',
        alignItems : 'stretch',
        
    },
    root: {
        fontFamily: 'Open Sans',
        textTransform: 'lowercase',
        alignItems: 'center',
        justifyContent: 'center',
        "& > *": {
          margin: theme.spacing(1),

          width: "25ch"

        }
      },
    paper: {
        position: "absolute",
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: "2px solid #000",
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        ontFamily: 'Open Sans',
        textTransform: 'lowercase',
    },
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
    search : {
      width: "100%",
      height: '100%',
      backgroundColor: "white !important",
      fontFamily: 'Open Sans',
      textTransform: 'lowercase'

  },
  searchIcon : {
      paddingBottom: "5px",
      marginLeft : '10px'
  },
  sort: {
      width : '100%',
      textAlign : "center",
      display: 'flex',

      '& .MuiSelect-filled' : {
          backgroundColor: 'white !important',
          alignContent: 'center',
          fontFamily: 'Abel',
          textTransform : 'uppercase',
          fontSize: '2vh'
      },

      '& .MuiSelect-iconOutlined' : {
          backgroundColor: 'transparent !important'
      }

  },
  sortDropdown : {
    width: '78%'
  },
  searchBar : {

  },
  searchSort : {
      width: '78%'
  },
  selectLabel : {
    fontFamily: 'Open Sans',
    textTransform: 'lowercase',
    fontSize: '18px'
  }

}));



//export interface RegionsListProps {

//}

interface gridData {
    id: number,
    key: string,
    value: string

}

export interface RegionProps {
    regionId: number;
    regionName: string;
    regionCode: string;
    countryId: number;
}

type RegionsListProps = {
    isModalOpen?: boolean,
    setIsModalOpen?: (value: boolean) => void;
    addNewRegionModalOpen? : boolean,
    setAddNewRegionModalOpen?: (value: boolean) => void;
    selectedRegion?: RegionModel,
    setSelectedRegion?: (value: RegionModel) => void;
    setRegionListing?: (value: RegionsModel) => void;
    RegionListing?: RegionsModel;
  };


function RegionsList(props: RegionsListProps) {
    const classes = useStyles();
    const [checked, setChecked] = useState(0);
    const [list, setList] = useState<CountryModel[]>([]);
    const [regionList, setRegionList] = useState<RegionModel[]>([]);
    const [grid,setGrid] = useState<RowsProp>([])
    const [addNewModalOpen, setAddNewModalOpen] = useState<boolean>(false);
    const [open, setOpen] = React.useState(false);
    const [modal, setModal] = React.useState<RegionModel>();
    const [loading, setLoading] = useState<boolean>(false);
    
    const handleOpen = () => {
        setOpen(true);
      };

      const handleClose = () => {
        setOpen(false);
        setModal(undefined);
      };

      const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let temp = { ...modal, [event.target.id]: event.target.value };
        setModal(temp as RegionModel);
      };

      const handleEditingPermissions = (event: React.ChangeEvent<HTMLInputElement>) => {
        let temp = { ...modal, [event.target.id]: event.target.value };
      };

    const [selectedCountry, setSelectedCountry] = useState<CountryModel>({
        name: "Afghanistan",
        countryId: 1629,
        countryCode: 'AF'
    });
    const [codeList, setCodeList] = useState<DropdownItem[]>([emptyDropdownItem,]);
    const testRegion =  {countryId: 1629, regionName: "Test Regional Area 2000", regionCode: "TRA300"}

    useEffect(() => {
        const fetchCountries = async () => {
            await getCountries().then((items) => {
                if (items !== null && items.countries !== null) {
                    setList(items.countries);
                }
            });
        };

        fetchCountries();
      }, []);

    const handleCountryChange = (event: any) => {
      let countryCode = event.target.value;
      let country: CountryModel|undefined = list.find( country => country.countryId == countryCode);
      if (country !== undefined) {
        console.log(country);

          setSelectedCountry(country);

      }

    };
    useEffect(() => {
        if(selectedCountry.name !== '') {
            setLoading(true);
            getRegions(selectedCountry.countryId).then((items) => {
                if(items !== null && items.regions !== null) {
                    let regionlist: RegionModel[] = items.regions
                    setRegionList(regionlist)

                }
            }).finally(()=> setLoading(false));
        }

    },[selectedCountry])

    useEffect(() => {
        let datagrid = regionList.map((item) => ({ ...item, id: item.regionId }));
        setGrid(datagrid);
      }, [regionList]);


    function handleAddNewOpen() {
        props.setAddNewRegionModalOpen && props.setAddNewRegionModalOpen(true);
        setAddNewModalOpen(true);
    }

    function handleAddNewClose() {
        props.setAddNewRegionModalOpen && props.setAddNewRegionModalOpen(false);
        setAddNewModalOpen(false);
      }

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
                  id="RegionName"
                  label="Name"
                  value={modal?.regionName}
                  InputLabelProps={{ shrink: true }}
                  onChange={handleChange}
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <TextField
                  id="countryId"
                  label="countryId"
                  value={modal?.countryId}
                  InputLabelProps={{ shrink: true }}
                  onChange={handleChange}
                />
                <TextField
                  id="regionCode"
                  label="Region Code"
                  value={modal?.regionCode}
                  InputLabelProps={{ shrink: true }}
                  onChange={handleChange}
                />

              </form>
            </div>
          </Fade>
        </Modal>
      );

    const columns = [
        { field: "regionName", headerName: "Region Name", flex: 2,editable:true},
        { field: "regionCode", headerName: "Region Code", flex: 2,editable:true},
        { field: "countryId", headerName: "Country ID", flex: 2, editable: true},
        { field: "regionId", headerName: "Region ID", flex: 2}
      ];


    function CustomFooter(props: any) {
        const classes = useStyles();

        return (
          <div >
            <Grid container>
              <Grid item xs={2} container className={classes.footer} onClick={handleAddNewOpen}>
                <Grid item xs={2}>
                  <AddBoxIcon className={classes.footerIcon}></AddBoxIcon>
                </Grid>
                <Grid item xs={10} className={classes.footerText}>
                  <Typography>
                  <Box fontWeight={350}>Add new...</Box>
                  </Typography>
                </Grid>

              </Grid>
              <Grid item className={classes.footerText} >
              </Grid>
            </Grid>
          </div>
        );
    }



    return (
       <Grid container spacing={1}>
          <Grid item xs={12} className={classes.sortDropdown}>
            <Grid container className={classes.searchSort}>
              <Grid item xs={12} className={classes.sortDropdown}>
                <FormControl className={classes.sort} variant="filled">
                  <Select
                  labelId="countrySelect-label"
                  id="countrySelect"
                  value={selectedCountry.countryId}
                  onChange={handleCountryChange}
                  >
                  <MenuItem value="-1" disabled>Select a country...</MenuItem>

                   { list.map( country => {
                           return (
                               <MenuItem value={country.countryId}>{country.name}</MenuItem>
                           )
                       })
                   }
  
                  </Select>
                </FormControl>

              </Grid>
            </Grid>
            </Grid>
            <Grid item xs={12}>
              <div className={classes.tableDiv}>
              <DataGrid
                  className= {classes.table}
                  rows={grid}
                  columns={columns}
                  pageSize={25}
                  loading={loading}
                  components = {{
                      Footer: CustomFooter,
                      LoadingOverlay: LoadingOverlay
                    }}
              />
              </div>
            </Grid>
          </Grid>

           




    );
}

export default RegionsList;
