import express from 'express'
const partRouter = express.Router()
import Part from '../Schema/PartSchema.js'
import {findAll, findById, findByName, addNewPart, checkDuplicatePart} from '../middlewares/PartsMiddleware.js'

partRouter.get('/', findAll, async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Parts found.',
    data: req.parts
  })
})

partRouter.get('/:id', findById, async (req, res) => {
  res.status(200).json({
    success: true,
    message: `Found part with id ${req.params.id}`,
    data: req.part
  })
})

partRouter.get('/:modelName/:partName', findByName, (req, res) => {
  res.status(200).json({
    success: true,
    message: `${req.savedPart.modelName} ${req.savedPart.partName} found!`,
    data: req.savedPart
  })
})

partRouter.post('/', checkDuplicatePart, addNewPart, async (req, res) => {
  res.status(201).json({
    success: true,
    message: `Successfully added ${req.part.modelName} ${req.part.partName} to database.`,
    data: req.savedPart
  })
})

partRouter.delete('/:id', findById, async (req, res) => {
  const part = req.part
  try {
    const deletedPart = await Part.deleteOne({
      _id: part._id
    })
    res.status(200).json({
      success: true,
      message: `Successfully deleted part with id ${part._id}`,
      data: deletedPart
    })
  }
  catch(error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
})

export {partRouter}