import { Body, Controller, Delete, Get, Headers, HttpCode, Post, Put, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FilesService } from './files.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ValidRoles } from 'src/auth/interfaces/valid-roles';
import { CreateFileDto } from './dto/create-file.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocFileValidator } from './pipes/fileValidator.pipes';
import { searchFilesDto } from './dto/search.dto';

@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('list')
  @ApiResponse({status:200,description:'List of files'})
  @ApiResponse({status:500,description:'Internal server error'})
  @Auth(ValidRoles.admin,ValidRoles.superadmin)
  findAll(@Body() searchFilesDto:searchFilesDto) {
    return this.filesService.findAll(searchFilesDto);
  }

  @Post('download')
  @ApiResponse({status:201,description:'File downloaded successfully'})
  @ApiResponse({status:500,description:'Internal server error'})
  @Auth(ValidRoles.user)
  download(@Body('file_id') file_id:string){
    return this.filesService.downloadS3(file_id);
  }

  @Post('upload')
  @HttpCode(200)
  @ApiResponse({status:200,description:'File uploaded successfully'})
  @ApiResponse({status:500,description:'Internal server error'})
  @Auth(ValidRoles.admin,ValidRoles.superadmin)
  @UseInterceptors(FileInterceptor('file'))
  upload(@Body() createFileDto:CreateFileDto, @UploadedFile( new DocFileValidator()) file: Express.Multer.File){
    return this.filesService.uploadS3(createFileDto, file);
  }

  @Post('find')
  @Auth(ValidRoles.user)
  @ApiResponse({status:200,description:'List of files'})
  @ApiResponse({status:500,description:'Internal server error'})
  find(@Headers('user_id') user_id:string,@Body() searchFilesDto:searchFilesDto){
    return this.filesService.find(user_id,searchFilesDto);
  }

  @Put('delete')
  @Auth(ValidRoles.admin,ValidRoles.superadmin)
  @ApiResponse({status:200,description:'File deleted successfully'})
  @ApiResponse({status:500,description:'Internal server error'})
  delete(@Body('file_id') file_id:string){
    return this.filesService.delete(file_id);
  }

}
