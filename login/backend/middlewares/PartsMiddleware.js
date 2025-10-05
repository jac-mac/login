import Part from '../Schema/PartSchema.js'
import {ObjectId} from 'mongodb'

export const findAll = async (req, res, next) => {
  try {
    const parts = await Part.find()
    req.parts = parts
    next()
  }
  catch(error) {
    res.status(500).json({
      success: false,
      mesage: error.message
    })
  }
}

export const findById = async (req, res, next) => {
  const id = ObjectId.createFromHexString(req.params.id)
  try {
    const part = await Part.findById(id)
    if(!part) {
      return res.status(404).json({
        success: false,
        message: `No part found with id ${req.params.id}`
      })
    }
    req.part = part
    next()
  }
  catch(error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const findByName = async (req, res, next) => {
  const modelName = req.params.modelName
  const partName = req.params.partName
  try {
    const part = findPart(modelName, partName)

    if(!part) {
      return res.status(404).json({
        success: false,
        message: `${modelName} ${partName} not found!`
      })
    }
    req.part = part
    next()
  }
  catch(error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const checkDuplicatePart = async (req, res, next) => {
  const modelName = req.body.modelName
  const partName = req.body.partName
  try {
    const part = await findPart(modelName, partName)
    console.log(part)

    if(part) {
      return res.status(40).json({
        success: false,
        message: `${modelName} ${partName} already exists!`
      })
    }
    next()
  }
  catch(error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const addNewPart = async (req, res, next) => {
  if(req.part) {
    return res.status(409).json({
      success: false,
      message: `${req.part.modelName} ${req.part.partName} already exists!`
    })
  }
  try {
    const newPart = new Part({
      modelName: req.body.modelName,
      partName: req.body.partName
    })
    const savedPart = await newPart.save()
    req.savedPart = savedPart
    next()
  }
  catch(error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

const findPart = async (modelName, partName) => {
  try{
    const part = await Part.findOne({
      modelName: modelName,
      partName: partName
    })
    return part
  }
  catch(error) {
    throw new Error(error.message)
  }
}