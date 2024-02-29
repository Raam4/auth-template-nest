import { registerAs } from '@nestjs/config';

export const globalConfig = registerAs('auth', () => ({
    db: {
        host: process.env['DB_HOST'],
        port: Number(process.env['DB_PORT']),
        username: process.env['DB_USERNAME'],
        password: process.env['DB_PASSWORD'],
        database: process.env['DB_DATABASE'],
    },
    jwt: {
        secret: process.env['JWT_SECRET'],
        expiration: process.env['JWT_EXPIRATION'],
        verificationSecret: process.env['JWT_VERIFICATION_SECRET'],
        verificationExpiration: process.env['JWT_VERIFICATION_EXPIRATION'],
    },
    mail: {
        host: process.env['MAIL_HOST'],
        port: Number(process.env['MAIL_PORT']),
        user: process.env['MAIL_USER'],
        password: process.env['MAIL_PASSWORD'],
        from: process.env['MAIL_FROM'],
        emailConfirmationUrl: process.env['EMAIL_VERIFICATION_URL'],
    },
}));
