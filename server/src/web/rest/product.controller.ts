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
  Res,
  CacheInterceptor,
  CacheTTL
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request, Response } from 'express';
import Product from '../../domain/product.entity';
import { ProductService } from '../../service/product.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, PermissionGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { Equal, Like } from 'typeorm';

@Controller('api/products')
@UseGuards(AuthGuard, RolesGuard, PermissionGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
export class ProductController {
  logger = new Logger('ProductController');

  constructor(private readonly productService: ProductService) {}

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: Product
  })
  async getAll(@Req() req: Request, @Res() res): Promise<Product[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    let filter: any = [];
    Object.keys(req.query).forEach(item => {
      if (item !== 'page' && item !== 'size' && item !== 'sort' && item !== 'dependency' && item !== 'status') {
        filter.push({ [item]: Like(`%${req.query[item]}%`) });
      }
    });
    if (filter.length === 0) {
      if (req.query['status']) {
        filter['status'] = req.query['status'];
      }
    } else {
      if (req.query['status']) {
        filter[filter.length - 1]['status'] = req.query['status'];
      }
    }
    const [results, count] = await this.productService.findAndCount({
      skip: +pageRequest.page * pageRequest.size,
      take: +pageRequest.size,
      order: pageRequest.sort.asOrder(),
      where: filter
    });
    HeaderUtil.addPaginationHeaders(req, res, new Page(results, count, pageRequest));
    return res.send(results);
  }

  @Get('/:id')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: Product
  })
  async getOne(@Param('id') id: string, @Res() res): Promise<Product> {
    return res.send(await this.productService.findById(id));
  }

  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: Product
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Res() res: Response, @Body() product: Product): Promise<Response> {
    const created = await this.productService.save(product);
    HeaderUtil.addEntityCreatedHeaders(res, 'Product', created.id);
    return res.send(created);
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: Product
  })
  async put(@Res() res: Response, @Body() product: Product): Promise<Response> {
    HeaderUtil.addEntityUpdatedHeaders(res, 'Product', product.id);
    return res.send(await this.productService.update(product));
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async remove(@Res() res: Response, @Param('id') id: string): Promise<Product> {
    HeaderUtil.addEntityDeletedHeaders(res, 'Product', id);
    const toDelete = await this.productService.findById(id);
    return await this.productService.delete(toDelete);
  }
}
