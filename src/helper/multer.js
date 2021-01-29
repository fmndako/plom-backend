const multer = require('multer')
const path = require('path')
const fs = require('fs')

const directory = './public/uploads/'
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|PNG|JPG|JPEG/
  const mimetype = filetypes.test(file.mimetype)
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase())

  if (!mimetype && !extname) {
    req.fileValidationError = 'Only images  with .png, .jpeg .jpg extention are allowed'

    return cb(new Error({ message: 'Only images  with .png, .jpeg .jpg extention are allowed' }), false)
  }

  return cb(null, true)
}

const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename (_req, file, cb) {
    cb(null, `${file.originalname.replace(/\s/g, '').split('.')[0]}${Date.now()}${path.extname(file.originalname)}`)
  }
})
const remove = async (file, checker) => {
  try {
    if (file !== checker) {
      fs.unlinkSync(`${directory}${file}`)
    }
  } catch (error) {
    console.log(error)
  }
}

const uploadHnadler = multer({ fileFilter, storage }).single('file')
const upload = function (req, res, next) {
  uploadHnadler(req, res, () => {
    console.log(req.file)

    if (req.fileValidationError) {
      return res.send({
        message: req.fileValidationError
      })
    }

    next()
  })
}

module.exports = { upload, remove }