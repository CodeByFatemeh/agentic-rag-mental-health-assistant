import mongoose, { Schema, Model } from 'mongoose';
import { IUser } from '../types/index.js';

const userSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    chats: [{ type: Schema.Types.ObjectId, ref: 'Chat', default: [] }],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);
export default User;
export { userSchema };