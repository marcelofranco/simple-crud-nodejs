import { IsNumber } from "class-validator";

export class Book {
    id: number;
    name: string;
    author: string;
    @IsNumber()
    edition: number;
    released: string;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date;
}