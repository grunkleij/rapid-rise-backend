import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { AuthDto } from './auth.dto';
import * as bcrypt from "bcrypt"

@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        private jwtService: JwtService
    ) { }

    async register(authDto: AuthDto) {
        const hashedPassword = await bcrypt.hash(authDto.password, 10)
        return this.userService.create({
            email: authDto.email,
            password: hashedPassword
        })
    }

    async validateUesr(email: string, password: string): Promise<any> {
        const user = await this.userService.findOne(email)
        if (user && (await bcrypt.compare(password, user.password))) {
            const { password, ...result } = user
            return result
        }
        return null
    }

    async login(user: any) {
        const payload = { email: user.email, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
