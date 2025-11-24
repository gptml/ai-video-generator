import { Card, CardContent, Typography, Button } from "@mui/material";
import { useRef } from "react";
import CardActions from "@mui/material/CardActions";

export default function AudioPlayer({ src, href }) {
  const audioRef = useRef(null);

  const play = () => audioRef.current?.play();
  const pause = () => audioRef.current?.pause();

  return (
    <Card sx={{ maxWidth: 400, p: 2 }}>
      <CardContent>
        <Typography variant="h6">Audio Player</Typography>

        <audio ref={audioRef} src={src} />

        <Button onClick={play} sx={{ mr: 1 }} variant="contained">
          Play
        </Button>

        <Button onClick={pause} variant="outlined">
          Pause
        </Button>
      </CardContent>
      <CardActions>
        <Button size="small" color="primary" component="a" href={href}>
          Скачать
        </Button>
      </CardActions>
    </Card>
  );
}
