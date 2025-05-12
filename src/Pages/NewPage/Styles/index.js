const styles = (theme) => ({
    row: {
      marginTop: "65px",
      minHeight: "calc(100vh - 65px)",
      flexDirection: "column",
    },
    headerContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 24,
    },
    pageHeader:{
      marginTop: 25,
      marginBottom: 30,
      marginInline: "auto",
      display: "flex",
      flexDirection: "column",
      gap: "8px"
    },
    pageDetailWrapper:{
      marginBottom: 32,
      width:"100%",
      border: "1px solid rgba(0, 0, 0, 0.23)",
      padding:"16px",
      borderRadius:"8px",
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      boxShadow: "none",
      '&:hover': {
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      },
      transition: 'box-shadow 0.3s ease',
    },
    pageDetailInner:{
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      width:"100%"
    },
    pageDetail : {
      display: "flex",
      justifyContent: "space-between",
      gap:"16px",
      "@media (max-width: 800px)": {
        flexDirection: "column",
        gap: "8px"
      }
    },
    addSection:{
      boxShadow: "none",
      textTransform: 'none',
      fontWeight: 400,
      "& svg":{
        height: "16px",
        width: "16px",
        marginRight: "4px"
      }
    },
    removeSection:{
      color: "#f44336",
      borderColor: "#f44336",
      textTransform: 'none',
      backgroundColor: "#fff",
      marginTop: "-2.25rem",
      "&:hover": {
        backgroundColor: "#f44336",
        color: "#fff",
        },
      marginLeft: "auto",
      "& svg":{
        height: "16px",
        width: "16px",
        marginRight: "4px"
      }
    }
    });

  export default styles;
