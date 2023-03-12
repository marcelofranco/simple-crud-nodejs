import { Request, Response } from "express";
import { QueryFailedError } from "typeorm";
import { AppDataSource } from "../../data-source";
import * as HcController from "../hc.controller";

jest.mock("../../data-source");

test("hc endpoint should return 503", async () => {
  const mockAllBooks = jest.spyOn(AppDataSource.manager, "count");
  mockAllBooks.mockImplementation(() => {
    throw new QueryFailedError("", undefined, undefined);
  });
  const req = { params: {} } as Request;
  const res = {} as unknown as Response;
  res.json = jest.fn();
  res.status = jest.fn(() => res); // chained

  await HcController.healthcheck(req, res);

  expect(res.status).toHaveBeenCalledWith(503);
});

test("hc endpoint should return 200", async () => {
  const mockAllBooks = jest.spyOn(AppDataSource.manager, "count");
  mockAllBooks.mockResolvedValue(1);
  const req = { params: {} } as Request;
  const res = {} as unknown as Response;
  res.json = jest.fn();
  res.status = jest.fn(() => res); // chained

  await HcController.healthcheck(req, res);

  expect(res.status).toHaveBeenCalledWith(200);
});
