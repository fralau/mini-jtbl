#!/usr/bin/env node
/**
 * Example (stub) of how to read a JTable file 
 * from stdin and apply a WHERE filter.
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
        jwhere EXPRESSION [-h][--help]

    Read a JTable from stdin and apply a filter expression on each row.
    It is semantically similar to a WHERE clause in SQL.

    positional arguments:
        EXPRESSION            any valid Javascript expression where 
                              variable names are the names of columns
                              ("foo == 'bar'"); non-legal characters are
                              always translated into '_', e.g.
                              "long column" is accessed through "long_column";
                              otherwise, you can refer to values in the row
                              by index, as "r[0]", "r[1]", etc.

    optional arguments:
        -h, --help            show this help message and exit
    `)
    process.exit()
}
var expression = args._[0]

// Read the table from stdin
var table = new jtbl.JTable();
table.read(0);
jtbl.trace("Apply expression on each row:", expression)
var header_info = Array.from(table.normHeader.entries())
jtbl.trace("Header (normalized):", header_info.join(";  "))


// Apply the filter
var newRows = [];
var filter = table.eval(expression) // the result is an array
for (const i in filter) {
    if (filter[i]){
        newRows.push(table.rows[i])
    }
}
table.rows = newRows;

table.write(table);