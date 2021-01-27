import React,{useState} from 'react'
import PropTypes from 'prop-types';
import Table from '@material-ui/core/Table';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import Checkbox from '@material-ui/core/Checkbox';
import clsx from 'clsx';
import DeleteIcon from '@material-ui/icons/Delete';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import TableSortLabel from '@material-ui/core/TableSortLabel';

export default function useTable(records,setRecords,headcells) {

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [selected, setSelected] = useState([]);
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');

    //When row (item) is clicked this function will fire and update the selected list
    const handleClick = (event, id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];
    
        if (selectedIndex === -1) {
          newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
          newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
          newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
          newSelected = newSelected.concat(
            selected.slice(0, selectedIndex),
            selected.slice(selectedIndex + 1),
          );
        }
        setSelected(newSelected);
    };

    //Functions For Sorting
    function descendingComparator(a, b, orderBy) {
      if (b[orderBy] < a[orderBy]) {
        return -1;
      }
      if (b[orderBy] > a[orderBy]) {
        return 1;
      }
      return 0;
    }
    function getComparator(order, orderBy) {
      return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
    }
    
    function stableSort(array, comparator) {
      const stabilizedThis = array.map((el, index) => [el, index]);
      stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
      });
      return stabilizedThis.map((el) => el[0]);
    }
    

    //ToolBar

    const useToolbarStyles = makeStyles((theme) => ({
      root: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(1),
      },
      highlight:
        theme.palette.type === 'light'
          ? {
              color: theme.palette.secondary.main,
              backgroundColor: lighten(theme.palette.secondary.light, 0.85),
            }
          : {
              color: theme.palette.text.primary,
              backgroundColor: theme.palette.secondary.dark,
            },
      title: {
        flex: '1 1 100%',
      },
    }));

    const AppToolbar = ({name}) => {
      const classes = useToolbarStyles();
      const deleteItem=e=>{
        setRecords(itms=>itms.filter(itm=> selected.indexOf(itm.id) == -1 && itm))
        setSelected([])
      }
      return (
        <Toolbar
          className={clsx(classes.root, {
            [classes.highlight]: selected.length > 0,
          })}
        >
          {selected.length > 0 ? (
            <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
              {selected.length} selected
            </Typography>
          ) : (
            <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
              {name}
            </Typography>
          )}
    
          {selected.length > 0 && (
            <Tooltip title="Delete">
              <IconButton aria-label="delete" onClick={deleteItem}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          )}
        </Toolbar>
      );
    };
    
    AppToolbar.propTypes = {
      name: PropTypes.string.isRequired,
    };
    

    //Table Header
    
    const useHeaderStyles = makeStyles((theme) => ({
      visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1,
      }
    }));

    const TblHeader=()=>{

      const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
      };

      const handleSelectAllClick = (event) => {
        if (event.target.checked) {
          const newSelecteds = records.map(({id}) => id);
          setSelected(newSelecteds);
          return;
        }
        setSelected([]);
      };

      const classes = useHeaderStyles();

      const createSortHandler = (property) => (event) => {
        handleRequestSort(event, property);
      };
      return(
      <TableHead>
        <TableRow>         
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={selected.length > 0 && selected.length < records.length}
            checked={records.length > 0 && selected.length === records.length}
            onChange={handleSelectAllClick}
            inputProps={{ 'aria-label': 'select all desserts' }}
          />
        </TableCell>

          {headcells.map((headCell) => (
            <TableCell
              key={headCell.id}
              align={headCell.numeric ? 'right' : 'left'}
              padding={headCell.disablePadding ? 'none' : 'default'}
              sortDirection={orderBy === headCell.id ? order : false}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <span className={classes.visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </span>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}

        </TableRow>
      </TableHead>)
    }



    //Table Container
    const TblContainer=(props)=>(
        <TableContainer component="div" >
             <Table aria-label="simple table">
                {props.children}
             </Table>
        </TableContainer>
    )

    //Pagination
    const Pagination=()=>{
      const handleChangePage = (event, newPage) => {
          setPage(newPage);
      };
      const handleChangeRowsPerPage = (event) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0);
      };

      return(
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={records.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
      )
    }
    

    const rowsAfterPaginationAndSorting=()=>{
        return stableSort(records, getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    }
    return {
        TblContainer,
        TblHeader,
        Pagination,
        rowsAfterPaginationAndSorting,
        selected,
        handleClick,
        AppToolbar
    }
}
