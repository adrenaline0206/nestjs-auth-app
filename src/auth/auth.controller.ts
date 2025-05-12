import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authSerVice: AuthService) {}

  @Post('signup')
  signup(
    @Body() dto: { email: string; password: string; name: string },
  ): Promise<{ access_token: string }> {
    return this.authSerVice.signup(dto);
  }
  @Post('login')
  async login(
    @Body() dto: { email: string; password: string },
  ): Promise<{ access_token: string }> {
    const user = await this.authSerVice.validateUser(dto.email, dto.password);
    return await this.authSerVice.login(user);
  }
}
