import { IsString, IsOptional, IsBoolean, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AddressType } from '@prisma/client';

export class CreateAddressDto {
  @ApiProperty({ description: '배송지 타입', enum: AddressType })
  @IsEnum(AddressType)
  type: AddressType;

  @ApiProperty({ description: '수령인 이름' })
  @IsString()
  name: string;

  @ApiProperty({ description: '연락처' })
  @IsString()
  phone: string;

  @ApiProperty({ description: '기본 주소' })
  @IsString()
  address1: string;

  @ApiProperty({ description: '상세 주소', required: false })
  @IsString()
  @IsOptional()
  address2?: string;

  @ApiProperty({ description: '도시' })
  @IsString()
  city: string;

  @ApiProperty({ description: '지역/도', required: false })
  @IsString()
  @IsOptional()
  state?: string;

  @ApiProperty({ description: '우편번호' })
  @IsString()
  postalCode: string;

  @ApiProperty({ description: '국가', default: 'KR' })
  @IsString()
  @IsOptional()
  country?: string = 'KR';

  @ApiProperty({ description: '기본 배송지 여부', default: false })
  @IsBoolean()
  @IsOptional()
  isDefault?: boolean = false;
}
