import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import CardActionArea from '@mui/material/CardActionArea';
import CardActions from '@mui/material/CardActions';

export default function Video(props) {
  return (
    <Card sx={{ maxWidth: 800 }}>
      <CardActionArea>
        <video
          controls
          style={{ width: "100%", borderRadius: 8 }}
          src={props.src}
        />
      </CardActionArea>
      <CardActions>
        <Button size="small" color="primary" component="a" href={props.href}>
          Скачать
        </Button>
      </CardActions>
    </Card>
  );
}
