import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsOptional, IsString } from "class-validator";


export class searchFilesDto{

    @ApiProperty()
    @IsString()
    @IsOptional()
    page:number;

    @ApiProperty()
    @IsString()
    @IsOptional()
    limit:number;

    @ApiProperty()
    @IsString()
    @IsOptional()
    @IsIn(['1','3','6'])
    lastFiles:number;

    @ApiProperty()
    @IsString()
    @IsOptional()
    user:string;
}