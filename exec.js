"use strict";
const build = require('@vivliostyle/cli').build;

process.on('message', function(opt){
    build(opt);
});