import { IsOptional, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class AddToWishlistDto {
  @ApiProperty({ description: '상품 ID' })
  @IsString()
  productId: string;

  @ApiProperty({ description: '상품 변형 ID (옵션)', required: false })
  @IsString()
  @IsOptional()
  variantId?: string;
}
