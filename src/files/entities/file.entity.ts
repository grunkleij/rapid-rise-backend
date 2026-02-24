import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("files")
export class File {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    originalName: string;

    @Column()
    uniqueFilename: string;

    @Column()
    mimeType: string;

    @Column()
    size: number;

    @Column()
    userId: number;

    @CreateDateColumn()
    createdAt: Date;
}
