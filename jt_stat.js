#!/usr/bin/env node
/**
 * Example (stub) of how to read a JTable file 
 * from stdin and provide information on it
 * 
 */

'use strict';
// Imports
const minimist = require('minimist')
const path = require('path');
const jtbl = require(path.resolve( __dirname, "./jtbl.js" ) )

// Arguments
const args = minimist(process.argv.slice(2));
if (args.h || args.help) {
   console.log (`
   usage:
       jstat [-h][--help]

   Read a JTable from stdin and provide information.



   optional arguments:
       -h, --help            show this help message and exit
   `)
   process.exit()
}


// Read the table from stdin
var table = new jtbl.JTable();
table.read(0);


// calculate
var result = {
    'header' : ['Item', 'Value'],
    'rows' : [
        ['source', table.table.source],
        ['title', table.table.title],
        ['description', table.table.description],
        ['header', table.header.join(', ')],
        ['header types', table.headerTypes.join(', ')],
        ['columns', table.width],
        ['rows', table.length],
    ]
}

var stats = new jtbl.JTable()
stats.table = result
stats.write()