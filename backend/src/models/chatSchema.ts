// Create a schema for conversation history
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ChatDocument extends Document {
  user: mongoose.Types.ObjectId;
  sessionId?: string; // Optional session ID to group conversations
  role: 'user' | 'assistant' | 'system';
  content: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  isDeleted?: boolean;
}

const chatSchema: Schema<ChatDocument> = new Schema(
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

// Compound index for efficient user + session + createdAt queries
chatSchema.index({ user: 1, sessionId: 1, createdAt: -1 });

const Chat: Model<ChatDocument> = mongoose.model<ChatDocument>('Chat', chatSchema);
export default Chat;