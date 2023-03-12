import * as request from "supertest";
import * as BookController from "../controller/book.controller";
import { HttpCode } from "../exceptions/AppError";

import app = require("../app");

jest.mock("../controller/book.controller");

describe("APP", () => {
  test("should expect internal server error", (done) => {
    const mockAllBooks = jest.spyOn(BookController, "all");
    mockAllBooks.mockImplementation(() => {
      throw new Error();
    });
    request(app)
      .get("/books")
      .expect(HttpCode.INTERNAL_SERVER_ERROR)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).toMatchObject({
          status: HttpCode.INTERNAL_SERVER_ERROR,
          message: "Internal server error!",
        });
        done();
      });
  });
});
