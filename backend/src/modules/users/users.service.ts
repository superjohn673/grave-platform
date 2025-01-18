import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from './schemas/user.schema';
import { CreateUserDto, UpdateProfileDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, password, role, name, phone } = createUserDto;

    // Check if user already exists
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Hash password with salt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = new this.userModel({
      email,
      password: hashedPassword,
      role,
      profile: {
        name,
        phone,
        avatar: '',
        identityVerified: false,
        realNameVerified: false,
        documents: {
          identity: [],
          ownership: [],
        },
      },
      preferences: {
        religions: [],
        priceRange: {
          min: 0,
          max: 0,
        },
        locations: [],
      },
      security: {
        loginAttempts: 0,
        lastLogin: new Date(),
        lastPasswordChange: new Date(),
      },
      statistics: {
        listings: 0,
        matches: 0,
        views: 0,
      },
      status: 'active',
    });

    return user.save();
  }

  async findByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email });
  }

  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateProfile(
    userId: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<User> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.profile) {
      user.profile = {
        ...user.profile,
        ...updateProfileDto,
      };
    } else {
      user.profile = {
        name: updateProfileDto.name,
        phone: updateProfileDto.phone,
        avatar: '',
        identityVerified: false,
        realNameVerified: false,
        documents: {
          identity: [],
          ownership: [],
        },
      };
    }

    return user.save();
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.findByEmail(email);
    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    // Update last login
    user.security = {
      ...user.security,
      lastLogin: new Date(),
      loginAttempts: 0,
    };
    await user.save();

    return user;
  }
}
