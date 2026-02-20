import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Task {
    @PrimaryGeneratedColumn()
    id : number

    @Column()
    title : string

    @Column({default : false})
    isCompleted : boolean

    @CreateDateColumn()
    createdAt : Date
}
