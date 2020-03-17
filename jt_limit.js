#!/usr/bin/env node
/**
 * Example (stub) of how to read a JTable file 
 * from stdin and apply a LIMIT filter (maximum no of rows).
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
        jlimit NO [-h][--help]

    Read a JTable from stdin and keep only the first rows.
    It is semantically similar to a LIMIT clause in SQL.

    positional arguments:
        NO                    no of rows

    optional arguments:
        -h, --help            show this help message and exit
        -0, --no-header       source csv does NOT contain a header
    `)
    process.exit()
}
var no_rows = args._[0]

// Read the table from stdin
var table = new jtbl.JTable();
table.read(0);

// Apply filter
jtbl.trace("Limit rows:", no_rows)
var newRows = table.rows.slice(0,no_rows);
table.rows = newRows;

// Outpout
table.write()