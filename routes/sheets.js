const express = require('express')
const router = express.Router()
const { checkAuthenticated } = require('../lib/auth_helpers')
const marked = require('marked')
const last = require('lodash/last')
const fs = require('fs')
const glob = require('glob')
const fm = require('front-matter')
const path = require('path')

/* GET users listing. */
router.get('/',
  checkAuthenticated,
  loadIndexSheet,
  loadIndexVideo,
  loadFolders,
  function(req, res, next) {
    res.render('sheets', { title: 'Bienenklasse', auth: true, content: req.content, folders: req.folders, indexVideo: req.video })
  })

function loadFolders (req, res, next) {
  req.folders = {}
  glob(__dirname + '/../data/**/*', function( err, files ) {
    files.forEach( file => {
      const parentDir = path.basename(path.dirname(file))
      if (parentDir === 'data') return

      req.folders[parentDir] = req.folders[parentDir] || { files: [], videos: [], name: parentDir }
      if (path.basename(file) === 'index.md')
        req.folders[parentDir].index = getContent(file)
      else if (path.extname(file) === '.mp4')
        req.folders[parentDir].videos.push(last(file.split('data/')))
      else if (!file.includes('.mp4.png'))
        req.folders[parentDir].files.push(last(file.split('data/')))
    })
    next();
  });
}

function loadIndexVideo (req, res, next) {
  glob(__dirname + '/../data/*.mp4', function( err, files ) {
    files.forEach( file => {
      req.video = last(file.split('data/'))
    })
  })
  next()
}

function loadIndexSheet (req, res, next) {
  const md = getContent(__dirname + '/../data/index.md')
  req.content = md.content
  req.attr = md.attr
  next()
}

function getContent (filename) {
  const data = fs.readFileSync(filename, 'utf8')
  const md = fm(data)
  return { content: marked(md.body), attr: md.attributes }
}

module.exports = router
