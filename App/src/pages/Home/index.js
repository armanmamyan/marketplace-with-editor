import { useNavigate } from "react-router-dom";
import { Box, Typography, Container } from "@mui/material";
import Shoe from "../../assets/shoe.jpeg";

const Home = () => {
  const navigate = useNavigate();

  const handleModelNavigation = () => {
    return navigate("/create-model");
  };

  return (
    <>
      <Box
        width="100%"
        height="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        px={15}
      >
        <Typography
          variant="h1"
          color="aliceblue"
          textAlign="center"
          fontWeight={600}
        >
          Create and Edit <br /> Your 3D NFT models with us
        </Typography>
      </Box>
      <Container maxWidth="lg">
        <Box mb={8}>
          <Typography variant="h2">Create Your own Model</Typography>
          <Box pt={4} pb={8}>
            <Box
              width={300}
              border={2}
              borderColor="#fff"
              onClick={handleModelNavigation}
              style={{ cursor: "pointer" }}
              borderRadius={4}
              overflow='hidden'
            >
              <Box width="100%" height={300} mb={2}>
                <img
                  src={Shoe}
                  alt={"Shoe"}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center",
                  }}
                />
              </Box>
              <Box px={2}>
              <Typography variant="h3">Shoe</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default Home;
