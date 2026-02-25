import { Body, Controller, HttpCode, HttpStatus, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiBody, ApiOperation } from '@nestjs/swagger';
import { AuthDto } from './auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService
  ) { }

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  async register(@Body() authDto: AuthDto) {
    return this.authService.register(authDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login to get JWT Token' })
  async login(@Body() authDto: AuthDto) {
    const user = await this.authService.validateUesr(authDto.email, authDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  @ApiOperation({ summary: 'Log out and revoke refresh token' })
  async logout(@Req() req: any) {
    await this.authService.updateRefreshToken(req.user.userId, "");
    return { message: 'Logged out successfully' };
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Trade a refresh token for a new access token' })
  @ApiBody({ schema: { properties: { refreshToken: { type: 'string' } } } })
  async refreshTokens(@Body('refreshToken') refreshToken: string) {
    return this.authService.refreshTokens(refreshToken);
  }
}
