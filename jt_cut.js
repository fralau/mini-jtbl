#!/usr/bin/env node
/**
 * Example (stub) of how to read a JTable file 
 * from stdin and apply a cut filter on the columns.
 * 
 */

'use strict';

// Imports
const minimist = require('minimist')
const path = require('path');
const jtbl = require(path.resolve( __dirname, "./jtbl.js" ) );


// Arguments
const args = minimist(process.argv.slice(2));
if (args.h || args.help) {
    console.log (`
    usage:
        jcut COL [COL..] [-h][--help]

    Read a JTable from stdin and cut columns

    positional arguments:
        COL                   a column (name or index) to be deleted

    optional arguments:
        -h, --help            show this help message and exit
        -0, --no-header       source csv does NOT contain a header
    `)
    process.exit()
}
var colNames = args._

// Read the table from stdin
var table = new jtbl.JTable();
table.read(0);


jtbl.trace("Cut columns:", colNames)
for (const name of colNames) {
    // cut the column with that name (header and rows):

    var colNo = table.colNo(name)
    if (colNo >=0){
        table.header.splice(colNo, 1)
        for (const row of table.rows) {
            row.splice(colNo, 1)
        }
    }
    else {
        jtbl.trace(`WARNING: Unknown column '${name}'!`)
    }
}
       

table.write(table);