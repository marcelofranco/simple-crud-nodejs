import * as express from "express";
import { BookController } from "../controller/BookController";
import { validate } from "../middleware/Validate";
import { createBookSchema, getBookSchema, updateBookSchema } from "../schemas/Book.schema";


const router = express.Router();

let book = new BookController();

router
    .route("/")
    .get(book.all.bind(book))
    .post(validate(createBookSchema), book.save.bind(book));


router
    .route("/:bookId")
    .get(validate(getBookSchema), book.one.bind(book))
    .delete(validate(getBookSchema), book.remove.bind(book))
    .patch(validate(updateBookSchema), book.update.bind(book));


export default router;