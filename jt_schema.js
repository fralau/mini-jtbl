#!/usr/bin/env node
/**
 * Self-contained program, to validate a JTable file sent through stdin:
 * if correct let it pass-through
 * Otherwise send the error vector to stderr
 */
'use strict';

// Schema file:
const download = require('download-file-sync')
const JTBL_SCHEMA= 'https://settlenext.com/jtbl/schemas/v0.1/jtbl.schema.json';

// Require
var fs = require('fs');
const minimist = require('minimist')
var assert = require('assert');
var Validator = require('jsonschema').Validator;
var colors = require('colors');


// Arguments
const args = minimist(process.argv.slice(2));
if (args.h || args.help) {
    console.log (`
usage:
jschema [-h][--help] [FILENAME]

Read a JTable from a file and check for compliance agains the JTable format
(if no filename is provided, read input from stdin). 

If the test is passed, the file is forwarded transparently to stdout.
Otherwise: the description is written on stderr and the program
stops with exit code 1 (non-JSON format) or 2 (non-compliant JTable).

positional arguments:
FILENAME            the filename containing a JTavble

optional arguments:
    -h, --help      show this help message and exit
    `)
    process.exit()
}

// determine the file to be analyzed:
var filename = args._[0] || 0 // by default use, stdin

// Read schema
var JTBL = JSON.parse(download(JTBL_SCHEMA));

// Read file from stdin
try{
    var source = JSON.parse(fs.readFileSync(0));
}
catch(err){
    console.error("ERROR: Non-JSON format.".red)
    process.exit(1)
}

// Validate
var val = new Validator();
var result = val.validate(source, JTBL);

if (result.valid) {
    process.stdout.write(JSON.stringify(source) + '\n')
}
else {
    console.error(result.errors)
    process.exit(2)
}