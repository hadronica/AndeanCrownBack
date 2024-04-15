import { Controller, Get, Post, Body, Param, Put, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-auth.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ValidRoles } from './interfaces/valid-roles';
import { Auth } from './decorators/auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Get('login')
  login(@Body() loginUserDto: LoginUserDto){
    return this.authService.login(loginUserDto);
  }

  @Put('manage')
  @Auth(ValidRoles.admin)
  updateUser(@Body() updateUserDto:UpdateUserDto){
    return this.authService.updateUser(updateUserDto);
  }

  @Put('edit')
  @Auth(ValidRoles.admin,ValidRoles.user)
  update(@Body() updateUserDto:UpdateUserDto){
    return this.authService.update(updateUserDto);
  }

  @Get('verify')
  verifyUser(@Headers('token') token:string,@Body() body){
    return this.authService.verifyUser(token,body);
  }

  @Get('forgot-password')
  forgotPassword(@Body() email:string){
    return this.authService.forgotPassword(email);
  }

  @Put('reset-password')
  resetPassword(@Headers('token') token:string,@Body() body){
    return this.authService.resetPassword(token,body);
  }
}
