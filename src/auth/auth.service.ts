import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userService.findByEmail(email);
    if (!user) throw new UnauthorizedException('ユーザーが見つかりません');
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      throw new UnauthorizedException('パスワードが正しくありません');

    return user;
  }

  async login(user: User): Promise<{ access_token: string }> {
    const payload = { sub: user.id, email: user.email };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signup(dto: { email: string; password: string; name: string }) {
    const hashed = await bcrypt.hash(dto.password, 10);
    const newUser = await this.userService.create({
      ...dto,
      password: hashed,
    });

    return this.login(newUser);
  }
}
