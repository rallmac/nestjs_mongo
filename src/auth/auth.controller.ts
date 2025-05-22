import { Controller, Post, Request, UseGuards, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

   // @UseGuards(LocalAuthGuard)
   // @Post('login')
    //async login(@Body() loginDto: { username: string, password: string }) {
        //return this.authService.login(loginDto);
    //}

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req) {
        return req.user;
    }
}