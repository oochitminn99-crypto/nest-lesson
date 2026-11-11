import { Module } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { User } from "./user.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { JwtAuthGuard } from "../auth/jwt-auth/jwt-auth.guard";
import { RolesGuard } from "../auth/jwt-auth/roles.guard";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            User
        ]),
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const secret = configService.get<string>("JWT_SECRET");
                if(!secret) {
                    throw new Error('JWT secret is not configure')
                }
                return {
                    secret,
                    signOptions: {
                        expiresIn: '15m',
                    }
                }
            }
        })
    ],
    controllers: [UsersController],
    providers: [
        UsersService,
        JwtAuthGuard,
        RolesGuard
    ],
    exports: [TypeOrmModule]
})
export class UsersModule{

}