#!/usr/bin/env node
/**
 * Example (stub) of how to read a JTable file 
 * from stdin and apply SET on a column
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
    set COL EXPRESSION [-h][--help]

Read a JTable from stdin and set a column to an expression

positional arguments:
    COL                   a column (name or index) to be modified:
                          if the column exists, then modify in place;
                          otherwise add it.
    EXPRESSION            a Javascript expression.

optional arguments:
    -h, --help            show this help message and exit
    -0, --no-header       source csv does NOT contain a header
    `)
    process.exit()
}
var colName = args._[0]
var expression = args._[1]


// Read the table from stdin
var table = new jtbl.JTable();
table.read(0);

jtbl.trace(`Set column '${colName}' to: ${expression}`)
// get the array of results (column):
var newCol = table.eval(expression) 

// Decide what to do with the results: modify in place or add?
var colNo = table.colNo(colName)
if (colNo == -1){   
    // Non-existent, add:
    if (this.header == null) {
        // this is a corner case: header was empty
        throw "Cannot set a column name when header is empty."
    } 
    this.header.push(colName) 
    
    for (const i in table.rows){
        tables.rows[i].push(newCol[i]) 
    }
}

else {
    // Exists, modify the column in place
    for (const i in table.rows){
        table.rows[i][colNo] = newCol[i]
    }
}

table.write(table);
