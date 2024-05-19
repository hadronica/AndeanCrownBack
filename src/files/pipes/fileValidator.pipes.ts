import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { extname } from "path";

@Injectable()
export class DocFileValidator implements PipeTransform {
  transform(file: Express.Multer.File) {
    const allowedExtensions = ['.docx', '.DOCX','.pdf','.PDF','.doc','.DOC','.jpg','.JPG'];
    const fileExtension = extname(file.originalname);
    
    if (!allowedExtensions.includes(fileExtension)) {
      throw new BadRequestException(`Validation failed (expected type is ${allowedExtensions.join(', ')}`);
    }
    return file;
  }
}