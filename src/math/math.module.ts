import { Module } from "@nestjs/common";
import { MathController } from "./math.controller";
import { AuthModule } from "../auth/auth.module";


@Module({
    imports : [AuthModule],
    controllers : [MathController],

})
export class MathModule{}