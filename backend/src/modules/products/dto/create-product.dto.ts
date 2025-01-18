import {
  IsString,
  IsNumber,
  IsBoolean,
  IsArray,
  IsOptional,
  ValidateNested,
  IsDate,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';

class BasicInfoDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsNumber()
  price: number;

  @IsBoolean()
  @IsOptional()
  negotiable: boolean = true;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images: string[] = [];

  @IsOptional()
  @IsString()
  video?: string;

  @IsOptional()
  @IsString()
  virtualTour?: string;
}

class LocationCoordinatesDto {
  @IsNumber()
  @IsOptional()
  lat: number = 0;

  @IsNumber()
  @IsOptional()
  lng: number = 0;
}

class LocationSurroundingsDto {
  @IsBoolean()
  @IsOptional()
  parking: boolean = false;

  @IsBoolean()
  @IsOptional()
  temple: boolean = false;

  @IsBoolean()
  @IsOptional()
  restaurant: boolean = false;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  transportation: string[] = [];
}

class LocationDto {
  @IsString()
  cemetery: string;

  @IsString()
  address: string;

  @IsString()
  city: string;

  @IsString()
  district: string;

  @ValidateNested()
  @Type(() => LocationCoordinatesDto)
  @IsOptional()
  coordinates: LocationCoordinatesDto = new LocationCoordinatesDto();

  @ValidateNested()
  @Type(() => LocationSurroundingsDto)
  @IsOptional()
  surroundings: LocationSurroundingsDto = new LocationSurroundingsDto();
}

class FengShuiDto {
  @IsString()
  @IsOptional()
  orientation: string = '';

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  environment: string[] = [];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  features: string[] = [];
}

class FeaturesDto {
  @IsString()
  type: string;

  @IsString()
  size: string;

  @IsString()
  facing: string;

  @IsNumber()
  floor: number;

  @IsString()
  religion: string;

  @ValidateNested()
  @Type(() => FengShuiDto)
  @IsOptional()
  feng_shui: FengShuiDto = new FengShuiDto();
}

class LegalInfoDto {
  @IsString()
  registrationNumber: string;

  @IsString()
  @IsOptional()
  ownershipCertificate: string = '';

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  propertyRights: string[] = [];

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  expiryDate?: Date;

  @IsBoolean()
  @IsOptional()
  transferable: boolean = true;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  restrictions: string[] = [];
}

class VerificationDto {
  @IsEnum(['pending', 'verified', 'rejected'])
  @IsOptional()
  status: 'pending' | 'verified' | 'rejected' = 'pending';

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  documents: string[] = [];
}

export class CreateProductDto {
  @ValidateNested()
  @Type(() => BasicInfoDto)
  basicInfo: BasicInfoDto;

  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;

  @ValidateNested()
  @Type(() => FeaturesDto)
  features: FeaturesDto;

  @ValidateNested()
  @Type(() => LegalInfoDto)
  legalInfo: LegalInfoDto;

  @ValidateNested()
  @Type(() => VerificationDto)
  @IsOptional()
  verification?: VerificationDto = new VerificationDto();

  @IsEnum(['draft', 'published', 'reserved', 'sold', 'deleted'])
  @IsOptional()
  status?: 'draft' | 'published' | 'reserved' | 'sold' | 'deleted' = 'draft';
}

export class UpdateProductDto extends CreateProductDto {}
