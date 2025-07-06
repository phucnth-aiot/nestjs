import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dtos/create-user.dtos";
import { UserUpdateDto } from "./dtos/user-update.dtos";
import { Repository } from 'typeorm';
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "./entities/users.entity";
import { UserDto } from "./dtos/user.dto";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepo: Repository<UserEntity>,
    ) {}

    findAll(){
        return this.userRepo.find();
    }

    async findOne(phone: string){
        return await this.userRepo.findOne({ where: { phone } });
    }

    create(CreateUserDto: CreateUserDto){
        // return `User created ${JSON.stringify(CreateUserDto)}`
        const user = this.userRepo.create(CreateUserDto);
        return this.userRepo.save(user);
    }

    async update(userid: string,UserUpdateDto: UserUpdateDto){
        // return `User ${userid} updated ${JSON.stringify(UserUpdateDto)}`
        await this.userRepo.update(userid, UserUpdateDto);
        return this.userRepo.findOne({ where: { userid } });
    }

    async delete(userid: string){
        // return `user id: ${userid} deleted ${JSON.stringify(UserDeleteDto)}`
        await this.userRepo.delete(userid);
        return { deleted: true };
    }

    async updateRefreshToken(userid: string, refreshToken: string): Promise<void>{
        await this.userRepo.update(userid, { refreshToken });
    }

    async findById(userid: string) {
        return this.userRepo.findOneBy({ userid });
    }
}
