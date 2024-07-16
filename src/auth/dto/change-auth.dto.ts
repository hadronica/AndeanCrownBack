import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsIn, IsOptional, IsString } from 'class-validator';

export class ChangeProfileDto {
    @ApiProperty()
    @IsString()
    @IsOptional()
    names:string;

    @ApiProperty()
    @IsEmail()
    @IsOptional()
    email:string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    phone:string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    typeDocument:string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    numberDocument:string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    legalRepresentation:string;

    @ApiProperty()
    @IsString()
    user_id:string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    alias:string;

    @ApiProperty({example:'J|N'})
    @IsString()
    @IsIn(['J','N'])
    @IsOptional()
    typeAccount:string;

    @ApiProperty({example:'User|Admin|SuperAdmin'})
    @IsString()
    @IsOptional()
    @IsIn(['User','Admin','SuperAdmin'])
    permissionAccount:string;

}
