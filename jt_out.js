#!/usr/bin/env node
/**
 * Example (stub) of how to read a JTable file 
 * from stdin and provide pretty printing
 * 
 */

'use strict';
// Imports
const minimist = require('minimist')
const path = require('path');
const jtbl = require(path.resolve( __dirname, "./jtbl.js" ) )
const highlight = require('cli-highlight').highlight

// Definitions
const OUTPUT_FORMATS = ['markdown', 'jtbl', 'json']
const DEFAULT_FORMAT = 'markdown'

// Arguments
const args = minimist(process.argv.slice(2));
if (args.h || args.help) {
    console.log (`
usage:
    jout [-t FORMAT] [-h][--help] [--target FORMAT]

Read a JTable from stdin and provide a formatted/colorized output

optional arguments:
    -h, --help            show this help message and exit
    -t, --target FORMAT   output format (default: markdown github)
    -c, --color           colorize the output (warning: can be slow)

format list:
    ${OUTPUT_FORMATS.join(', ')}
    `)
    process.exit()
}
var target = args.target || args.t || DEFAULT_FORMAT
var color_output = args.color || args.c
// Read the table from stdin
var table = new jtbl.JTable();
table.read(0);

// action
var output
switch(target){

    case "markdown":
        output = table.toMarkdown()
        break;

    case "jtbl":
        output = table.toString()
        break;

    case "json":
        output = table.toJSON()
        break;


}

if (color_output){
    output = highlight(output) 
}
process.stdout.write(output)
