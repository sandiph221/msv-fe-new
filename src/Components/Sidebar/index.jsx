
import {
  TextField,
  Avatar,
  makeStyles,
  Typography,
  Button,
  List,
  ListItem,
  InputAdornment,
  withStyles,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useDispatch, useSelector } from 'react-redux';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import Cards from '../Cards';
import Buttons from '../Buttons/Buttons';
import {
  GetCustomer,
  PaginateCustomer,
  SearchCustomer,
} from '../../store/actions/CustomersAction';
import Spinner from '../Spinner';
import Styles from './Styles';
import Alert from '../AlertBox/Alert';
import { DeleteCustomer } from '../../store/actions/CustomersAction';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const useStyles = makeStyles((theme) => Styles(theme));

const StyledTextField = withStyles({
  root: {
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderRadius: 12,
      },
    },
    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#E0E0E0',
    },
  },
})(TextField);

const Sidebar = ({
  getSelectedData,
  addUserData,
  match,
  resetForm,
  editData,
  errors,
  validationErrors,
  userFormSubmiting,
  responseMessage,
  handleCancle,
}) => {
  const theme = useTheme();
  const xs = useMediaQuery(theme.breakpoints.down('xs'));

  const [page, setPage] = React.useState(1);
  // const [open, setOpen] = React.useState(false);
  const [newMatch, setNewMatch] = React.useState(false);
  const [searchPage, setSearchPage] = React.useState(1);
  const [searchMore, setSearchMore] = React.useState(false);
  const [load, setLoad] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const dispatch = useDispatch();
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [itemToDelete, setItemToDelete] = React.useState(null);

  const { customers, getCustomersLoading } = useSelector(
    (state) => state.customerInfo
  );
  async function fetchCustomers() {
    await dispatch(GetCustomer());
    // setPage(1)
  }

  async function fetchNewCustomers(page) {
    await dispatch(PaginateCustomer(page));
  }

  async function fetchSearchCustomers(page, search) {
    await dispatch(SearchCustomer(page, search));
  }

  function handleDeleteConfirm(item) {
    setItemToDelete(item);
    setConfirmOpen(true);
  }

  const handleDelete = async () => {
    if (itemToDelete) {
      await dispatch(DeleteCustomer(itemToDelete.id));
      resetForm();
      editData({});
      errors({});
      validationErrors({});
    }
  };

  React.useEffect(() => {
    fetchCustomers();
  }, []);

  React.useEffect(() => {
    if (responseMessage) {
      fetchSearchCustomers(page, search);
    }
  }, [responseMessage]);

  React.useEffect(() => {
    if (load) {
      fetchNewCustomers(page);
      setLoad(false);
    }
  }, [page, load]);

  React.useEffect(() => {
    if (searchMore) {
      fetchNewCustomers(searchPage);
      setSearchMore(false);
    }
  }, [searchPage, searchMore]);

  React.useEffect(() => {
    if (match) {
      setNewMatch(true);
    } else {
      setNewMatch(false);
    }
  }, [match]);

  React.useEffect(() => {
    if (userFormSubmiting) {
      setPage(1);
    }
  }, [userFormSubmiting]);

  const classes = useStyles({ xs });

  const handleSearchChange = (event) => {
    if (event) {
      setSearch(event.target.value);
    }
  };

  React.useEffect(() => {
    if (search) {
      fetchSearchCustomers(searchPage, search);
    } else {
      fetchCustomers(page);
    }
  }, [search]);

  return (
    <React.Fragment>
      <div
        className={classes.sidebar}
        style={{}}
        anchor='left'
        variant='permanent'
      >
        <div className={classes.asideTop}>
          <div className={classes.userContainer}>
            <Typography className={classes.userType}>
              <strong>User Management</strong>
            </Typography>
            <Buttons
              size='small'
              className={classes.iconButtonContainer}
              color='inherit'
              onClick={addUserData}
              variant='outlined'
            >
              <PersonAddIcon size='small' />
              {/* {!newMatch && openDrawer && ( */}
              <Typography className={classes.navTextStyle}>Add User</Typography>
              {/* )} */}
            </Buttons>
          </div>
          <StyledTextField
            fullWidth
            className={classes.textField}
            hintText='Search by Name'
            variant='outlined'
            placeholder='Search'
            value={search}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <SearchIcon style={{ color: '#323132' }} />
                </InputAdornment>
              ),
              // endAdornment: (
              //   <InputAdornment position="start">
              //     <CloseIcon
              //       onClick={() => {setSearch(""); handleCancle()}}
              //       style={{
              //         color: "#323132",
              //         height: 18,
              //         width: 18,
              //         cursor: "pointer",
              //       }}
              //     />
              //   </InputAdornment>
              // ),
            }}
            // onChange={(event) => {
            //   setSearch(event.target.value);
            //   setSearchPage(1);
            //   if (event.target.value) {
            //     setTimeout(
            //       () => fetchSearchCustomers(searchPage, search),
            //       1000
            //     );
            //   } else {
            //     setTimeout(() => fetchCustomers(page), 1000);
            //   }
            // }}
            onChange={handleSearchChange}
          />
        </div>
        <List className={classes.asideBottom}>
          {getCustomersLoading && (
            <Spinner className={classes.loadingContent} />
          )}
          {customers && customers.users && customers.users.length > 0 ? (
            customers.users.map(
              (item, index) => (
                <ListItem key={index}>
                  <Cards
                    handleDeleteConfirm={handleDeleteConfirm}
                    item={item}
                    getSelectedData={(item) => getSelectedData(item)}
                  />
                </ListItem>
              )
              // )
            )
          ) : (
            <Typography align='center'>No Users Found!</Typography>
          )}

          <ListItem>
            {getCustomersLoading && <div className={classes.userItem}></div>}
          </ListItem>

          {!newMatch && (
            <ListItem>
              {customers &&
                customers.users &&
                customers.users.length > 0 &&
                (customers.users.length === customers.totalUsers
                  ? (load || searchMore) && (
                      <Typography>You have reached till end</Typography>
                    )
                  : customers &&
                    customers.users.length >= 5 &&
                    (search ? (
                      <Buttons
                        className={classes.loadBtn}
                        variant='outlined'
                        onClick={() => {
                          setSearchPage(searchPage + 1);
                          setSearchMore(true);
                        }}
                      >
                        Load More{' '}
                        <RotateLeftIcon className={classes.loadBtnIcon} />
                      </Buttons>
                    ) : (
                      <Buttons
                        className={classes.loadBtn}
                        onClick={() => {
                          setPage(page + 1);
                          setLoad(true);
                        }}
                      >
                        Load More{' '}
                        <RotateLeftIcon className={classes.loadBtnIcon} />
                      </Buttons>
                    )))}
            </ListItem>
          )}
        </List>
      </div>
      {handleDeleteConfirm === true}
      {
        <Alert
          alert={itemToDelete}
          icon={<ErrorOutlineIcon className={classes.alertIcon} />}
          title='Are you sure?'
          confirmBtn='DELETE'
          description="You're about to Delete the user. This process cannot be undone."
          open={confirmOpen}
          setOpen={setConfirmOpen}
          onConfirm={handleDelete}
          buttonbgcolor='#f50057'
        />
      }
    </React.Fragment>
  );
};

export default Sidebar;
