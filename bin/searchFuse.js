#!/usr/bin/env node
'use strict'

import minimist from 'minimist'
import cli from '../cli/index.js'

const command = minimist(process.argv.slice(2))

if (command.help || (process.argv.length <= 2 && process.stdin.isTTY)) {
  // console.log(`\n${help.replace('__VERSION__', version)}\n`)
} else if (command.version) {
  console.log(`search-fuse version`)
} else {
  cli(command)
}
