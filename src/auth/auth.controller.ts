import { Controller, Get, Post, Body, Param, Put, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-auth.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ValidRoles } from './interfaces/valid-roles';
import { Auth } from './decorators/auth.decorator';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('list')
  @Auth(ValidRoles.admin)
  findAll() {
    return this.authService.findAll();
  }

  @Post('register')
  @ApiResponse({status:201,description:'User created successfully'})
  @ApiResponse({status:400,description:'USER already exists'})
  @ApiResponse({status:500,description:'Internal server error'})
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  @ApiResponse({status:201,description:'User info...'})
  @ApiResponse({status:401,description:'Invalid credentials'})
  @ApiResponse({status:401,description:'User is inactive'})
  @ApiResponse({status:500,description:'Internal server error'})
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

  @Post('verify')
  @ApiResponse({status:201,description:'User verified successfully'})
  @ApiResponse({status:401,description:'Invalid token'})
  @ApiResponse({status:500,description:'Internal server error'})
  verifyUser(@Headers('Token') token:string,@Body() body){
    return this.authService.verifyUser(token,body);
  }

  @Post('forgot-password')
  @ApiResponse({status:201,description:'Token sent successfully'})
  @ApiResponse({status:401,description:'User not found'})
  @ApiResponse({status:500,description:'Internal server error'})
  forgotPassword(@Body() email:string){
    return this.authService.forgotPassword(email);
  }

  @Put('reset-password')
  @ApiResponse({status:201,description:'Password reset successfully'})
  @ApiResponse({status:401,description:'Invalid token'})
  @ApiResponse({status:401,description:'Token expired'})
  @ApiResponse({status:500,description:'Internal server error'})
  resetPassword(@Headers('Token') token:string,@Body() body){
    return this.authService.resetPassword(token,body);
  }
}
