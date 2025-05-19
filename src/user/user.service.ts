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

    async create(username: string, password: string): Promise<User> {
        const hashed = await bcrypt.hash(password, 10);
        const newUser = this.userRepository.create({ username, password: hashed });
        return this.userRepository.save(newUser);
    }


    async validateUser(username: string, plainPassword: string): Promise<any> {
        const user = await this.findOne(username);
        if (user && await bcrypt.compare(plainPassword, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }
}