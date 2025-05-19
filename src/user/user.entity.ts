import { Entity, ObjectIdColumn, Column } from 'typeorm';
import { ObjectId } from 'mongodb';


@Entity()
export class User {
    @ObjectIdColumn()
    id: ObjectId;


    @Column()
    username: string;

    @Column()
    password: string;
}