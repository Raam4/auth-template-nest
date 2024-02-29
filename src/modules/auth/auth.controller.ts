import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './entities/register.dto';
import { Public } from './decorators/public.decorator';
import { LoginDto } from './entities/login.dto';
import { Request as Req } from 'express';
import { VerifyEmailDto } from './entities/verify-email.dto';
import { ResendVerificationDto } from './entities/resend-verification.dto';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Public()
  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<any> {
    return this.authService.register(registerDto);
  }

  @Public()
  @Post('verify-email')
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto): Promise<any> {
    return this.authService.verifyEmail(verifyEmailDto.token);
  }

  @Public()
  @Post('resend-verification')
  async resendVerification(@Body() resendVerificationDto: ResendVerificationDto): Promise<any> {
    return this.authService.resendVerification(resendVerificationDto.email);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() loginDto: LoginDto): Promise<any> {
    return this.authService.login(loginDto);
  }

  @Get('profile')
  profile(@Request() req: Req) {
    return this.authService.getProfile(req.user);
  }
}
