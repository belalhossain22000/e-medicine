import mongoose, { Document, Schema, Model } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../../utils/config';

export const USER_ROLE = {
  superAdmin: 'superAdmin',
  user: 'user',
  admin: 'admin',
} as const;


export type TUserRole = keyof typeof USER_ROLE;

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: string;
  photo?: string;
  isEmailVerified: boolean;
  // eslint-disable-next-line no-unused-vars
  comparePassword: (password: string) => Promise<boolean>;
  generateAuthToken: () => string;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'super admin'],
      default: 'user',
    },
    photo: {
      type: String,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
UserSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Generate JWT
UserSchema.methods.generateAuthToken = function (): string {
  return jwt.sign(
    { id: this._id, role: this.role },
    config.jwt_access_secret as string,
    {
      expiresIn: '1h',
    },
  );
};

const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema);

export default User;
