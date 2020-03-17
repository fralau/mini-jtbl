#!/usr/bin/env node
/**
 * Utilities for JTable readers, writers, and filters
 */
const fs = require('fs');
const markdown_table = require('markdown-table');
var colors = require('colors');
const beautify = require('js-beautify').js

/**
 * Trace: write a message on stderr
 * @param  {...any} args 
 */
function trace(...args) {
    s = args.join(" ")
    console.error(s.green)
}

class JTable {

    // ------------------------------------
    // Properties 
    // -----------------------------------
 
    /**
     * Header
     */
    get header(){
        return this.table.header
    }

    set header(value){
        this.table.header = value
    }
  
    /**
     * Rows
     */
    get rows(){
        return this.table.rows
    }


    set rows(value){
        this.table.rows = value
    }

    /**
     * Get the column no from the name
     * If cannot find, will return -1
     * @param {string} name 
     */
    colNo(name){
        // is it already a no?
        var colNo = parseInt(name)
        if (! isNaN(colNo) && colNo >= 0) {
            return colNo
        }
        // if not, try to find in list
        return this.header.indexOf(name);
    }

    /**
     * Normalized header
     * The header returned will be a valid identifier
     * 'foo bar (baz)' ==> 'foo_bar__baz_'
     * If no header available, returns c0, c1, etc.
     */
    get normHeader(){
        if (this.header == null) {
            // create a dummy header with c0 to cn.
            var header = []
            for (const i in row[0].length) {
                header.push(`c{i}`)
            }
            return header
        } 
        else {
            // clean up the header
            var header = []
            for (const i in this.header) {
                var value = this.header[i].replace(/\W/g, "_")
                header.push(value)
            }
            return header
        }
    }



    /**
     * Make a string representation of a JTable
     */
    toString() {
        return beautify(JSON.stringify(this.table) + '\n');
    }


    /**
     * Convert a JTable into a markdown table
     */
    toMarkdown() {
        return markdown_table([this.header].concat(this.rows));
    }


    /**
     * Create an object that represents a row
     * e.g. header ["foo", "bar"] and row "["a", "2"] =>
     *      { "foo": "a", "bar": 2}
     * @param {BigInteger} line_no 
     */
    rowToObject(line_no) {
        var row = this.rows[line_no];
        var result = {};
        var header = this.normHeader;
        var i;
        for (i in header) {
            var key = header[i];
            var value = row[i];
            result[key] = value;
        }
        console.log(result)
        return result
    }

    /**
     * Convert the current JTable in a JSON list of objects
     */
    toJSON() {
        const res = []
        for (const i in this.rows) {
            res.push(this.rowToObject(i))
        }
        return beautify(JSON.stringify(res) + '\n')
    }

    // ------------------------------------
    // Read 
    // -----------------------------------

    /**
     * Read a JTable from a file
     * @param {string} filename 
     */
    read(filename) {
        this.table = JSON.parse(fs.readFileSync(filename, 'utf-8'))
        return this.table;
    }

    // ------------------------------------
    // Write
    // ------------------------------------

    /**
     * Write a JTable object, with the dual output rule
     * (TTY: markdown, other: JTable)
     */
    write() {
        var output
        if (Boolean(process.stdout.isTTY)) {
            // convert as markdown table
            output = this.toMarkdown()
        } 
        else {
            // pipe
            output = this.toString()
        }
        // Print result (do not use console.log(), as this will cut the output):
        process.stdout.write(output)
    }



    // ------------------------------------
    // Filter 
    // ------------------------------------


    /**
     * Apply a Javascript expression to each row
     * The result is stored in a result array
     * @param {string} expression 
     */
    eval(expression){
        // define the function:
        var args = this.normHeader.slice(); // column names, normalized
        args.push('r'); // add an 'r' argument containing the rows, for r[x]
        const calc = new Function(...args, 'return ' + expression);
        // run through the rows:
        const results = []
        for (const row of this.rows){
            const values = row.slice() // the cells of the row
            values.push(row) // add the row array for 'r'
            // evaluate
            const result = calc(...values)
            // push the result into the result vector:
            results.push(result)
        }
        return results
    }

  

}
// ------------------------------------
// Exports
// ------------------------------------

exports.JTable = JTable
exports.trace = trace