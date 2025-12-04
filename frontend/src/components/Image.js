import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import CardActionArea from '@mui/material/CardActionArea';
import CardActions from '@mui/material/CardActions';

export default function Image(props) {
  return (
    <Card sx={{ maxWidth: 800 }}>
      <CardActionArea>
        <img
          alt='img'
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
