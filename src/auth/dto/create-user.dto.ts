import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsIn, IsNumber, IsOptional, IsString, isString } from "class-validator";

export class CreateUserDto {

    @ApiProperty()
    @IsString()
    @IsOptional()
    names:string;

    @ApiProperty()
    @IsString()
    phone:string;

    @ApiProperty()
    @IsString()
    @IsEmail()
    email:string;

    @ApiProperty()
    @IsString()
    typeDocument:string;

    @ApiProperty()
    @IsString()
    numberDocument:string;

    @ApiProperty({example:'J|N'})
    @IsString()
    @IsIn(['J','N'])
    @IsOptional()
    typeAccount:string;
    
    @IsOptional()
    user_id?:string;

    @IsOptional()
    token:string;

    @ApiProperty({example:'User|Admin|SuperAdmin'})
    @IsString()
    @IsIn(['User','Admin','SuperAdmin'])
    permissionAccount:string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    legalRepresentation:string;

    @ApiProperty({default:1})
    @IsNumber()
    @IsIn([0,1,2])
    @IsOptional()
    status:number;

    @ApiProperty()
    @IsString()
    @IsOptional()
    alias:string;

}
