import { Typography } from "@mui/material";
import { numbersFormat } from "utils/functions.js";

import CallMadeIcon from "@mui/icons-material/CallMade";
import CallReceivedIcon from "@mui/icons-material/CallReceived";
import RemoveIcon from "@mui/icons-material/Remove";

export default function GrowthRateCard({ growthRate }) {
  const formattedGrowthRate = numbersFormat(growthRate);

  return (
    <div style={{ display: "flex" }}>
      <Typography
        style={{
          fontSize: 10,
          fontWeight: 600,

          color:
            !formattedGrowthRate || formattedGrowthRate === 0
              ? "#1877f2"
              : formattedGrowthRate < 0
              ? "red"
              : " #19A96E",
          display: "flex",
          marginRight: 10,
        }}
      >
        {" "}
        {!formattedGrowthRate || formattedGrowthRate === 0 ? (
          <RemoveIcon style={{ fontSize: "14px" }} />
        ) : formattedGrowthRate < 0 ? (
          <CallReceivedIcon style={{ fontSize: "14px" }} />
        ) : (
          <CallMadeIcon style={{ fontSize: "14px" }} />
        )}{" "}
        {formattedGrowthRate ? formattedGrowthRate : 0}%
      </Typography>
      <Typography
        style={{ fontSize: 10, color: "#000000", whiteSpace: "nowrap" }}
      >
        Absolute Growth
      </Typography>
    </div>
  );
}
