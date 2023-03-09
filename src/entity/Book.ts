import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm"

@Entity()
@Unique(["edition", "name"])
export class Book {

    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    name!: string

    @Column()
    author!: string

    @Column("int8", { default: 1 })
    edition!: number

    @Column({ type: 'date' })
    released!: string

    @CreateDateColumn()
    created_at!: Date

    @UpdateDateColumn()
    updated_at!: Date

    @DeleteDateColumn()
    deleted_at!: Date
}
