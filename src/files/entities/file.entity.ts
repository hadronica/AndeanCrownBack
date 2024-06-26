import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from '../../auth/entities/user.entity';


@Entity('files')
export class File{
    @PrimaryGeneratedColumn('uuid')
    file_id:string;

    @Column('timestamp',{
        default:()=> 'CURRENT_TIMESTAMP - INTERVAL 5 HOUR'
    })
    created_At:Date;

    @Column('varchar')
    path:string;
    
    @Column('varchar')
    name:string;

    @Column('int',{
        default:0
    })
    downloaded:number;

    @Column('timestamp',{
        nullable:true
    })
    last_downloaded:Date;

    @Column('varchar',{
        nullable:true
    })
    investment_type:string;

    @ManyToOne(
        ()=>User,
        (user)=>user.file

    )
    @JoinColumn({name:'user_id'})
    user:User
}