import { IsEmail, IsIn, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateUserDto {
    @IsString()
    @IsOptional()
    names:string;

    @IsString()
    phone:string;

    @IsString()
    @IsEmail()
    email:string;

    @IsString()
    typeDocument:string;

    @IsNumber()
    numberDocument:string;

    @IsString()
    @IsIn(['J','N'])
    @IsOptional()
    typeAccount:string;
    
    @IsOptional()
    user_id?:string;

    @IsOptional()
    token:string;

    @IsString()
    @IsIn(['User','Admin'])
    permissionAccount:string;

    @IsString()
    @IsOptional()
    legalRepresentation:string;

    @IsNumber()
    @IsIn([0,1,2])
    @IsOptional()
    status:number;
}
