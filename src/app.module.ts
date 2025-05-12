import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Message } from './message/message.entity';
import { MessageController } from './message/message.controller';
import { MessageService } from './message/message.service';
import { MessageModule } from './message/message.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';

const ormConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: '127.0.0.1',
  port: 3306,
  username: 'root',
  password: 'root',
  database: 'app_db',
  entities: [Message],
  synchronize: true,
};

@Module({
  imports: [
    TypeOrmModule.forRoot(ormConfig),
    TypeOrmModule.forFeature([Message]),
    MessageModule,
    UsersModule,
    AuthModule,
    ProfileModule,
  ],
  controllers: [MessageController],
  providers: [MessageService],
})
export class AppModule {}
