import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [PassportModule],
  controllers: [ProfileController],
})
export class ProfileModule {}
