import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { User } from './user.entity';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';


@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: MongoRepository<User>,
    ) {}


    async findOne(username: string): Promise<User | null> {
        return this.userRepository.findOneBy({ username });
    }

    async findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    async findByUsername(username: string): Promise<User | null> {
        return this.userRepository.findOneBy({ username });
    }

    async createUser(createUserDto: { username: string; password: string; email: string }): Promise<User> {
        const confirmationToken = uuidv4();
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
        const newUser = this.userRepository.create({ ...createUserDto, password: hashedPassword, isEmailConfirmed: false, confirmationToken, });
        return this.userRepository.save(newUser);
    }


    async validateUser(username: string, plainPassword: string): Promise<any> {
        console.log('Validating user:', username);
        const user = await this.findOne(username);
        console.log('User found:', user);
        if (user && await bcrypt.compare(plainPassword, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        console.log('Invalid credentials');
        return null;
    }

    async changePassword(username: string, oldPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
        const user = await this.findByUsername(username);
        if (!user) {
            return { success: false, message: 'User not found' };
        }
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return { success: false, message: 'Old password is incorrect' };
        }
        const salt = await bcrypt.genSalt();
        user.password = await bcrypt.hash(newPassword, salt);
        await this.userRepository.save(user);
        return { success: true, message: 'Password changed successfully' };
    }

    async confirmEmail(token: string): Promise<User | null> {
        const user = await this.userRepository.findOneBy({ confirmationToken: token });
        if (!user) return null;
        user.isEmailConfirmed = true;
        user.confirmationToken = undefined;
        return this.userRepository.save(user);
    }

    async requestPasswordReset(email: string): Promise<{ success: boolean; message: string }> {
        const user = await this.userRepository.findOneBy({ email });
        if (!user) {
            return { success: false, message: 'User not found' };
        }
        const token = uuidv4();
        user.resetPasswordToken = token;
        user.resetPasswordExpires = new Date(Date.now() + 3600 * 1000);
        await this.userRepository.save(user);

        const transporter = nodemailer.createTransport({
            host: 'smtp.example.com',
            port: 587,
            auth: {
                user: 'your_email@example.com',
                pass: 'your_email_password',
            },
        });

        const resetUrl = `${process.env.CLIENT_BASE_URL}/users/reset-password?token=${token}`;
        await transporter.sendMail({
            to: user.isEmailConfirmed,
            subject: 'Password Reset',
            text: `Reset your password using this link ${resetUrl}`,
        });

        return { success: true, message: 'Password reset email sent' };
    }

    async resetPassword(token: string, newPassword: string): Promise<{ success: boolean; message: string }> {
        const user = await this.userRepository.findOneBy({ resetPasswordToken: token });
        if (!user || !user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
            return { success: false, message: 'Invalid or expired token' };
        }
        const salt = await bcrypt.genSalt();
        user.password = await bcrypt.hash(newPassword, salt);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await this.userRepository.save(user);
        return { success: true, message: 'Password has been reset' };
    }
}