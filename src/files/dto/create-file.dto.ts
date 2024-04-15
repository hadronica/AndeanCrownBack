import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";


export class CreateFileDto {

    @ApiProperty()
    @IsNumber()
    numberDocumentUser:string;

    @ApiProperty()
    @IsString()
    urlStatementAccount:string;

    @ApiProperty()
    @IsString()
    emailUser:string;
}