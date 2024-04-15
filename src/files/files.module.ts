import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from './entities/file.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [FilesController],
  providers: [FilesService],
  imports:[
    AuthModule,
    ConfigModule,
    TypeOrmModule.forFeature([File]),
  ],
  exports:[TypeOrmModule]
})
export class FilesModule {}
