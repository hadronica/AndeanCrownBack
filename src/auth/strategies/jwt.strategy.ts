import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "../entities/user.entity";
import { JwtPayload } from "../interfaces/jwt-interface";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from "typeorm";
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common/exceptions';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        configService:ConfigService
    ){
        super({
            secretOrKey:configService.get('JWT_SECRET'),
            jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
        })
    }

    async validate(payload:JwtPayload):Promise<User>{
        const {user_id}=payload;
        const user=await this.userRepository.findOneBy({user_id});

        if(!user)throw new UnauthorizedException('Invalid token');
        if(user.status!==0)throw new UnauthorizedException('User is not active');

        return user;
    }
}