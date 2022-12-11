import { useState, useEffect } from "react";
import { Box, Typography, Button, TextField, FormControl } from "@mui/material";

const Aside = ({ layers }) => {
  return (
    <Box bgcolor="white" width="30%" p={4}>
      <Typography variant="h4" fontWeight="600" color="black">
        Properties:
      </Typography>
      <Box mb={3}>
        {Object.entries(layers.items).map((item) => (
          <Box
            key={item[0]}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h6" color="black" textTransform="capitalize">
              {item[0]}:{" "}
            </Typography>
            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="body1" color="black">
                {item[1]}
              </Typography>
              <Box
                height={20}
                width={50}
                bgcolor={item[1]}
                border={item[1] === "#ffffff" ? 2 : 0}
                borderColor="black"
              ></Box>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Aside;
