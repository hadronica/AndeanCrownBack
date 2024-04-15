import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
import { FilesService } from './files.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ValidRoles } from 'src/auth/interfaces/valid-roles';
import { CreateFileDto } from './dto/create-file.dto';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get('list')
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
  @Auth(ValidRoles.admin)
  upload(@Body() createFileDto:CreateFileDto){
    return this.filesService.upload(createFileDto);
  }

  @Get('find')
  @Auth(ValidRoles.user)
  find(@Headers('user_id') user_id:string){
    return this.filesService.find(user_id);
  }

}
