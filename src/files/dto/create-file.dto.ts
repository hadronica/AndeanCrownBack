import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";


export class CreateFileDto {

    @ApiProperty()
    @IsString()
    numberDocumentUser:string;

    @ApiProperty()
    @IsString()
    emailUser:string;

    @ApiProperty()
    @IsString()
    nameDocument:string;

    @ApiProperty()
    @IsString()
    tipoInversion:string;
}