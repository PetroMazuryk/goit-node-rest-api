import multer from "multer";
import path from "path";
import HttpError from "../helpers/HttpError.js";

const tempDir = path.join("tmp");

const multerConfig = multer.diskStorage({
  destination: tempDir,
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const multerFilter = (req, file, cb) => {
  const extension = file.originalname.split(".").pop();

  if (extension === "exe") {
    cb(HttpError(400, "exe is not allowed"), false);
  }

  cb(null, true);
};

const limits = {
  fileSize: 2 * 1024 * 1024,
};

const upload = multer({
  storage: multerConfig,
  fileFilter: multerFilter,
  limits,
});

export { upload };
