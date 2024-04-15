import { IsNumber, IsString } from "class-validator";


export class CreateFileDto {

    @IsNumber()
    numberDocumentUser:string;

    @IsString()
    urlStatementAccount:string;

    @IsString()
    emailUser:string;
}