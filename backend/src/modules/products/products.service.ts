import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './schemas/product.schema';
import { CreateProductDto, UpdateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
  ) {}

  async create(
    userId: string,
    createProductDto: CreateProductDto,
  ): Promise<Product> {
    try {
      // 將 DTO 扁平化為符合 Schema 的格式
      const flattenedData = {
        sellerId: userId,
        'basicInfo.title': createProductDto.basicInfo.title,
        'basicInfo.description': createProductDto.basicInfo.description,
        'basicInfo.price': createProductDto.basicInfo.price,
        'basicInfo.negotiable': createProductDto.basicInfo.negotiable,
        'basicInfo.images': createProductDto.basicInfo.images || [],
        'basicInfo.video': createProductDto.basicInfo.video,
        'basicInfo.virtualTour': createProductDto.basicInfo.virtualTour,

        'location.cemetery': createProductDto.location.cemetery,
        'location.address': createProductDto.location.address,
        'location.city': createProductDto.location.city,
        'location.district': createProductDto.location.district,
        'location.coordinates.lat':
          createProductDto.location.coordinates?.lat || 0,
        'location.coordinates.lng':
          createProductDto.location.coordinates?.lng || 0,
        'location.surroundings.parking':
          createProductDto.location.surroundings?.parking || false,
        'location.surroundings.temple':
          createProductDto.location.surroundings?.temple || false,
        'location.surroundings.restaurant':
          createProductDto.location.surroundings?.restaurant || false,
        'location.surroundings.transportation':
          createProductDto.location.surroundings?.transportation || [],

        'features.type': createProductDto.features.type,
        'features.size': createProductDto.features.size,
        'features.facing': createProductDto.features.facing,
        'features.floor': createProductDto.features.floor,
        'features.religion': createProductDto.features.religion,
        'features.feng_shui.orientation':
          createProductDto.features.feng_shui?.orientation || '',
        'features.feng_shui.environment':
          createProductDto.features.feng_shui?.environment || [],
        'features.feng_shui.features':
          createProductDto.features.feng_shui?.features || [],

        'legalInfo.registrationNumber':
          createProductDto.legalInfo.registrationNumber,
        'legalInfo.ownershipCertificate':
          createProductDto.legalInfo.ownershipCertificate || '',
        'legalInfo.propertyRights':
          createProductDto.legalInfo.propertyRights || [],
        'legalInfo.expiryDate': createProductDto.legalInfo.expiryDate,
        'legalInfo.transferable':
          createProductDto.legalInfo.transferable ?? true,
        'legalInfo.restrictions': createProductDto.legalInfo.restrictions || [],

        status: createProductDto.status || 'draft',

        'statistics.views': 0,
        'statistics.favorites': 0,
        'statistics.compares': 0,
        'statistics.inquiries': 0,
      };

      const product = new this.productModel(flattenedData);
      return await product.save();
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  async findAll(query: any = {}) {
    const {
      page = 1,
      limit = 10,
      minPrice,
      maxPrice,
      city,
      district,
      type,
      religion,
      status = 'published',
    } = query;

    const filter: any = { status };

    if (minPrice || maxPrice) {
      filter['basicInfo.price'] = {};
      if (minPrice) filter['basicInfo.price'].$gte = Number(minPrice);
      if (maxPrice) filter['basicInfo.price'].$lte = Number(maxPrice);
    }

    if (city) filter['location.city'] = city;
    if (district) filter['location.district'] = district;
    if (type) filter['features.type'] = type;
    if (religion) filter['features.religion'] = religion;

    const total = await this.productModel.countDocuments(filter);
    const products = await this.productModel
      .find(filter)
      .populate('sellerId', 'profile.name profile.phone')
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    return {
      data: products,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productModel
      .findById(id)
      .populate('sellerId', 'profile.name profile.phone');

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async update(
    userId: string,
    productId: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.productModel.findById(productId);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.sellerId.toString() !== userId) {
      throw new ForbiddenException(
        'You do not have permission to update this product',
      );
    }

    Object.assign(product, updateProductDto);
    return product.save();
  }

  async remove(userId: string, productId: string): Promise<void> {
    const product = await this.productModel.findById(productId);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.sellerId.toString() !== userId) {
      throw new ForbiddenException(
        'You do not have permission to delete this product',
      );
    }

    product.status = 'deleted';
    await product.save();
  }

  async findBySeller(sellerId: string, query: any = {}) {
    const { page = 1, limit = 10, status } = query;
    const filter: any = { sellerId };

    if (status) {
      filter.status = status;
    }

    const total = await this.productModel.countDocuments(filter);
    const products = await this.productModel
      .find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    return {
      data: products,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
    };
  }

  async updateStatus(
    productId: string,
    status: 'published' | 'reserved' | 'sold' | 'deleted',
  ): Promise<Product> {
    const product = await this.productModel.findById(productId);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    product.status = status;
    return product.save();
  }
}
