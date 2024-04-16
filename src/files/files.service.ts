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

    async findAll() {
        try {
            const files = await this.userRepository.find({relations:['file'],where:{roles:'User'}});
            return files;
        } catch (error) {
            this.handleErrors(error,'findAll');
        }
    }

    async find(user_id:string){
        try {
            const files = await this.fileRepository.find({where:{user:{user_id}}});
            return files;
        } catch (error) {
            console.log(error);
            this.handleErrors(error,'find');
        }
    }

    async downloaded(file_id:string){
        try {
            const file = await this.fileRepository.findOne({where:{file_id}});
            if(!file){
                throw new InternalServerErrorException('File not found');
            }

            await this.fileRepository.update({file_id},{downloaded:file.downloaded+1});
            return file;
        } catch (error) {
            this.handleErrors(error,'downloaded');
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
            const {numberDocumentUser,urlStatementAccount,emailUser} = createFileDto;
            const user = await this.userRepository.findOne({where:{document:numberDocumentUser,email:emailUser}});
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
