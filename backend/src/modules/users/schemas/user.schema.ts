import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, enum: ['buyer', 'seller'] })
  role: string;

  @Prop({
    type: {
      name: String,
      phone: String,
      avatar: String,
      identityVerified: { type: Boolean, default: false },
      realNameVerified: { type: Boolean, default: false },
      documents: {
        identity: [String],
        ownership: [String],
      },
    },
  })
  profile: {
    name: string;
    phone: string;
    avatar: string;
    identityVerified: boolean;
    realNameVerified: boolean;
    documents: {
      identity: string[];
      ownership: string[];
    };
  };

  @Prop({
    type: {
      religions: [String],
      priceRange: {
        min: Number,
        max: Number,
      },
      locations: [String],
    },
  })
  preferences: {
    religions: string[];
    priceRange: {
      min: number;
      max: number;
    };
    locations: string[];
  };

  @Prop({
    type: {
      loginAttempts: { type: Number, default: 0 },
      lockUntil: Date,
      lastLogin: Date,
      lastPasswordChange: Date,
    },
  })
  security: {
    loginAttempts: number;
    lockUntil: Date;
    lastLogin: Date;
    lastPasswordChange: Date;
  };

  @Prop({
    type: {
      listings: { type: Number, default: 0 },
      matches: { type: Number, default: 0 },
      views: { type: Number, default: 0 },
    },
  })
  statistics: {
    listings: number;
    matches: number;
    views: number;
  };

  @Prop({ default: 'active', enum: ['active', 'suspended'] })
  status: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
