#!/usr/bin/env node
const { mdLink } = require('./index');
const [,, ...args] = process.argv
const path = args[0];
args.shift();
mdLink(path, args) .then ( result => {
    console.log(result.response);
}) .catch( err => {
    console.log(err.error);
})