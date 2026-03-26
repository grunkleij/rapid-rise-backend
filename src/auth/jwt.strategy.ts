import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request } from "express"; // <-- Make sure to add this import

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(private configService : ConfigService){
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: Request) => {
                    return request?.cookies?.access_token;
                },
            ]),
            ignoreExpiration : false,
            secretOrKey : configService.get<string>('JWT_ACCESS_SECRET')!
        });
    }

    async validate(payload : any){
        return {userId : payload.sub, email: payload.email};
    }
}