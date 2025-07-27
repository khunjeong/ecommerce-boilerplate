import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@ApiTags('장바구니')
@Controller('cart')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: '장바구니 조회' })
  @ApiResponse({ status: 200, description: '장바구니 조회 성공' })
  async getCart(@Request() req) {
    return this.cartService.getCart(req.user.id);
  }

  @Post()
  @ApiOperation({ summary: '장바구니에 상품 추가' })
  @ApiResponse({ status: 201, description: '상품 추가 성공' })
  @ApiResponse({ status: 400, description: '잘못된 요청' })
  @ApiResponse({ status: 404, description: '상품을 찾을 수 없음' })
  async addToCart(@Request() req, @Body() addToCartDto: AddToCartDto) {
    return this.cartService.addToCart(req.user.id, addToCartDto);
  }

  @Put(':id')
  @ApiOperation({ summary: '장바구니 아이템 수정' })
  @ApiResponse({ status: 200, description: '수정 성공' })
  @ApiResponse({ status: 400, description: '잘못된 요청' })
  @ApiResponse({ status: 404, description: '아이템을 찾을 수 없음' })
  async updateCartItem(
    @Request() req,
    @Param('id') itemId: string,
    @Body() updateCartItemDto: UpdateCartItemDto,
  ) {
    return this.cartService.updateCartItem(
      req.user.id,
      itemId,
      updateCartItemDto,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: '장바구니에서 상품 제거' })
  @ApiResponse({ status: 200, description: '제거 성공' })
  @ApiResponse({ status: 404, description: '아이템을 찾을 수 없음' })
  async removeFromCart(@Request() req, @Param('id') itemId: string) {
    return this.cartService.removeFromCart(req.user.id, itemId);
  }

  @Delete()
  @ApiOperation({ summary: '장바구니 비우기' })
  @ApiResponse({ status: 200, description: '장바구니 비우기 성공' })
  async clearCart(@Request() req) {
    return this.cartService.clearCart(req.user.id);
  }
}
