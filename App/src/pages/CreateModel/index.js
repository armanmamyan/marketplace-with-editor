import { useEffect, useState, useCallback } from "react";
import CanvasContainer from "../../components/Models/Canvas";
import ModelLoader from "../../components/Models/Models";
import Aside from '../../components/Aside'
import { Box, Typography } from "@mui/material";
import { HexColorPicker } from "react-colorful";

const CreateModel = () => {
  const [layers, setLayers] = useState({
    current: null,
    items: {
      laces: "#ffffff",
      mesh: "#ffffff",
      caps: "#ffffff",
      inner: "#ffffff",
      sole: "#ffffff",
      stripes: "#ffffff",
      band: "#ffffff",
      patch: "#ffffff",
    },
  });

  const handleMaterialColorChange = useCallback(
    (color) => {
      setLayers((prevState) => ({
        ...prevState,
        items: {
          ...prevState.items,
          [layers.current]: color,
        },
      }));
    },
    [layers]
  );

  return (
    <>
   
      <Box display="flex">
        <Box height="100vh" width="100%">
          <CanvasContainer>
            <ModelLoader layers={layers} setLayers={setLayers} />
          </CanvasContainer>
          {layers?.current ? (
            <Box>
              <HexColorPicker
                className="picker"
                color={layers.items[layers.current]}
                onChange={handleMaterialColorChange}
              />
              <Typography variant="body1">{layers.current}</Typography>
            </Box>
          ) : null}
        </Box>
        <Aside layers={layers}/>
      </Box>
    </>
  );
};

export default CreateModel;
