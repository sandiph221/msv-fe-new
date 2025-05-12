
const Classes = (theme) => ({

    heading:{
      fontSize: "2.1875rem",
      fontFamily: "Raleway",
      fontWeight: "bold",
      lineHeight: "2.625rem",
      letterSpacing: "-0.00833em",
      color:"black"
    },
    subHeading:{
      fontSize: "1.25rem",
      fontFamily: "Raleway",
      fontWeight: "bold",
      lineHeight: 1.5,
      letterSpacing:"0em",
      marginTop:"16px",
      color:"black"
    },
    box:{
      width:"100%",
      marginLeft:"auto",
      marginRight:"auto",
      padding:"24px",
      margin:"40px 39px",
      border: "1px solid #E0E0E0",
      borderRadius: '6px',
      transitionDuration: '0.4s',
      '@media (max-width : 600px)': {
        maxWidth: '100%',
        padding: '24px',
      },
      "&:hover": {
        boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.15)',
      },
      "@media (max-width : 600px)":{
        maxWidth:"100%",
        padding:"24px",

      }
    },
    flexRow:{
      display: "flex",
      flexDirection: "row",
      justiContent: "space-between",
      alignItems: "center",
      marginBottom:"16px"
    },
    flexColumn:{
      display:"flex",
      flexDirection:"column",

    },
    selectContainer:{
      marginTop:"10px",
      width:"190px"
    },
    relative:{
      position:"relative"
    },
    selectField:{
      paddingLeft:"20px",
      width:"100%",
      height:"40px",
      border:"1px solid grey",
      borderRadius:"6px",
      "&::before":{
        borderBottom:"none !important"
      },
      "&::after":{
        borderBottom:"none !important"
      },
      "&:focus-visible":{
        border:"none"
      },
      "& .MuiSelect-select:focus":{
        borderRadius:"6px !important"
      }

    },
    iconContainer:{
      marginLeft:"20px",
      cursor:"pointer",
      "& .MuiSvgIcon-root":{
        marginTop:"13px",
        color: "#f8c144",

      }
    },
    link:{
      color: "#f8c144",
      fontWeight: 900,
      textDecoration: "none"
    },
    text:{
      fontSize: "1rem",
      fontFamily: "Roboto, Helvetica, Arial, sans-serif",
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: "0.00938em",

    },

  });

  export default Classes
