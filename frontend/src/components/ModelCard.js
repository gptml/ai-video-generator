import React from 'react';
import { Box, Card, CardContent, Chip, Typography } from "@mui/material";
import * as icons from "../data/icons";
import { useSelector } from "react-redux";

function ModelCard(props) {

  const { title, description, image, label, token  } = props;
  const user = useSelector(state => state.users.user);

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
        src={icons[image]}
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
          label={label || 'Генерация видео'}
          color="primary"
          variant="outlined"
          size="small"
          sx={{ mb: 1 }}
          disabled={user.tokens < token}
        />

        <Chip
          label={`Стоимость: ${token} токенов`}
          size="small"
          sx={{ mb: 1, ml: 1 }}
          color={user.tokens < token ? "error" : "success"}
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
