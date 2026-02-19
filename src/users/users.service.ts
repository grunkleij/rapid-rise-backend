import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) { }

    async findOne(email: string): Promise<User | null> {
        return this.userRepository.findOne({ where: { email } })
    }

    async create(userDetails: { email: string; password: string }): Promise<User> {
        const newUser = this.userRepository.create(userDetails);

        return this.userRepository.save(newUser);
    }
}
