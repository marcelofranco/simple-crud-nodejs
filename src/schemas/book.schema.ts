import { object, optional, string, TypeOf, z } from "zod";

export const createBookSchema = object({
  body: object({
    name: string({
      required_error: "Name of the book is required",
    }),
    author: string({
      required_error: "Author is required",
    }),
    released: string({
      required_error: "Please select a date and time",
      invalid_type_error: "That's not a date!",
    }).datetime(),
    edition: optional(z.number().int()),
  }),
});

const params = {
  params: object({
    bookId: string(),
  }),
};

export const getBookSchema = object({
  ...params,
});

export const deleteBookSchema = object({
  ...params,
});

export const updateBookSchema = object({
  ...params,
  body: object({
    name: string({
      required_error: "Name of the book is required",
    }),
    author: string({
      required_error: "Author is required",
    }),
    released: string({
      required_error: "Please select a date and time",
      invalid_type_error: "That's not a date!",
    }).datetime(),
    edition: optional(z.number().int()),
  }).partial(),
});

export type CreateBookInput = TypeOf<typeof createBookSchema>["body"];
export type UpdateBookInput = TypeOf<typeof updateBookSchema>;
export type GetBookInput = TypeOf<typeof getBookSchema>["params"];
export type DeleteBookInput = TypeOf<typeof deleteBookSchema>["params"];
