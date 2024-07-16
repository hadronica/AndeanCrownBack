import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { File } from '../../files/entities/file.entity';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    user_id:string;
    
    @Column('varchar',{
        nullable:true,
    })
    names:string;

    @Column('varchar',{
        nullable:true,
    })
    legal_representation:string;

    @Column('varchar')
    phone:string;

    @Column('varchar',{
        unique:true,
    })
    email:string;
    
    @Column('varchar',{
        unique:true,
    })
    document:string;
    
    @Column('varchar')
    document_type:string;

    @Column('int',{
        default:1,
    })
    status:number;

    @Column('varchar',{
        default:'User',
    })
    roles:string;

    @Column('varchar',{
        select:false,
        default:null,
    })
    password:string;

    @Column('varchar',{
        nullable:true, 
    })
    type_account:string;
    
    @Column('varchar',{
        nullable:true,
    })
    token:string;

    @Column('timestamp',{
        nullable:true,
    })
    token_expire:Date;

    @Column('timestamp',{
        default:()=> 'CURRENT_TIMESTAMP - INTERVAL 5 HOUR', 
    })
    created_at:Date;

    @Column('timestamp',{
        nullable:true,
    })
    last_login:Date;

    @Column('varchar',{
        nullable:true,
    })
    alias:string;

    @OneToMany(
        ()=> File,
        file=>file.user,
        {
            cascade:true
        }
    )
    file?:File;

}
