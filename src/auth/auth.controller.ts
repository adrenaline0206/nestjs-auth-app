import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto, LoginDto } from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() dto: SignupDto): Promise<{ access_token: string }> {
    return this.authService.signup(dto);
  }
  @Post('login')
  async login(@Body() dto: LoginDto): Promise<{ access_token: string }> {
    const user = await this.authService.validateUser(dto.email, dto.password);
    return await this.authService.login(user);
  }
}
