import {
  Controller,
  Get,
  Post,
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
import { WishlistService } from './wishlist.service';
import { AddToWishlistDto } from './dto/add-to-wishlist.dto';

@ApiTags('위시리스트')
@Controller('wishlist')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get()
  @ApiOperation({ summary: '위시리스트 조회' })
  @ApiResponse({ status: 200, description: '위시리스트 조회 성공' })
  async getWishlist(@Request() req) {
    return this.wishlistService.getWishlist(req.user.id);
  }

  @Post()
  @ApiOperation({ summary: '위시리스트에 상품 추가' })
  @ApiResponse({ status: 201, description: '상품 추가 성공' })
  @ApiResponse({ status: 400, description: '잘못된 요청' })
  @ApiResponse({ status: 404, description: '상품을 찾을 수 없음' })
  async addToWishlist(
    @Request() req,
    @Body() addToWishlistDto: AddToWishlistDto,
  ) {
    return this.wishlistService.addToWishlist(req.user.id, addToWishlistDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '위시리스트에서 상품 제거' })
  @ApiResponse({ status: 200, description: '제거 성공' })
  @ApiResponse({ status: 404, description: '아이템을 찾을 수 없음' })
  async removeFromWishlist(@Request() req, @Param('id') itemId: string) {
    return this.wishlistService.removeFromWishlist(req.user.id, itemId);
  }

  @Delete()
  @ApiOperation({ summary: '위시리스트 비우기' })
  @ApiResponse({ status: 200, description: '위시리스트 비우기 성공' })
  async clearWishlist(@Request() req) {
    return this.wishlistService.clearWishlist(req.user.id);
  }

  @Get('check/:productId')
  @ApiOperation({ summary: '상품이 위시리스트에 있는지 확인' })
  @ApiResponse({ status: 200, description: '확인 성공' })
  async checkWishlist(@Request() req, @Param('productId') productId: string) {
    const isInWishlist = await this.wishlistService.isInWishlist(
      req.user.id,
      productId,
    );
    return { isInWishlist };
  }
}
