import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { FilesModule } from './files/files.module';
@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      //url: process.env.DB_URL,
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USER,
      database: process.env.DB_DATABASE,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true,
      logging: true,
      ssl:process.env.STAGE==='prod',
      extra:{
        ssl:process.env.STAGE==='prod'?{rejectUnauthorized:false}:null
  
      }
    }),
    MailerModule.forRoot({
      transport:{
        host: process.env.MAIL_HOST,
        port: +process.env.MAIL_PORT,
        service:'outlook',
        secure:false,
        auth:{
          user:process.env.MAIL_USER,
          pass:process.env.MAIL_PASS,
        },
        tls:{
          rejectUnauthorized:false
        }
      },      
    }),
    AuthModule,
    FilesModule
  ],
  
})

export class AppModule {}
