import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from '../../auth/entities/user.entity';


@Entity('files')
export class File{
    @PrimaryGeneratedColumn('uuid')
    file_id:string;

    @Column('timestamp',{
        default:()=> 'CURRENT_TIMESTAMP'
    })
    created_At:Date;

    @Column('varchar')
    path:string;
    
    @Column('int',{
        default:0
    })
    downloaded:number;

    @ManyToOne(
        ()=>User,
        (user)=>user.file

    )
    @JoinColumn({name:'user_id'})
    user:User
}