import React, { useEffect } from 'react';
import Wrapper from "../components/Wrapper";
import ModelCard from "../components/ModelCard";
import { Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { getAllModelsRequest } from "../store/reducers/generateVideo";


function Home() {

  const dispatch = useDispatch();

  const allModels = useSelector(state => state.generateVideo.allModels);


  useEffect(() => {
    dispatch(getAllModelsRequest())
  }, [])

  return (
    <Wrapper>
      <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
        {allModels.map(model => (
            <ModelCard
              key={model.id}
              path={model.path}
              title={model.title}
              description={model.description}
              image={model.image}
              label={model.label}
              token={model.token}
            />
        ))}
      </Box>
    </Wrapper>
  );
}

export default Home;
