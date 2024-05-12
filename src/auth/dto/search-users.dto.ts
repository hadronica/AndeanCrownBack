import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsNumber, IsOptional, IsString } from "class-validator";


export class searchUsersDto{

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
    dateCreation:Date;

    @ApiProperty()
    @IsString()
    @IsOptional()
    numberDocument:string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    names:string;

    @IsString()
    @IsIn(["0","1","2"])
    @IsOptional()
    status:number;
}