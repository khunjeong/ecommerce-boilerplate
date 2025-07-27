import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class AddToCartDto {
  @ApiProperty({ description: '상품 ID' })
  @IsString()
  productId: string;

  @ApiProperty({ description: '상품 변형 ID (옵션)', required: false })
  @IsString()
  @IsOptional()
  variantId?: string;

  @ApiProperty({ description: '수량', minimum: 1, maximum: 99 })
  @IsNumber()
  @Min(1)
  @Max(99)
  quantity: number;
}
