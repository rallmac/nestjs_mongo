import { Controller, Post, Body, Get, Param, Patch, Query } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { User } from './user.entity';


@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post('register')
    async createUser(@Body() createUserDto: CreateUserDto ): Promise<User> {
        return this.userService.createUser(createUserDto);
    }

    @Get('email')
    async findByEmail(@Param('email') email: string): Promise<User | null> {
        return this.userService.findByEmail(email);
    }

    @Get()
    async findAll() {
        return this.userService.findAll();
    }

    @Get(':username')
    async findByUsername(@Param('username')username: string): Promise<User | null> {
        return this.userService.findByUsername(username);
    }

    @Patch('change-password')
    async changePassword(
        @Body() body: { username: string; oldPassword: string; newPassword: string }
    ) {
        return this.userService.changePassword(body.username, body.oldPassword, body.newPassword);
    }

    @Get('confirm-email')
    async confirmEmail(@Query('token') token: string) {
        const user = await this.userService.confirmEmail(token);
        if (!user) {
            return { message: 'Invalid or expired confirmation token' };
        }
        return { message: 'Email confirmed successfully' };
    }

    @Post('request-password-reset')
    async requestPasswordReset(@Body() body: { email: string }) {
        return this.userService.requestPasswordReset(body.email);
    }

    @Post('reset-password')
    async resetPassword(@Query('token') token: string, @Body() body: { newPassword: string }) {
        return this.userService.resetPassword(token, body.newPassword);
    }
}