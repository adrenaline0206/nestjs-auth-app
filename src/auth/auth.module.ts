import { DynamicModule, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtStrategy } from './jwt.strategy';

const jwtModule: DynamicModule = JwtModule.registerAsync({
  useFactory: () => ({
    secret: 'yourSecretKey',
    signOptions: { expiresIn: '1d' },
  }),
});

@Module({
  imports: [UsersModule, jwtModule],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
