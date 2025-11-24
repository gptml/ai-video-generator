import React from 'react';
import { Box, Card, CardContent, Chip, Typography } from "@mui/material";

function ModelCard(props) {

  const { title, description, image, label = 'Генерация видео' } = props;

  return (
    <Card
      sx={{
        borderRadius: 4,
        padding: 2,
        display: "flex",
        maxWidth: 600,
        boxShadow: "0 0 20px rgba(0,0,0,0.05)",
        marginBottom: 2,
        marginRight: 2,
      }}
    >
      <Box
        component="img"
        src={image}
        alt="Example"
        loading="lazy"
        sx={{
          width: 60,
          height: 60,
          borderRadius: 2,
          background: "#f5f5f5",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginRight: 2,
          flexShrink: 0,
        }}
      />

      <CardContent sx={{ padding: 0 }}>
        <Chip
          label={label}
          color="primary"
          variant="outlined"
          size="small"
          sx={{ mb: 1 }}
        />

        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>

        <Typography variant="body2" color="text.secondary">{description}</Typography>
      </CardContent>
    </Card>
  );
}

export default ModelCard;
