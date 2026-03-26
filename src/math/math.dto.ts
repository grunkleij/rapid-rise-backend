import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class MathDto{
    @ApiProperty({example:5})
    @IsNotEmpty({ message: 'a is required' })
    @IsNumber({}, { message: 'a must be a number' })
    a : number

    @ApiProperty({example:10})
    @IsNotEmpty({ message: 'b is required' })
    @IsNumber({}, { message: 'b must be a number' })
    b : number

}