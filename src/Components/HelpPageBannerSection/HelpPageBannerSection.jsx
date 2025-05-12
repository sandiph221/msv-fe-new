import {
  Container,
  Grid,
  Typography,
  withStyles,
  TextField,
  InputAdornment,
} from '@mui/material';

import * as constant from '../../utils/constant';
import SearchIcon from '@mui/icons-material/Search';

/* styled component starts */
const StyledTextField = withStyles({
  root: {
    color: '#000',
    marginTop: constant.SUPER_ADMIN_NAME ? 0 : 20,
    marginBottom: constant.SUPER_ADMIN_NAME ? 0 : 20,
    width: constant.SUPER_ADMIN_NAME ? '100%' : 520,
    height: 65,
    '& .MuiOutlinedInput-root': {
      '& input': {
        zIndex: 999,
      },
      '& fieldset': {
        borderRadius: 12,
        backgroundColor: (props) =>
          props.backgroundcolor ? '#fff' : 'transparent',
      },
    },
  },
})(TextField);

export const HelpPageBannerSection = ({
  searchQuery,
  handleKeyPress,
  handleSearch,
}) => {
  return (
    <Container
      maxWidth='xl'
      id='help-banner-section'
      disableGutters
    >
      <Container>
        <Grid>
          <Grid
            item
            md={6}
          >
            <div style={{ alignSelf: 'center' }}>
              <Typography
                style={{
                  marginBottom: 10,
                  fontSize: 40,
                  fontWeight: 700,
                  color: '#fff',
                }}
              >
                How can we help you?
              </Typography>
              <Typography
                style={{
                  fontSize: 17,
                  color: '#fff',
                  marginBottom: 20,
                }}
              >
                Find more solutions on help
              </Typography>
              <StyledTextField
                backgroundcolor='true'
                width={constant.SUPER_ADMIN_NAME}
                hinttext='Search by Name'
                variant='outlined'
                value={searchQuery}
                placeholder='Describe your issue'
                onChange={handleSearch}
                onKeyPress={(event) =>
                  event.key === 'Enter' &&
                  event.target.value !== '' &&
                  handleKeyPress
                    ? handleKeyPress(event)
                    : null
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <SearchIcon style={{ color: '#323132', zIndex: 9999 }} />
                    </InputAdornment>
                  ),
                }}
              />
            </div>
          </Grid>
        </Grid>
      </Container>
    </Container>
  );
};
