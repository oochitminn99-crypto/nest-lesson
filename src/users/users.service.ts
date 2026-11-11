import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { RegisterDto } from "./dto/register.dto";
import * as bcrypt from 'bcrypt';
import { LoginDto } from "./dto/login.dto";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService
    ) { }

    async register(registerDto: RegisterDto) {
        const existingUser = await this.userRepository.findOne({
            where: {email: registerDto.email}
        })

        if(existingUser) {
            throw new ConflictException('Email already registered')
        }

        const hashedPassword = await bcrypt.hash(
            registerDto.password,
            10
        )

        const user = this.userRepository.create({
            name: registerDto.name,
            email: registerDto.email,
            password: hashedPassword
        })

        const savedUser = await this.userRepository.save(user);
        const { password, ...result } = savedUser;
        return {
            message: "User Registered Successfully!",
            user: result
        }
    } 
    
    async login(loginDto: LoginDto) {
        const user = await this.userRepository.createQueryBuilder('user')
        .addSelect('user.password')
        .where('user.email = :email', {
            email: loginDto.email
        }).getOne()

        if (!user) {
            throw new UnauthorizedException(
                "Invalid Email or Password"
            );
        }

        const isPasswordValid = await bcrypt.compare(
            loginDto.password,
            user.password
        )

        if (!isPasswordValid) {
            throw new UnauthorizedException(
                'Invalid Email or Password'
            )
        }

        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role
        }
        const accessToken = await this.jwtService.signAsync(payload)
        //console.log("Access Token: ", accessToken)

        return {
            message: "Login Successfully",
            access_token: accessToken,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        }
    }
}