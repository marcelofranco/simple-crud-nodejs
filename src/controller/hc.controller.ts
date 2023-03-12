import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Book } from "../entity/Book";
import { HttpCode } from "../exceptions/AppError";

export const healthcheck = async (_request: Request, response: Response) => {
  const healthcheck = {
    uptime: process.uptime(),
    responseTime: process.hrtime(),
    message: "SUCCESS",
    timestamp: Date.now(),
  };

  try {
    await AppDataSource.manager.count(Book);

    response.status(HttpCode.OK).send(healthcheck);
  } catch (err: any) {
    healthcheck.message = err;
    response.status(503);
  }
};
