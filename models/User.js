import mongoose from 'mongoose'
import bcrypt, { hash } from 'bcrypt'
import { uniqueId } from '../utils/index.js'

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true
  },
  token: {
    type: String,
    default: () => uniqueId()
  },
  verified: {
    type: Boolean,
    default: false
  },
  admin: {
    type: Boolean,
    default: false
  }
})

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next()
  }
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

userSchema.methods.checkPassword = async function (inputPassowrd) {
  return await bcrypt.compare(inputPassowrd, this.password)
}

const User = mongoose.model('User', userSchema)

export default User