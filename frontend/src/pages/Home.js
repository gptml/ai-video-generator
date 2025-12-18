import React, { useEffect } from 'react';
import Wrapper from "../components/Wrapper";
import ModelCard from "../components/ModelCard";
import { useDispatch, useSelector } from "react-redux";
import { getAllModelsRequest } from "../store/reducers/generateVideo";
import Carusel from "../components/Carusel";


function Home() {

  const dispatch = useDispatch();

  const allModels = useSelector(state => state.generateVideo.allModels);


  useEffect(() => {
    dispatch(getAllModelsRequest())
  }, [])

  return (
    <Wrapper>
      <Carusel models={allModels.slice(0, 10)} />
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {allModels.map(model => (
          <ModelCard
            key={model.id}
            id={model.id}
            path={model.path}
            title={model.title}
            subtitle={model.subtitle}
            description={model.description}
            background={model.background}
            backgroundType={model.backgroundType}
            image={model.image}
            label={model.label}
            token={model.token}
          />
        ))}
      </div>
    </Wrapper>
  );
}

export default Home;
