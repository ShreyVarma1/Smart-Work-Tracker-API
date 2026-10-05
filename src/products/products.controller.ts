import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, Patch } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  getProducts (@Query('status') status?: string,
               @Query('title') title?: string,
               @Query('tags') tags?: string,
               @Query('search') search?: string,
               @Query('priority') priority?: string,
               @Query('assignee') assignee?: string
            ) {
    return this.productsService.getProducts(status, title, search, priority, assignee, tags,);
  }

  @Get(':id')
  getProductById(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.getProductById(id);
  }

  @Post()
  createProduct(@Body() product: any) {
    return this.productsService.createProduct(product);
  }

  @Patch(':id')
  updateProduct(@Param('id', ParseIntPipe) id: number, @Body() product: any) {
    return this.productsService.updateProduct(id, product);
  }

  @Delete(':id')
  deleteProduct(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.deleteProduct(id);
  }
}


