import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { InternalServerErrorException } from '@nestjs/common/exceptions';


export const GetUser=createParamDecorator(
    (data:string,ctx:ExecutionContext)=>{
        const req=ctx.switchToHttp().getRequest();
        const user=req.user;

        if(!user) throw new InternalServerErrorException('User not found');
        if(!data) return user;
        
        return user[data];
    }
)