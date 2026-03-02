import { User } from "../..//users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Task {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    title: string

    @Column({ default: false })
    isCompleted: boolean



    @Column()
    userId: number;

    @CreateDateColumn()
    createdAt: Date

    @ManyToOne(() => User, user => user.tasks, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;
}
