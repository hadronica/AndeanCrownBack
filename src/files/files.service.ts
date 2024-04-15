import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { File } from './entities/file.entity';
import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { CreateFileDto } from './dto/create-file.dto';

@Injectable()
export class FilesService {

    constructor(
        @InjectRepository(File)
        private readonly fileRepository: Repository<File>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ){}

    findAll() {
        try {
            const files = this.userRepository.find({relations:['file'],where:{roles:'user'}});
            return files;
        } catch (error) {
            this.handleErrors(error,'findAll');
        }
    }

    download() {
        try {
            return 'This action downloads a file';
        } catch (error) {
            this.handleErrors(error,'download');
        }
    }

    async upload(createFileDto:CreateFileDto) {
        try {
            const {document,urlStatementAccount,emailUser} = createFileDto;
            const user = await this.userRepository.findOne({where:{document:document}});
            if(!user){
                throw new InternalServerErrorException('User not found');
            }
            const file=this.fileRepository.create({
                path:urlStatementAccount,
                user:user
            });
            await this.fileRepository.save(file);
            return file;

        } catch (error) {
            this.handleErrors(error,'upload');
        }
    }


    private handleErrors(error: any,type:string):never{
        console.log(error);
        throw new InternalServerErrorException(`Something went wrong at ${type}`)
      }
}
