import multer from "multer";
import path from "path";

const tempDir = path.join("tmp");

const multerConfig = multer.diskStorage({
  destination: tempDir,
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const limits = {
  fileSize: 2 * 1024 * 1024,
};

const upload = multer({
  storage: multerConfig,
  limits,
});

export { upload };
