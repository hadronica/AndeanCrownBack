import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService,JwtStrategy],
  imports:[
    ConfigModule,
    TypeOrmModule.forFeature([User]),
    PassportModule.register({defaultStrategy:'jwt'}),
    JwtModule.registerAsync({
      useFactory:()=>{
          return{
            secret:process.env.JWT_SECRET,
            signOptions:{
            expiresIn:'10d'
           }
          }
      },
    })
  ],
  exports:[TypeOrmModule,JwtStrategy,PassportModule,JwtModule]
})
export class AuthModule {}
