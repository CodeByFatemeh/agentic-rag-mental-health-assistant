import mongoose, { Schema, Model } from 'mongoose';
import { IChat } from '../types/index.js';

const chatSchema: Schema<IChat> = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    sessionId: {
      type: String,
      index: true,
      default: null,
    },
    role: {
      type: String,
      enum: ['user', 'assistant', 'system'],
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 10000,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

chatSchema.index({ user: 1, sessionId: 1, createdAt: -1 });

const Chat: Model<IChat> = mongoose.model<IChat>('Chat', chatSchema);
export default Chat;