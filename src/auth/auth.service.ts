import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {  Between, ILike, Like, Raw, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-auth.dto';
import { User } from './entities/user.entity';
import { BadRequestException, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common/exceptions';
import { compareSync, hashSync } from "bcrypt";
import { LoginUserDto } from './dto/login-user.dto';
import { JwtPayload } from './interfaces/jwt-interface';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { customAlphabet } from 'nanoid';
import { CreateUserMail } from './utility/createUserMail';
import { restartPasswordMail } from './utility/restartPasswordMail';
import { searchUsersDto } from './dto/search-users.dto';
import { ChangeProfileDto } from './dto/change-auth.dto';
import { FilesService } from '../files/files.service';
import { DeleteObjectCommand, ListObjectsV2Command, S3Client } from '@aws-sdk/client-s3';

@Injectable()
export class AuthService {
  private AWS_S3_BUCKET = process.env.AWS_S3_BUCKET;
    private s3 = new S3Client({
        region:process.env.AWS_S3_REGION,
        credentials:{
            accessKeyId:process.env.AWS_S3_ACCESS_KEY_ID,
            secretAccessKey:process.env.AWS_S3_SECRET_ACCESS_KEY
        }
  })
  private alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService:JwtService,
    private readonly mailerService:MailerService,
  ){}

  async findAll(searchUsersDto:searchUsersDto) {
    try {
      const page = searchUsersDto.page ?? 1;
      const limit = searchUsersDto.limit ?? 10;
      const users = await this.userRepository.find({
        select:{password:false},
        where:{
          roles:'User',
          document: searchUsersDto.numberDocument ? Like(`%${searchUsersDto.numberDocument}%`) : null,
          status:searchUsersDto.status?searchUsersDto.status:null,
          names: searchUsersDto.names ? ILike(`%${searchUsersDto.names}%`) : null,
          created_at:searchUsersDto.dateCreation
            ? Raw(alias => `DATE(${alias}) = '${searchUsersDto.dateCreation}'`)
            : null
        },
        skip: (page - 1) * limit,
        take: limit,
      });

      const total=await this.userRepository.count({
        where:{
          roles:'User',
          document: searchUsersDto.numberDocument ? Like(`%${searchUsersDto.numberDocument}%`) : null,
          status:searchUsersDto.status?searchUsersDto.status:null,
          names: searchUsersDto.names ? ILike(`%${searchUsersDto.names}%`) : null,
          created_at:searchUsersDto.dateCreation
            ? Raw(alias => `DATE(${alias}) = '${searchUsersDto.dateCreation}'`)
            : null
        }
      })

      const pages = Math.ceil(total / limit);
      return {
        users,
        total,
        pages
        };
    } catch (error) {
      this.handleErrors(error,'findAll');
    }
  }
  
  async create(createUserDto: CreateUserDto) {
    try {
      const {...userData}=createUserDto;
      const tokenVerification=customAlphabet(this.alphabet,10)();
      const user=this.userRepository.create({
        names:userData.names,
        phone:userData.phone,
        email:userData.email,
        document_type:userData.typeDocument,
        document:userData.numberDocument,
        type_account:userData.typeAccount,
        roles:userData.permissionAccount,
        token:tokenVerification,
        legal_representation:userData.legalRepresentation,
        alias:userData.alias,
        status:1
      });
      await this.userRepository.save(user);
      const url= `${process.env.CONFIRMATION_URL}?token=${tokenVerification}` 

      await this.mailerService.sendMail({
        from:process.env.MAIL_USER,
        to:user.email,
        subject:'Andean Crown SAF ha creado tu cuenta',
        html:CreateUserMail(userData.names?userData.names:userData.legalRepresentation,url)
      })
      return {
        message:'User created successfully',
      };
      
    } catch (error) {
      this.handleErrors(error,'create')
    }
  }

  async resendVerification(user_id:string){
    try {
      const user=await this.userRepository.findOne({
        where:{user_id}
      });
      if(!user){
        throw new UnauthorizedException('User not found');
      }
      const tokenVerification=customAlphabet(this.alphabet,10)();
      await this.userRepository.update(user.user_id,{token:tokenVerification});
      const url= `${process.env.CONFIRMATION_URL}?token=${tokenVerification}` 

      await this.mailerService.sendMail({
        from:process.env.MAIL_USER,
        to:user.email,
        subject:'Andean Crown SAF ha creado tu cuenta',
        html:CreateUserMail(user.names?user.names:user.legal_representation,url)
      })
      return {
        message:'Verification email sent successfully',
      };
    } catch (error) {
      this.handleErrors(error,'resendVerification');
    }
  }

  async login(loginUserDto: LoginUserDto){
    try {
      const{password,email}=loginUserDto;
      const user= await this.userRepository.findOne({
        where:{email},
        select:{password:true,user_id:true,status:true}
      });
      if(!user){
        throw new UnauthorizedException('Invalid credentials');
      }
      if(!compareSync(password,user.password)){
        throw new UnauthorizedException('Invalid credentials');
      }
      if(user.status!==0){
        throw new UnauthorizedException('User is inactive');
      }
      const lastLogin= new Date();
      lastLogin.setTime(lastLogin.getTime() - (5 * 60 * 60 * 1000));
      await this.userRepository.update(user.user_id,{last_login:lastLogin})
      const response= await this.userRepository.findOne({
        where:{email},
        select:{password:false,token_expire:false,token:false}
      });
      return {
        ...response,
        token:this.getJwtToken({user_id:user.user_id})
      };

    } catch (error) {
      this.handleErrors(error,'login');
    }
  }

  async verifyUser(token:string,body:any){
    try {
      const {password,repeatPassword}=body;
      const user=await this.userRepository.findOne({
        where:{token}
      });
      if(!user){
        throw new UnauthorizedException('Invalid token');
      }
      if(user.token!==token){
        throw new UnauthorizedException('Invalid token');
      }
      if(password!==repeatPassword){
        throw new UnauthorizedException('Passwords do not match');
      }
      await this.userRepository.update(user.user_id,{
        password:hashSync(password,10),
        token:null,
        status:0
      });
      return {
        message:'User verified successfully',
        email:user.email,
        token:this.getJwtToken({user_id:user.user_id})
      };
    } catch (error) {
      this.handleErrors(error,'verifyUser');
    }
  }

  async blockUser(user_id:string) {
    try {
      const user=await this.userRepository.findOne({
        where:{user_id}
      });
      if(!user){
        throw new UnauthorizedException('User not found');
      }
      await this.userRepository.update(user.user_id,{status:2})
      return {
        message:'User deleted successfully'
      };
    } catch (error) {
      this.handleErrors(error,'delete');
    }
  }

  async unblockUser(user_id:string) {
    try {
      const user=await this.userRepository.findOne({
        where:{user_id}
      });
      if(!user){
        throw new UnauthorizedException('User not found');
      }
      await this.userRepository.update(user.user_id,{status:1})
      return {
        message:'User unblocked successfully'
      };
    } catch (error) {
      this.handleErrors(error,'unblock');
    }
  }

  async delete(user_id:string) {
    try {
      const user=await this.userRepository.findOne({
        where:{user_id}
      });
      if(!user){
        throw new UnauthorizedException('User not found');
      }
      const params = {
        Bucket:this.AWS_S3_BUCKET,
        Key:`${user.document_type}${user.document}-${user.names?user.names:user.legal_representation}`,
      }
      const resp= await this.s3.send(new ListObjectsV2Command(params));
      const objects=resp.Contents;
      for (const object of objects) {
        const deleteObj = new DeleteObjectCommand({
          Bucket:this.AWS_S3_BUCKET,
          Key:object.Key
        });
        await this.s3.send(deleteObj);
      }
      //await this.userRepository.delete(user.user_id);
      return {
        message:'User deleted successfully'	
      };
    } catch (error) {
      this.handleErrors(error,'delete');
    }
  }

  async forgotPassword(body){
    try {
      const {...userData}=body;
      const user=await this.userRepository.findOne({
        where:{email:userData.email}
      });
      if(!user){
        throw new UnauthorizedException('User not found');
      }
      const token=customAlphabet(this.alphabet,10)();
      const tokenExpiration=new Date(Date.now()+300000);
      await this.userRepository.update(user.user_id,{token,token_expire:tokenExpiration});
      await this.mailerService.sendMail({
        from:process.env.MAIL_USER,
        to:user.email,
        subject:'Andean Crown - Recuperación de contraseña',
        html:restartPasswordMail(user.names?user.names:user.legal_representation,`${process.env.RECOVERY_URL}?token=${token}`)
      })
      return {
        message:'Token sent successfully'
      };
    } catch (error) {
      this.handleErrors(error,'forgotPassword');
    }
  }

  async resetPassword(token:string,body:any){
    try {
      const {password,passwordConfirmed}=body;
      const user=await this.userRepository.findOne({
        where:{token}
      });
      if(!user){
        throw new UnauthorizedException('Invalid token');
      }
      if(user.token!==token){
        throw new UnauthorizedException('Invalid token');
      }
      if(user.token_expire.getTime()<Date.now()){
        throw new UnauthorizedException('Token expired');
      }
      if(password!==passwordConfirmed){
        throw new UnauthorizedException('Passwords do not match');
      }
      await this.userRepository.update(user.user_id,{
        password:hashSync(password,10),
        token:null,
        token_expire:null
      });
      return {
        message:'User verified successfully',
        email:user.email,
        token:this.getJwtToken({user_id:user.user_id})
      };
    } catch (error) {
      this.handleErrors(error,'resetPassword');
    }
  }

  async editUser(userData:User,updateUserDto: UpdateUserDto){
    try {
      const {password}=updateUserDto;
      const user=await this.userRepository.findOne({
        where:{user_id:userData.user_id}
      });
      if(!user){
        throw new UnauthorizedException('User not found');
      }
      await this.userRepository.update(user.user_id,{
        password:hashSync(password,10)
      });
      return {
        message:'Password edited successfully'
      };
    } catch (error) {
      this.handleErrors(error,'editUser');
    }
  }

  async changeProfile(changeProfileDto:ChangeProfileDto){
    try {
        const {user_id,...userData}=changeProfileDto;
        const user=await this.userRepository.findOne({where:{user_id}});
        if(!user){
          throw new UnauthorizedException('User not found');
        }
        await this.userRepository.update(user.user_id,{
          names:userData.names,
          phone:userData.phone,
          email:userData.email,
          document_type:userData.typeDocument,
          document:userData.numberDocument,
          legal_representation:userData.legalRepresentation,
          alias:userData.alias,
          type_account:userData.typeAccount,
          roles:userData.permissionAccount
        });
        return {
          message:'Profile changed successfully'
          };
    } catch (error) {
      this.handleErrors(error,'changeProfile');
    }
  }


  private getJwtToken(payload:JwtPayload){
    const token=this.jwtService.sign(payload);
    return token;
  }

  private handleErrors(error: any,type:string):never{
    if(error.code==='23505'){
      throw new BadRequestException(`USER already exists`)
    }
    if(error.status===401){
      throw new UnauthorizedException(error.message);
    }
    throw new InternalServerErrorException(`Something went wrong at ${type}`)
  }
}
