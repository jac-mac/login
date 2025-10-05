import mongoose from 'mongoose'

const PartSchema = new mongoose.Schema({
  modelName: String,
  partName: String,
})

export default mongoose.model('part', PartSchema)