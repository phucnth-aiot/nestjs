import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { LoginDto } from '../dto/login.dto';

@Injectable()
export class AuthLocal extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService){
        super({
            usernameField: 'phone',
            passwordField: 'password',
        });
    }

    async validate(phone: string, password: string){
        const user = await this.authService.validateUser({ phone, password });
        console.log('có nahy vào trong này ');
        
        if(!user)
            throw new UnauthorizedException('invalid user');
        return user;
    }
}