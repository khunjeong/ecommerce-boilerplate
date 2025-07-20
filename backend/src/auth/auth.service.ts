import * as bcrypt from 'bcryptjs';

import { Injectable, UnauthorizedException } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    console.log('🔍 Validating user:', email);

    const user = await this.usersService.findByEmail(email);
    console.log(
      '👤 Found user:',
      user
        ? { id: user.id, email: user.email, hasPassword: !!user.password }
        : null,
    );

    if (
      user &&
      user.password &&
      (await bcrypt.compare(password, user.password))
    ) {
      console.log('✅ Password validation successful');
      const { password, ...result } = user;
      return result;
    }

    console.log('❌ Password validation failed');
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async register(createUserDto: any) {
    const user = await this.usersService.create(createUserDto);
    return this.login(user);
  }
}
