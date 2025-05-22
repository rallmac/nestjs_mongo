import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private jwtService: JwtService
    ) {}


    async validateUser(username: string, password: string): Promise<any> {
        console.log('Validating user:', username);
        const user = await this.userService.findByUsername(username);
        console.log('User found:', user);
        if (user && (await bcrypt.compare(password, user.password))) {
            console.log('Password matched');
            const { password, ...result } = user;
            return result;
        }
        console.log('Invalid credentials');
        return null;
    }

    async login(user: any) {
        const payload = { username: user.username, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
