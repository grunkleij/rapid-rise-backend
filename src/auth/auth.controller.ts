import { Body, Controller, HttpCode, HttpStatus, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiBody, ApiOperation } from '@nestjs/swagger';
import { AuthDto } from './auth.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import type { Response } from 'express';

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
async login(
  @Body() authDto: AuthDto,
  @Res({ passthrough: true }) res: Response
) {
    const user = await this.authService.validateUesr(authDto.email, authDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    const tokens = await this.authService.login(user);

    res.cookie('access_token', tokens.accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000, 
    });

    if (tokens.refreshToken) {
      res.cookie('refresh_token', tokens.refreshToken, {
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, 
      });
    }

    return { message: 'Logged in successfully',
      email : authDto.email
     };
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  @ApiOperation({ summary: 'Log out and revoke refresh token' })
  async logout(
    @Req() req: any,
    @Res({ passthrough: true }) res: Response 
  ) {
    await this.authService.updateRefreshToken(req.user.userId, "");
    
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');

    return { message: 'Logged out successfully' };
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Trade a refresh token for a new access token' })
  @ApiBody({ schema: { properties: { refreshToken: { type: 'string' } } } })
  async refreshTokens(@Body('refreshToken') refreshToken: string) {
    return this.authService.refreshTokens(refreshToken);
  }
}
