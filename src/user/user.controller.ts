import { Controller, Post, Body, Get, Param } from '@nestjs/common';
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

    @Get()
    async findAll() {
        return this.userService.findAll();
    }

    @Get(':username')
    async findByUsername(@Param('username')username: string): Promise<User | null> {
        return this.userService.findByUsername(username);
    }
}