import { Box, Button, Container, Typography, useTheme } from "@mui/material";

import { useMediaQuery } from "@mui/material";
import { formatImage } from "utils/functions.js";
import { useSelector } from "react-redux";

const Feed = ({ data, getFeed, page }) => {
  const theme = useTheme();
  const xs = useMediaQuery(theme.breakpoints.down("xs"));

  const { activeSocialMediaType } = useSelector(
    (state) => state.socialMediaProfileListReducer
  );
  const { user } = useSelector((state) => state.auth);
  const { CustomerSubdomain } = user;

  let subdomain = CustomerSubdomain.subdomain;

  return (
    <Container
      maxWidth="xl"
      style={{
        marginBottom: "5%",
        padding: xs ? "0px 20px" : "0px 42px",
        display: "flex",
        flexDirection: "column",
        alignItems: "start",
      }}
      disableGutters={true}
    >
      <Typography
        style={{
          fontSize: 22,
          letterSpacing: 0,
          fontWeight: 600,
          marginBottom: 17,
        }}
      >
        Posts
      </Typography>
      <Box
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "start",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        {data?.map((item) => (
          <div
            key={item._id}
            style={{ flexGrow: 0, flexBasis: "calc(10% - 10px)" }}
          >
            <a href={item?.feed_link} target="_blank" rel="noopener noreferrer">
              {item?.feed_type === "Video" ? (
                <video
                  style={{
                    objectFit: "cover",
                    minWidth: "150px",
                    width: "150px",
                    height: "200px",
                    margin: "10px 10px 10px 0",
                    borderRadius: "6px",
                  }}
                >
                  <source
                    src={formatImage(
                      activeSocialMediaType,
                      subdomain,
                      item?.attachment
                    )}
                    type="video/mp4"
                  ></source>
                  {item.caption}
                </video>
              ) : (
                <img
                  src={formatImage(
                    activeSocialMediaType,
                    subdomain,
                    item?.attachment
                  )}
                  alt={`${item?.caption?.substring(0, 20)}...`}
                  style={{
                    objectFit: "cover",
                    minWidth: "150px",
                    width: "150px",
                    height: "200px",
                    margin: "10px 10px 10px 0",
                    borderRadius: "6px",
                  }}
                />
              )}
            </a>
          </div>
        ))}
      </Box>
      <div style={{ width: "100%" }}>
        <div
          style={{
            padding: "20px",
            background: "whitesmoke",
            margin: "0 auto",
            width: "fit-content",
          }}
        >
          <Button
            style={{
              border: "1px solid grey",
              textTransform: "capitalize",
            }}
            onClick={() => getFeed(page + 1)}
          >
            Load More Posts
          </Button>
        </div>
      </div>
    </Container>
  );
};

export default Feed;
