import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Product extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
  sellerId: User;

  // Basic Info
  @Prop({ required: true })
  'basicInfo.title': string;

  @Prop({ required: true })
  'basicInfo.description': string;

  @Prop({ required: true })
  'basicInfo.price': number;

  @Prop({ default: true })
  'basicInfo.negotiable': boolean;

  @Prop({ type: [String], default: [] })
  'basicInfo.images': string[];

  @Prop()
  'basicInfo.video': string;

  @Prop()
  'basicInfo.virtualTour': string;

  // Location
  @Prop({ required: true })
  'location.cemetery': string;

  @Prop({ required: true })
  'location.address': string;

  @Prop({ required: true })
  'location.city': string;

  @Prop({ required: true })
  'location.district': string;

  @Prop({ type: Number, default: 0 })
  'location.coordinates.lat': number;

  @Prop({ type: Number, default: 0 })
  'location.coordinates.lng': number;

  @Prop({ type: Boolean, default: false })
  'location.surroundings.parking': boolean;

  @Prop({ type: Boolean, default: false })
  'location.surroundings.temple': boolean;

  @Prop({ type: Boolean, default: false })
  'location.surroundings.restaurant': boolean;

  @Prop({ type: [String], default: [] })
  'location.surroundings.transportation': string[];

  // Features
  @Prop({ required: true })
  'features.type': string;

  @Prop({ required: true })
  'features.size': string;

  @Prop({ required: true })
  'features.facing': string;

  @Prop({ required: true })
  'features.floor': number;

  @Prop({ required: true })
  'features.religion': string;

  @Prop({ default: '' })
  'features.feng_shui.orientation': string;

  @Prop({ type: [String], default: [] })
  'features.feng_shui.environment': string[];

  @Prop({ type: [String], default: [] })
  'features.feng_shui.features': string[];

  // Legal Info
  @Prop({ required: true })
  'legalInfo.registrationNumber': string;

  @Prop({ default: '' })
  'legalInfo.ownershipCertificate': string;

  @Prop({ type: [String], default: [] })
  'legalInfo.propertyRights': string[];

  @Prop()
  'legalInfo.expiryDate': Date;

  @Prop({ default: true })
  'legalInfo.transferable': boolean;

  @Prop({ type: [String], default: [] })
  'legalInfo.restrictions': string[];

  // Verification
  @Prop({
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending',
  })
  'verification.status': string;

  @Prop({ type: [String], default: [] })
  'verification.documents': string[];

  @Prop()
  'verification.verifiedAt': Date;

  @Prop({ type: MongooseSchema.Types.ObjectId })
  'verification.verifier': MongooseSchema.Types.ObjectId;

  @Prop()
  'verification.notes': string;

  // Status
  @Prop({
    type: String,
    enum: ['draft', 'published', 'reserved', 'sold', 'deleted'],
    default: 'draft',
  })
  status: string;

  // Statistics
  @Prop({ default: 0 })
  'statistics.views': number;

  @Prop({ default: 0 })
  'statistics.favorites': number;

  @Prop({ default: 0 })
  'statistics.compares': number;

  @Prop({ default: 0 })
  'statistics.inquiries': number;

  @Prop()
  'statistics.lastViewed': Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
