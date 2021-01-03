"use strict";
const PluginError = require('plugin-error');
const Vinyl = require('vinyl');
const through = require('through2');
const replaceExt = require('replace-ext');
const path = require('path');
const fs = require('fs');
const {
    fork
} = require('child_process');

const PLUGIN_NAME = 'gulp-vivliostyle-build';
const runningVivliostyleTimeout = 60 * 1000;

const resolveInput = async (options) => {
    options.input = path.resolve(process.cwd(), options.input);
    return options;
}

const resolveOutput = async (options) => {
    if (options.outputDir) {
        options.outputPath = path.resolve(
            path.resolve(process.cwd(), options.outputDir),
            (options.outputPath || replaceExt(path.basename(options.input), '.pdf'))
        );
    } else if (options.outputPath) {
        options.outputPath = path.resolve(process.cwd(), options.outputPath);
    } else {
        options.outputPath = replaceExt(options.input, '.pdf');
    }
    return options;
}

const buildPdf = function (options) {
    return new Promise((resolve, reject) => {
        // Create output directory
        const tmpOutputDir = path.dirname(options.outputPath);
        if (!fs.existsSync(tmpOutputDir)) {
            fs.mkdirSync(tmpOutputDir, {
                recursive: true
            });
        };
        // Execute vivliostyle-cli in child process
        const subProcess = fork(__dirname + '/exec.js');
        subProcess.send({
            input: options.input,
            outputPath: options.outputPath,
            size: options.size,
            timeout: options.timeout || runningVivliostyleTimeout,
            rootDir: options.root && path.resolve(process.cwd(), options.root),
            loadMode: options.book ? 'book' : 'document',
            sandbox: options.sandbox,
            pressReady: options.pressReady,
            executableChromium: options.executableChromium,
            verbose: options.verbose
        });
        subProcess.on('close', () => {
            resolve(options);
        });
        subProcess.on('error', (err) => {
            reject(err);
        });
    });
}

const gulpVivliostyleBuild = (options = {}) => through.obj((file, enc, cb) => {
    const opt = Object.assign({}, options);
    if (!opt.input) {
        if (!file.isNull()) {
            opt.input = file.path;
        } else {
            return cb(null, file);
        }
    }

    Promise.resolve(opt)
        .then(resolveInput)
        .then(resolveOutput)
        .then(buildPdf)
        .then(tmpOpt => {
            cb(null, new Vinyl({
                cwd: '/',
                base: path.dirname(tmpOpt.outputPath),
                path: tmpOpt.outputPath,
                contents: fs.createReadStream(tmpOpt.outputPath)
            }));
        })
        .catch((err) => {
            cb(new PluginError(PLUGIN_NAME, `Error: ${err.message}
            If you think this is a bug, please report at https://github.com/vivliostyle/vivliostyle-cli/issues`));
        });
});

module.exports = gulpVivliostyleBuild;