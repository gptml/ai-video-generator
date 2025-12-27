import React, { useEffect, useState } from 'react';
import Wrapper from "../components/Wrapper";
import ModelCard from "../components/ModelCard";
import { useDispatch, useSelector } from "react-redux";
import { getAllModelsRequest } from "../store/reducers/generateVideo";
import Carusel from "../components/Carusel";
import Input from "../components/form/Input";


function Home() {

  const [ search, setSearch ] = useState("");
  const dispatch = useDispatch();


  const allModels = useSelector(state => state.generateVideo.allModels);

  console.log(
    allModels.filter(m => m.title.includes(search))
  )
  useEffect(() => {
    dispatch(getAllModelsRequest())
  }, [])

  return (
    <Wrapper>
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 ">

        <Carusel models={allModels.slice(0, 10)} />
        <div className="w-1/3 m-2">
          <Input label="Search" id='home_page_search' onChange={(ev) => setSearch(ev.target.value)} value={search} />
        </div>
        <div className="sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {allModels.filter(m => m.title?.toLowerCase().includes(search) || m.subtitle?.toLowerCase().includes(search))
            .map(model => (
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
      </div>
    </Wrapper>
  );
}

export default Home;
