import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
import { FilesService } from './files.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ValidRoles } from 'src/auth/interfaces/valid-roles';
import { CreateFileDto } from './dto/create-file.dto';
import { ApiHeader, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get('list')
  @ApiResponse({status:200,description:'List of files'})
  @ApiResponse({status:500,description:'Internal server error'})
  @Auth(ValidRoles.admin)
  findAll() {
    return this.filesService.findAll();
  }

  @Get('download')
  @Auth(ValidRoles.user)
  download(){
    return this.filesService.download();
  }

  @Post('upload')
  @ApiResponse({status:201,description:'file...'})
  @ApiResponse({status:500,description:'Internal server error'})
  @Auth(ValidRoles.admin)
  upload(@Body() createFileDto:CreateFileDto){
    return this.filesService.upload(createFileDto);
  }

  @Get('find')
  @Auth(ValidRoles.user)
  @ApiResponse({status:200,description:'List of files'})
  @ApiResponse({status:500,description:'Internal server error'})
  find(@Headers('user_id') user_id:string){
    return this.filesService.find(user_id);
  }

}
