import { BadRequestException, Injectable } from '@nestjs/common';
import { RegisterDto } from './entities/register.dto';
import { UsuariosService } from '../usuarios/usuario.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './entities/login.dto';
import { EmailService } from '../email/email.service';

@Injectable()
export class AuthService {
  constructor(
    private usuariosService: UsuariosService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private emailService: EmailService,
  ) {}

  async register({
    nombre,
    apellido,
    email,
    password,
  }: RegisterDto): Promise<any> {
    const user = await this.usuariosService.findByEmail(email);

    if (user) throw new BadRequestException('El usuario ya existe');

    const hashedPassword = await bcrypt.hash(password, 10);

    await this.usuariosService.create({
      email: email,
      password: hashedPassword,
      nombre: nombre,
      apellido: apellido,
      verificado: false,
    });

    const token = await this.generateVerificationToken(email);

    await this.emailService.welcomeEmail({ email, nombre, token });

    return {
      message: 'Usuario registrado con éxito',
    };
  }

  async verifyEmail(token: string) {
    const { email } = await this.decodeVerificationToken(token);

    const user = await this.usuariosService.findByEmail(email);

    if (!user) throw new BadRequestException('El usuario no existe');

    if (user.verificado)
      throw new BadRequestException('El usuario ya está verificado');

    await this.usuariosService.update(user.id, { verificado: true });

    return {
      message: 'Usuario verificado con éxito',
    };
  }

  async resendVerification(email: string) {
    const user = await this.usuariosService.findByEmail(email);

    if (!user) throw new BadRequestException('El usuario no existe');

    if (user.verificado)
      throw new BadRequestException('El usuario ya está verificado');

    const token = await this.generateVerificationToken(email);

    await this.emailService.resendVerification({ email, nombre: user.nombre, token });

    return {
      message: 'Correo de verificación reenviado',
    };
  }

  async login({ email, password }: LoginDto): Promise<any> {
    const user = await this.usuariosService.findByEmail(email);

    if (!user) throw new BadRequestException('El usuario no existe');

    if (!user.verificado)
      throw new BadRequestException('El usuario no está verificado');

    const match = await bcrypt.compare(password, user.password);

    if (!match) throw new BadRequestException('Verifique su contraseña');

    const token = await this.generateToken(user.id, user.email);

    return { token, email: user.email };
  }

  async getProfile(reqUser: any) {
    const user = await this.usuariosService.findById(reqUser.id);
    if (!user) throw new BadRequestException('El usuario no existe');
    return user;
  }

  async generateToken(id: number, email: string) {
    const token = await this.jwtService.signAsync(
      {
        id,
        email,
      },
      {
        secret: this.configService.get('auth.jwt.secret'),
        expiresIn: this.configService.get('auth.jwt.expiration'),
      },
    );
    return token;
  }

  async generateVerificationToken(email: string) {
    const token = await this.jwtService.signAsync(
      {
        email,
      },
      {
        secret: this.configService.get('auth.jwt.verificationSecret'),
        expiresIn: this.configService.get('auth.jwt.verificationExpiration'),
      },
    );
    return token;
  }

  async decodeVerificationToken(token: string) {
    try{
      const decoded = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('auth.jwt.verificationSecret'),
      });
      return decoded;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new BadRequestException('El token de verificación ha expirado');
      }
      throw new BadRequestException('El token de verificación no es válido');
    }
  }
}
