import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  ValidateNested,
  Min,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ShippingMethod } from '@prisma/client';

export class OrderItemDto {
  @ApiProperty({ description: '상품 ID' })
  @IsString()
  productId: string;

  @ApiProperty({ description: '수량', minimum: 1 })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({ description: '상품 변형 ID (옵션)', required: false })
  @IsString()
  @IsOptional()
  variantId?: string;
}

export class CreateOrderDto {
  @ApiProperty({ description: '배송지 ID' })
  @IsString()
  shippingAddressId: string;

  @ApiProperty({ description: '청구지 ID' })
  @IsString()
  billingAddressId: string;

  @ApiProperty({ description: '배송 방법', enum: ShippingMethod })
  @IsEnum(ShippingMethod)
  shippingMethod: ShippingMethod;

  @ApiProperty({ description: '주문 메모', required: false })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({ description: '주문 아이템들', type: [OrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}
