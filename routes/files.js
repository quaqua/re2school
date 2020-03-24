const express = require('express')
const router = express.Router()
const { checkAuthenticated } = require('../lib/auth_helpers')
const fs = require('fs')
const path = require('path')

router.get('/:folder/:filename',
  checkAuthenticated,
  function(req, res) {
    const filename = path.join(__dirname, '../data/', req.params.folder, req.params.filename)
    if (!fs.existsSync(filename)) return res.send('')

    res.sendFile(filename)
  })

router.get('/:filename',
  checkAuthenticated,
  function(req, res) {
    const filename = path.join(__dirname, '../data/', req.params.filename)
    if (!fs.existsSync(filename)) return res.send('')

    res.sendFile(filename)
  })

module.exports = router
