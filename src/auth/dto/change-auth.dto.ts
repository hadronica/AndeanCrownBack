import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

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

}
