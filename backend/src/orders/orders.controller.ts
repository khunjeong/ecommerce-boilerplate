import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { QueryOrderDto } from './dto/query-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('주문')
@Controller('orders')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: '주문 생성' })
  @ApiResponse({
    status: 201,
    description: '주문이 성공적으로 생성되었습니다.',
  })
  @ApiResponse({ status: 400, description: '잘못된 요청입니다.' })
  create(@Request() req, @Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.createOrder(req.user.id, createOrderDto);
  }

  @Get()
  @ApiOperation({ summary: '주문 목록 조회' })
  @ApiResponse({
    status: 200,
    description: '주문 목록을 성공적으로 조회했습니다.',
  })
  findAll(@Request() req, @Query() query: QueryOrderDto) {
    return this.ordersService.findAll(req.user.id, query);
  }

  @Get(':id')
  @ApiOperation({ summary: '주문 상세 조회' })
  @ApiResponse({ status: 200, description: '주문을 성공적으로 조회했습니다.' })
  @ApiResponse({ status: 404, description: '주문을 찾을 수 없습니다.' })
  findOne(@Request() req, @Param('id') id: string) {
    return this.ordersService.findOne(req.user.id, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '주문 상태 업데이트' })
  @ApiResponse({
    status: 200,
    description: '주문이 성공적으로 업데이트되었습니다.',
  })
  @ApiResponse({ status: 404, description: '주문을 찾을 수 없습니다.' })
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.ordersService.updateOrder(req.user.id, id, updateOrderDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '주문 취소' })
  @ApiResponse({
    status: 200,
    description: '주문이 성공적으로 취소되었습니다.',
  })
  @ApiResponse({ status: 404, description: '주문을 찾을 수 없습니다.' })
  cancel(@Request() req, @Param('id') id: string) {
    return this.ordersService.cancelOrder(req.user.id, id);
  }
}
