import { IsNumber, IsString } from "class-validator";


export class CreateFileDto {

    @IsNumber()
    document:number;

    @IsString()
    urlStatementAccount:string;

    @IsString()
    emailUser:string;
}