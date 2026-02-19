import {ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsNotEmpty, MinLength } from "class-validator"

export class AuthDto{
    @ApiProperty({example:"user@example.com"})
    @IsEmail()
    @IsNotEmpty()
    email: string

    @ApiProperty({example:'password', description: 'Min 8 characters'})
    @IsNotEmpty()
    @MinLength(8,{message: "password must be atleast 8 characters long"})
    password : string


    
}