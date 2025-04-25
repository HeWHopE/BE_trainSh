import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { getConfig } from 'src/config';

import { v4 as uuidv4 } from 'uuid';

import { PrismaService } from 'prisma/prisma.serice';
import { AuthResponse, RefreshResponse, SignInDto, SignUpDto } from './dtos';

interface JwtPayload {
  id: number;
  email: string;
  name: string;
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  private generateTokens(payload: JwtPayload): AuthResponse {
    const access_token = this.generateToken(
      payload,
      getConfig().jwt_access_secret,
      getConfig().jwt_access_expires,
    );
    const refresh_token = this.generateToken(
      payload,
      getConfig().jwt_refresh_secret,
      getConfig().jwt_refresh_expires,
    );
    return { access_token, refresh_token };
  }

  private generateToken(
    payload: JwtPayload,
    secret: string,
    expiresIn: string,
  ) {
    return this.jwtService.sign(payload, {
      secret,
      expiresIn,
    });
  }

  async signUp(data: SignUpDto): Promise<AuthResponse> {
    // Check if the user already exists using Prisma
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (user) {
      throw new BadRequestException(
        `User with this email: ${data.email} already registered`,
      );
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const activationLink = uuidv4();

    // Create a new user using Prisma
    const newUser = await this.prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
      },
    });

    const payload: JwtPayload = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
    };

    return this.generateTokens(payload);
  }

  async signIn(data: SignInDto): Promise<AuthResponse> {
    // Find the user by email using Prisma
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new NotFoundException(
        `User with this email: ${data.email} not found`,
      );
    }

    // Check if the password is valid
    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Password incorrect');
    }

    const payload: JwtPayload = {
      id: user.id,
      email: user.email,
      name: user.name,
    };

    return this.generateTokens(payload);
  }

  async refreshToken(refresh_token: string): Promise<RefreshResponse> {
    let decoded;
    try {
      decoded = this.jwtService.verify(refresh_token, {
        secret: getConfig().jwt_refresh_secret,
      });
    } catch (e) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    // Find the user by ID using Prisma
    const user = await this.prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const payload: JwtPayload = {
      id: user.id,
      email: user.email,
      name: user.name,
    };

    const access_token = this.generateToken(
      payload,
      getConfig().jwt_access_secret,
      getConfig().jwt_access_expires,
    );

    return { access_token };
  }
}
