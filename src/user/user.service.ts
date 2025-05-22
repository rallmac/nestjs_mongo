import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';


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

    async createUser(createUserDto: { username: string; password: string }): Promise<User> {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
        const newUser = this.userRepository.create({ ...createUserDto, password: hashedPassword });
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
}