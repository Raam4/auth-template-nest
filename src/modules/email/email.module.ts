import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const { host, port, user, password, from } = config.get('auth.mail');
        return {
          transport: {
            host: host,
            port: port,
            secure: true,
            auth: {
              user: user,
              pass: password,
            },
          },
          defaults: {
            from: `'From ...' <${from}>`,
          },
          template: {
            /* dir: __dirname + '/templates', */
            dir: process.cwd() + '/src/modules/email/templates',
            adapter: new EjsAdapter(),
            options: {
              strict: false,
            },
          },
        };
      },
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
