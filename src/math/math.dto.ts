import { ApiProperty } from "@nestjs/swagger";

export class MathDto{
    @ApiProperty({example:5})
    a : number

    @ApiProperty({example:10})
    b : number

}