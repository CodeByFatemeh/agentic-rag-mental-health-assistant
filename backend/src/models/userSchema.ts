import mongoose, { Schema, Document, Model } from 'mongoose'

export interface UserDocument extends Document {
  name: string
  email: string
  password: string
  chats: mongoose.Types.ObjectId[]
  createdAt: Date
  updatedAt: Date
}

// Define the Mongoose schema
const userSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    chats: [{ type: Schema.Types.ObjectId, ref: 'Chat' }],
  },
  {
    timestamps: true,
    versionKey: false // Hide __v
  }
)

const User: Model<UserDocument> = mongoose.model<UserDocument>('User', userSchema)
export default User
