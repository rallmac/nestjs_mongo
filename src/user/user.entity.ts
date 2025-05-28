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

    @Column({ unique: true, nullable: false })
    email: string;

    @Column({ default: false })
    isEmailConfirmed: boolean;
    confirmationToken?: string;

    @Column({ nullable: true })
    resetPasswordToken?: string;

    @Column({ nullable: true })
    resetPasswordExpires?: Date;
}