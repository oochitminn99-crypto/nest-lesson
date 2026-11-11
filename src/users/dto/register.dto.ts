import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class RegisterDto {

    @IsString()
    @IsNotEmpty({message: "Name is Required"})
    @MinLength(3, {message: 'Password must be at least 3 Characters'})
    @MaxLength(20)
    name!: string;

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