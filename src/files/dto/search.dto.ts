import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";


export class searchFilesDto{

    @ApiProperty()
    @IsString()
    @IsOptional()
    page:number;

    @ApiProperty()
    @IsString()
    @IsOptional()
    limit:number;

}