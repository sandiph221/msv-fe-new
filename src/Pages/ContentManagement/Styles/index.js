const styles = (theme) => ({
    row: {
      marginTop: "65px",
      minHeight: "calc(100vh - 65px)",
      flexDirection: "column",
    },
    pageTable:{
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
      marginBottom: 20,
      width:"100%",
      border: "1px solid rgba(0,0,0,0.23)",
      padding:"16px",
      borderRadius:"8px",
      display: "flex",
      flexDirection: "column",
      gap: "8px",
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
    },
    "&:hover":{
      ".removeSection":{
        opacity: 1
      }
    },
    });

  export default styles;
