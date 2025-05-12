import { Box, Container, Grid, makeStyles } from '@mui/material';
import { useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../../Components/Layout';
import PageTitle from '../../Components/PageTitle/PageTitle';
import SocialButton from '../../Components/SocialButton';
import Spinner from '../../Components/Spinner';
import { getPagesInfo } from '../../store/actions/SuperAdminDashboardAction';
import DashboardTable from '../Components/DashboardTable/DashboardTable';
import { Styles } from './Styles';

const useStyles = makeStyles((theme) => Styles(theme));

const AdminDashboardPage = () => {
  const dispatch = useDispatch();
  const { activeSocialMediaType } = useSelector(
    (state) => state.socialMediaProfileListReducer
  );
  const { pagesInfoLoading, pagesInfo } = useSelector(
    (state) => state.adminDashboardReducer
  );

  useEffect(() => {
    // fetch profiles list info
    dispatch(getPagesInfo());
  }, [activeSocialMediaType]);

  const handlePageChange = (pageNumber) => {
    dispatch(getPagesInfo(pageNumber));
  };

  const classes = useStyles();

  return (
    <Layout>
      <div className={classes.main}>
        <div
          style={{ padding: 10 }}
          className='dashboardPageContainer'
        >
          <Container
            disableGutters
            maxWidth='xl'
          >
            <Box className={classes.topFilter}>
              <Grid
                container
                spacing={2}
                justifyContent='space-between'
              >
                <Grid item>
                  <SocialButton />
                </Grid>
                <Grid
                  item
                  style={{ display: 'flex' }}
                >
                  {/* <FilterDays

                /> */}
                </Grid>
              </Grid>
            </Box>
            <PageTitle />
            <Grid container>
              {pagesInfoLoading ? (
                <Spinner />
              ) : (
                <DashboardTable
                  data={pagesInfo.responseData ? pagesInfo.responseData : []}
                />
              )}
            </Grid>
            {!pagesInfoLoading &&
              pagesInfo.responseData &&
              pagesInfo.responseData.length !== 0 && (
                <div className='PaginationSection'>
                  <ReactPaginate
                    previousLabel={` < Previous`}
                    nextLabel={'Next >'}
                    breakLabel={'...'}
                    breakClassName={'PaginationLi'}
                    pageCount={Math.ceil(pagesInfo.pages)}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={(e) => handlePageChange(e.selected + 1)}
                    containerClassName={'pagination'}
                    subContainerClassName={'pages pagination'}
                    activeClassName={'activePaginate'}
                    forcePage={Math.ceil(pagesInfo.page - 1)}
                  />
                </div>
              )}
          </Container>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboardPage;
