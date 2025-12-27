import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import CardActionArea from '@mui/material/CardActionArea';
import CardActions from '@mui/material/CardActions';

export default function Video(props) {

  return (
    <div className="max-w-[800px] rounded-xl   shadow-sm overflow-hidden">

      {/* Video */}
      <div className="p-2">
        <video
          controls
          src={props.src}
          className="w-full rounded-lg"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-start px-4 py-3 border-t">
        <a
          href={props.href}
          className="text-blue-600 text-sm font-medium hover:underline"
        >
          Скачать
        </a>
      </div>
    </div>

  )
}
