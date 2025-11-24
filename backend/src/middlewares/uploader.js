import multer from "multer";
import { v4 as uuidV4 } from "uuid";
import HttpError from "http-errors";

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    const uid = uuidV4();
    cb(null, uid + '-' + file.originalname);
  }
})

const upload = (allow = []) => {
  return multer({
    storage,
    fileFilter: (req, file, cb) => {
      if (allow.includes(file.mimetype)) {
        cb(null, true)
      } else {
        cb(HttpError(`${file.mimetype} not allowed`), false)
      }
    }
  })
}

export default upload;
