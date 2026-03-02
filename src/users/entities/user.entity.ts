import { File } from '../../files/entities/file.entity';
import { Task } from '../../tasks/entities/task.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({nullable : true})
  hashedRefreshToken : string;

  @Column()
  password: string; 

  @OneToMany(() => File, file => file.user)
  files: File[];

  @OneToMany(() => Task, task => task.user)
  tasks: Task[];
}
  
