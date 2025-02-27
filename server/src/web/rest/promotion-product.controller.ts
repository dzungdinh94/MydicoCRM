import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post as PostMethod,
  Put,
  UseGuards,
  Req,
  UseInterceptors,
  Res
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request, Response } from 'express';
import PromotionProduct from '../../domain/promotion-product.entity';
import { PromotionProductService } from '../../service/promotion-product.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, PermissionGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { Like } from 'typeorm';

@Controller('api/promotion-products')
@UseGuards(AuthGuard, RolesGuard, PermissionGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
export class PromotionProductController {
  logger = new Logger('PromotionProductController');

  constructor(private readonly promotionProductService: PromotionProductService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: PromotionProduct
  })
  async getAll(@Req() req: Request, @Res() res): Promise<PromotionProduct[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const filter = {};
    Object.keys(req.query).forEach(item => {
      if (item !== 'page' && item !== 'size' && item !== 'sort' && item !== 'dependency') {
        filter[item] = Like(`%${req.query[item]}%`);
      }
    });
    const [results, count] = await this.promotionProductService.findAndCount({
      skip: 0,
      take: 100,
      order: pageRequest.sort.asOrder(),
      where: {
        ...filter
      }
    });
    HeaderUtil.addPaginationHeaders(req, res, new Page(results, count, pageRequest));
    return res.send(results);
  }

  @Get('/many')
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: PromotionProduct
  })
  async getAllAtOnce(@Req() req: Request, @Res() res): Promise<PromotionProduct[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this.promotionProductService.findManyByManyId(JSON.parse(req.query.ids as string));
    HeaderUtil.addPaginationHeaders(req, res, new Page(results, count, pageRequest));
    return res.send(results);
  }

  @Get('/:id')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: PromotionProduct
  })
  async getOne(@Param('id') id: string, @Res() res: Response): Promise<Response> {
    return res.send(await this.promotionProductService.findById(id));
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: PromotionProduct
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Res() res: Response, @Body() promotionProduct: PromotionProduct): Promise<Response> {
    const created = await this.promotionProductService.save(promotionProduct);
    HeaderUtil.addEntityCreatedHeaders(res, 'PromotionProduct', created.id);
    return res.send(created);
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: PromotionProduct
  })
  async put(@Res() res: Response, @Body() promotionProduct: PromotionProduct): Promise<Response> {
    HeaderUtil.addEntityCreatedHeaders(res, 'PromotionProduct', promotionProduct.id);
    return res.send(await this.promotionProductService.update(promotionProduct));
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async remove(@Res() res: Response, @Param('id') id: string): Promise<PromotionProduct> {
    HeaderUtil.addEntityDeletedHeaders(res, 'PromotionProduct', id);
    const toDelete = await this.promotionProductService.findById(id);
    return await this.promotionProductService.delete(toDelete);
  }
}
