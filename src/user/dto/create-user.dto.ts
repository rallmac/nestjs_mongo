import { IsString, MinLength, IsEmail } from 'class-validator';

export class CreateUserDto {
    @IsString()
    @MinLength(3)
    username: string;

    @IsString()
    @MinLength(6)
    password: string;

    @IsEmail()
    email: string;
}