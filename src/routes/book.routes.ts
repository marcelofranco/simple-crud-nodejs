import * as express from "express";
import { all, one, remove, save, update } from "../controller/book.controller";
import { validate } from "../middleware/validate";
import { createBookSchema, getBookSchema, updateBookSchema } from "../schemas/book.schema";

const router = express.Router();

router
    .route("/")
    .get(all)
    .post(validate(createBookSchema), save);


router
    .route("/:bookId")
    .get(validate(getBookSchema), one)
    .delete(validate(getBookSchema), remove)
    .patch(validate(updateBookSchema), update);


export default router;