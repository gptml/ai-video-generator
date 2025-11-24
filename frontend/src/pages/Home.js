import React from 'react';
import Wrapper from "../components/Wrapper";
import ModelCard from "../components/ModelCard";
import modelsList from "../data/modelsList";
import { Box } from "@mui/material";
import { Link } from 'react-router';


function Home() {
  return (
    <Wrapper>
      <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
        {modelsList.map(model => (
          <Link to={model.path} key={model.id}>
            <ModelCard
              title={model.title}
              description={model.description}
              image={model.image}
              label={model.label}
            />
          </Link>
        ))}
      </Box>
    </Wrapper>
  );
}

export default Home;
