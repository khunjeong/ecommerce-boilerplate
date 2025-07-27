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
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AddressesService } from './addresses.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('배송지')
@Controller('addresses')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Post()
  @ApiOperation({ summary: '배송지 생성' })
  @ApiResponse({
    status: 201,
    description: '배송지가 성공적으로 생성되었습니다.',
  })
  @ApiResponse({ status: 400, description: '잘못된 요청입니다.' })
  create(@Request() req, @Body() createAddressDto: CreateAddressDto) {
    return this.addressesService.create(req.user.id, createAddressDto);
  }

  @Get()
  @ApiOperation({ summary: '배송지 목록 조회' })
  @ApiResponse({
    status: 200,
    description: '배송지 목록을 성공적으로 조회했습니다.',
  })
  findAll(@Request() req) {
    return this.addressesService.findAll(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: '배송지 상세 조회' })
  @ApiResponse({
    status: 200,
    description: '배송지를 성공적으로 조회했습니다.',
  })
  @ApiResponse({ status: 404, description: '배송지를 찾을 수 없습니다.' })
  findOne(@Request() req, @Param('id') id: string) {
    return this.addressesService.findOne(req.user.id, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '배송지 수정' })
  @ApiResponse({
    status: 200,
    description: '배송지가 성공적으로 수정되었습니다.',
  })
  @ApiResponse({ status: 404, description: '배송지를 찾을 수 없습니다.' })
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateAddressDto: UpdateAddressDto,
  ) {
    return this.addressesService.update(req.user.id, id, updateAddressDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '배송지 삭제' })
  @ApiResponse({
    status: 200,
    description: '배송지가 성공적으로 삭제되었습니다.',
  })
  @ApiResponse({ status: 404, description: '배송지를 찾을 수 없습니다.' })
  remove(@Request() req, @Param('id') id: string) {
    return this.addressesService.remove(req.user.id, id);
  }

  @Patch(':id/default')
  @ApiOperation({ summary: '기본 배송지 설정' })
  @ApiResponse({
    status: 200,
    description: '기본 배송지가 성공적으로 설정되었습니다.',
  })
  @ApiResponse({ status: 404, description: '배송지를 찾을 수 없습니다.' })
  setDefault(@Request() req, @Param('id') id: string) {
    return this.addressesService.setDefault(req.user.id, id);
  }
}
