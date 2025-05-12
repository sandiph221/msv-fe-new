export const Styles = () => ({
  labelWrapper: {
    display: "flex",
    justifyContent: (props) =>
      !props.socialListening && props.loading
        ? "center"
        : props.socialListening && props.loading
          ? "space-between"
          : "space-between",
    position: "relative",
    height: 200,
  },
  cardLabelContent: {
    padding: 10,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    marginLeft: (props) => props.xs ? 0 : 20,
  },

  labelContentTitleWrapper: {
    display: "flex",
    alignItems: "center",
    "& .title": {
      fontSize: 20,
      fontWeight: 600,
      marginRight: 10,
    },
    "& .filter-type": {
      fontSize: 14,
      color: "#757575",
    },
  },
  cardFiguresWrapper: {
    position: "relative",
    minHeight: 45,
    "& .figures": {
      fontSize: 42,
      fontWeight: 700,
    },
  },
  cardGrowthWrapper: {
    display: "flex",
    "& .growth-figures": {
      fontSize: 15,
      fontWeight: 600,
      color: (props) =>
        !props.trimCardGrowthrate || props.trimCardGrowthrate == 0
          ? "#1877f2"
          : props.trimCardGrowthrate < 0
            ? "red"
            : " #19A96E",
      display: "flex",
      marginRight: 15,
    },
    "& .growth": {
      fontSize: 14,
      color: "#757575",
    },
  },
  cardCardAction: {
    alignSelf: "flex-start",
    margin: props => props.xs ? 0 : props.socialListening
      ? "35px 10px 0px 0px"
      : "10px 10px 0px 0px",
  },
  cardlabelIcon: {
    backgroundColor: (props) => props.colorCode,
    height: props => props.xs ? 30 : 55,
    width: props => props.xs ? 30 : 55,
  },
});
