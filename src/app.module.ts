import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from './modules/auth/guards/access-token.guard';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { globalConfig } from './config/global.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { EmailModule } from './modules/email/email.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      load: [globalConfig],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const { host, port, username, password, database } =
          configService.get('auth.db');
        return {
          type: 'mysql',
          host,
          port,
          username,
          password,
          database,
          autoLoadEntities: true,
          dateStrings: true,
          synchronize: true,
          namingStrategy: new SnakeNamingStrategy(),
          logging: true,
        };
      },
    }),
    EmailModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
  ],
})
export class AppModule {}
