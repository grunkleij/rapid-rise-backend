import { BadRequestException, Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { MathDto } from "./math.dto";


@ApiTags('Arithmetic operations')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('math')
export class MathController {

    @Post('add')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Add two numbers' })
    add(@Body() body: MathDto) {
        return { result: body.a + body.b };
    }

    @Post('subtract')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Subtract two numbers' })
    subtract(@Body() body: MathDto) {
        return { result: body.a - body.b }
    }

    @Post('multiply')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Multiply two numbers' })
    multiply(@Body() body: MathDto) {
        return { result: body.a * body.b }
    }

    @Post('divide')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Divide two numbers' })
    divide(@Body() body: MathDto) {
        if (body.b === 0) {
            throw new BadRequestException('Cannot divide by zero');
        }
        return { result: body.a / body.b }
    }

}