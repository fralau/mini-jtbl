#!/usr/bin/env node
/**
 * Self-contained example (stub) of how to read a csv file 
 * from a file and turn it into a jtbl file
 * 
 * For the sake of simplicity this program
 */

'use strict';

// Imports
const minimist = require('minimist')
const fs = require('fs')
const Papa = require('papaparse')
const download = require('download-file-sync')
var colors = require('colors');
const markdown_table = require('markdown-table');

// Arguments
const args = minimist(process.argv.slice(2));
if (args.h || args.help) {
    console.log (`
    usage:
        jscv FILENAME-OR-URL [-h][-0][--help][--no-header]

    Reads a csv table and always and output it in JTable format

    positional arguments:
        FILENAME-OR-URL       the filename or url (for download) to be
                              converted into JTable format.
    optional arguments:
        -h, --help            show this help message and exit
        -0, --no-header       source csv does NOT contain a header
    `)
    process.exit()
}

// console.error(args)

var hasHeader = true
if (args['-0']) {
    hasHeader = false;
}
var source = args._[0]
if (typeof(source) == 'undefined') {
    // stdin
    source = 0
}

console.error(`Reading csv from '${source}'`.green)
// Read file (trim to avoid spurious new lines)
if (typeof(source) == 'string' && source.includes('https')){
    try { 
        var csv_file = download(source)}
    catch(err) { 
        console.log(`ERROR: Failed downloading '${source}'`)
        console.log(err.message.red) 
        process.exit(1)
        }

}
else {
    var csv_file = fs.readFileSync(source, 'utf-8').trim()
}


// DO NOT specify that the string has a header, as we want a list of lists
var result = Papa.parse(csv_file);
// console.log(result);

// Exploit the results
if (result.errors.length >0) {
    console.error(result.errors.join())
    process.exit(1)
}
else {
    var header = null
    var rows = []

    if (hasHeader) {
        header = result.data.slice(0, 1)[0]
        rows = result.data.slice(1)
    }
    else {
        // no header
        rows = result.data
    }
}

// Output
var jtbl = {'source': source, 'header': header, 'rows': rows}
if (Boolean(process.stdout.isTTY)) {
    if (header != null){
        // if no header, invent one
        header = new Array(rows[1].length)
    }
    markdown_table([header].concat(rows))
} else {
    process.stdout.write(JSON.stringify(jtbl) + '\n')
}
