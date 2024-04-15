import { IsEmail, IsIn, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateUserDto {
    @IsString()
    @IsOptional()
    full_name:string;

    @IsString()
    phone:string;

    @IsString()
    @IsEmail()
    email:string;

    @IsString()
    document_type:string;

    @IsNumber()
    document:number;

    @IsString()
    @IsIn(['J','N'])
    @IsOptional()
    type_account:string;
    
    @IsOptional()
    user_id?:string;

    @IsOptional()
    token:string;

    @IsString()
    @IsIn(['User','Admin'])
    roles:string;

    @IsString()
    @IsOptional()
    legal_representation:string;

    @IsNumber()
    @IsIn([0,1,2])
    @IsOptional()
    status:number;
}
