// Just used as backup ******
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IResource extends Document {
  id: number;
  title: string;
  content: string;
  source: string;
  category: string;
  url?: string;
}

const resourceSchema: Schema<IResource> = new Schema(
  {
    id: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    source: { type: String, required: true },
    category: { type: String, required: true },
    url: { type: String }
  },
  {
    timestamps: true, // Add createdAt and updatedAt fields
    versionKey: false // Disable __v field
  }
);

const Resource: Model<IResource> = mongoose.model<IResource>('Resource', resourceSchema);
export default Resource;
