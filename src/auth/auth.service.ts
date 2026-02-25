import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { AuthDto } from './auth.dto';
import * as bcrypt from "bcrypt"
import { ref } from 'process';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
    constructor(
        private userService: UsersService,
        private jwtService: JwtService,
        @InjectRepository(User)
        private userRepository: Repository<User>
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
        const tokens = await this.getTokens(user.id, user.email)

        await this.updateRefreshToken(user.id, tokens.refreshToken)

        return tokens;
    }

    async getTokens(userId: number, email: string) {
        const payload = { sub : userId, email:  email }

        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: process.env.JWT_ACCESS_SECRET,
                expiresIn: '15m'
            }),
            this.jwtService.signAsync(payload, {
                secret: process.env.JWT_REFRESH_SECRET,
                expiresIn: '7d'
            })
        ])

        return {
            accessToken,
            refreshToken
        }
    }

    async updateRefreshToken(userId: number, refreshToken: string) {
        const saltRounds = 10;
        const hashedRefreshToken = await bcrypt.hash(refreshToken, saltRounds);

        await this.userRepository.update(userId, { hashedRefreshToken })
    }

    async refreshTokens(refreshToken: string) {
        try {
            const payload = await this.jwtService.verifyAsync(refreshToken, {
                secret: process.env.JWT_REFRESH_SECRET,
            });

            const user = await this.userRepository.findOne({ where: { id: payload.userId } });
            if (!user || !user.hashedRefreshToken) {
                throw new ForbiddenException('Access Denied');
            }

            const refreshTokenMatches = await bcrypt.compare(refreshToken, user.hashedRefreshToken);
            if (!refreshTokenMatches) {
                throw new ForbiddenException('Access Denied');
            }

            const tokens = await this.getTokens(user.id, user.email);
            await this.updateRefreshToken(user.id, tokens.refreshToken);

            return tokens;
        } catch (e) {
            throw new ForbiddenException('Invalid Refresh Token');
        }
    }
}
