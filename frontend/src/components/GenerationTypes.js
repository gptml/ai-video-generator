import React from 'react';
import { Chip } from "@mui/material";

function GenerationTypes(props) {
  const { types, onClick, selectedType } = props;
  return (
    <div>
      {types.map((type) => (
        <Chip
          key={type.title}
          label={type.title}
          color={selectedType === type.title ? "primary" : "gray"}
          variant="outlined"
          size="large"
          sx={{ mb: 4, mr: 4, mt: 4 }}
          onClick={() => onClick(type)}
        />

      ))}
    </div>
  );
}

export default GenerationTypes;
