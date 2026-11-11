import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class LoginDto {

    @IsEmail({}, {message: "Please enter a valid email"})
    @IsNotEmpty({message: "Email is Required"})
    @MinLength(5, {message: 'Password must be at least 5 Characters'})
    @MaxLength(50)
    email!: string;

    @IsString()
    @IsNotEmpty({message: "Password is Required"})
    @MinLength(5, {message: 'Password must be at least 5 Characters'})
    @MaxLength(20)
    password!: string;
}