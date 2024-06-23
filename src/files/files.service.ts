import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { File } from './entities/file.entity';
import { Repository } from 'typeorm';
import { User } from '../auth/entities/user.entity';
import { CreateFileDto } from './dto/create-file.dto';
import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { searchFilesDto } from './dto/search.dto';

@Injectable()
export class FilesService {
    private AWS_S3_BUCKET = process.env.AWS_S3_BUCKET;
    private s3 = new S3Client({
        region:process.env.AWS_S3_REGION,
        credentials:{
            accessKeyId:process.env.AWS_S3_ACCESS_KEY_ID,
            secretAccessKey:process.env.AWS_S3_SECRET_ACCESS_KEY
        }
    })
    constructor(
        @InjectRepository(File)
        private readonly fileRepository: Repository<File>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ){}

    async uploadS3(createFileDto:CreateFileDto, file:Express.Multer.File) {
        try {
            const {numberDocumentUser,emailUser,nameDocument,tipoInversion} = createFileDto;
            const user = await this.userRepository.findOne({where:{document:numberDocumentUser,email:emailUser}});

            if(!user){
                throw new InternalServerErrorException('User not found');
            }
            
            const {mimetype,buffer} = file;

            const params = {
                Bucket:this.AWS_S3_BUCKET,
                Key:`${user.document_type}${user.document}-${user.names?user.names:user.legal_representation}/${user.document_type}${user.document}-${nameDocument}-${tipoInversion}`,
                Body:buffer,
                ContentType:mimetype
            }
            
            const fileDB=this.fileRepository.create({
                path:`${process.env.AWS_S3_URL}${encodeURIComponent(params.Key)}`,
                name:nameDocument,
                investment_type:tipoInversion,
                user:user
            });
            await this.fileRepository.save(fileDB);

            const upload= new PutObjectCommand(params);
            await this.s3.send(upload);
            return 'File uploaded successfully';
        } catch (error) {
            this.handleErrors(error,'uploadS3');
        }
    }

    async downloadS3(file_id:string) {
        try {
            const file = await this.fileRepository.findOne({where:{file_id},relations:['user']});
            if(!file){
                throw new InternalServerErrorException('File not found');
            }
            const lastDownloaded= new Date();
            lastDownloaded.setTime(lastDownloaded.getTime() - (5 * 60 * 60 * 1000));
            await this.fileRepository.update({file_id},
                {   downloaded:file.downloaded+1,
                    last_downloaded:lastDownloaded
                });
            return 'File downloaded successfully';
        } catch (error) {
            this.handleErrors(error,'downloadS3');
        }
    }

    async findAll(searchFilesDto:searchFilesDto) {
        try {
            const page = searchFilesDto.page ?? 1;
            const limit = searchFilesDto.limit ?? 10;
            const files = await this.userRepository.find({relations:['file'],where:{
                roles:'User'
            },
            skip: (page - 1) * limit,
            take: limit,
            select:{
                password:false,token_expire:false,token:false
            },order:{file:{created_At:'ASC'}}});

            const countFiles= await this.fileRepository.count();

            return {files,countFiles};
        } catch (error) {
            this.handleErrors(error,'findAll');
        }
    }

    async find(user_id:string,searchFilesDto:searchFilesDto){
        try {
            const files = await this.fileRepository.find({where:{
                user:{user_id}  
            },
            skip:searchFilesDto.page?searchFilesDto.page:0,
            take:searchFilesDto.limit?searchFilesDto.limit:10,
            order:{created_At:'ASC'}});
            
            const countFiles= await this.fileRepository.count({where:{user:{user_id}}});

            return {files,countFiles};
        } catch (error) {
            this.handleErrors(error,'find');
        }
    }

    async delete(file_id:string){
        try {
            const user = await this.userRepository.findOne({where:{file:{file_id}},relations:['file']});
            if(!user){
                throw new InternalServerErrorException('File not found');
            }
            await this.fileRepository.delete({file_id});
            const params = {
                Bucket:this.AWS_S3_BUCKET,
                Key:`${user.document_type}${user.document}-${user.names?user.names:user.legal_representation}/${user.document_type}${user.document}-${user.file[0].name}-${user.file[0].investment_type}`,
            }
            const deleteObj = new DeleteObjectCommand(params)
            await this.s3.send(deleteObj);
            return 'File deleted successfully';
        } catch (error) {
            console.log(error);
            this.handleErrors(error,'delete');
        }   
    }


    private handleErrors(error: any,type:string):never{
        if(error.status===500){
            throw new InternalServerErrorException(error.response.message);
        }
        throw new InternalServerErrorException(`Something went wrong at ${type}`)
      }
}
