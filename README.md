mini-jtbl
=========

[JTable](http://www.settlenext.com/jtbl/) is a dead-simple and
intuitive format for tables, based on JSON.

**mini-jtbl** is a set of utilities for the JTable ecosystem, developed as a demonstration of its power.

For example:

```json
$ jcsv  "https://datahub.io/core/country-list/r/data.csv" | jwhere "Code.slice(0,1)=='C'" | jlimit 5 | cat
{
    "source": "https://datahub.io/core/country-list/r/data.csv",
    "header": ["Name", "Code"],
    "rows": [
        ["Cameroon", "CM"],
        ["Canada", "CA"],
        ["Cape Verde", "CV"],
        ["Central African Republic", "CF"],
        ["Chile", "CL"]
    ]
}
```

## Install

Download the repository in a local directory, and type:

```
npm install mini-jtbl
```


To install the following utilities: `jcsv`, `jwhere`, `jcut`,
`jlimit` and `jout` on your system

```
npm link
```

It also provides a utility `jschema` to test **compliance** of a JTable file
with the JTable schema. 

## Example

```
$ jcsv "https://datahub.io/world-bank/en.pop.dnst/r/data.csv" | jwhere "Year*1 < 1964" | jlimit 5
Apply expression on each row: Year*1 < 1964
Limit rows: 5
| Country Name           | Country Code | Year | Value            |
| ---------------------- | ------------ | ---- | ---------------- |
| Arab World             | ARB          | 1961 | 6.97623904408321 |
| Arab World             | ARB          | 1962 | 7.16985259355326 |
| Arab World             | ARB          | 1963 | 7.37014441614233 |
| Caribbean small states | CSS          | 1961 | 10.567692687747  |
| Caribbean small states | CSS          | 1962 | 10.7651828063241 |
```

## Documentation
mini-jtbl has its own [documentation page](http://www.settlenext.com/jtbl/mini-jtbl/),
which is part of the documentation on the JTable format.

All command-line utilities provide a help, accessible with the options
`-h` or `--help`.

## Limitations
The purpose of **mini-jtbl** is not to become a production tool.
Its purpose is to provide a **minimal model** 
for the development of similar tools.

It is workable and sometimes suprisingly resilient, but do not expect
that all corner cases will be covered or that it will be expanded to
cover all cases.

Also, it was never developed with efficiency or large datasets in mind.

Should you find obvious errors, or better ways to do things, please
create an issue.

## You are invited to contibute to the JTable ecosystem!

The success of a table format depends on the creation of an **ecosystem**.
The JTable ecosystem starts with a **protocol** for command lines interfaces,
based on **pipes**.

**Anyone** can develop their own **filters** for the JTable ecosystem, in any
language: Javascript, Python, compiled languages, etc..

For a command-line filter to be part of the CLI ecosystem, 
the following things are usually sufficient:

1. Be able to read **compliant JTable files** from stdin.
2. Perform whatever transformations.
2. Be able to output **compliant JTable files** to stdout.
3. When the output is a TTY, then output it by default in a human-readable
   format.






