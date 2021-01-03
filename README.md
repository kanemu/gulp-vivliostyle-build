# gulp-vivliostyle-build

[vivliostyle-cli](https://github.com/vivliostyle/vivliostyle-cli) plugin for [Gulp](https://github.com/gulpjs/gulp).

## Install

```
npm install git+ssh://git@github.com:kanemu/gulp-vivliostyle-build.git --save-dev
```

## Basic Usage

```javascript
'use strict';

const gulp = require('gulp'),
    vivliostyleBuild = require('gulp-vivliostyle-build');

gulp.task('build', (done) => {
    return gulp.src('./src/index.html')
        .pipe(vivliostyleBuild())
        .on('end', () => {
            done();
        });
});
```

## Options

You can use `outputDir` in addition to the vivliostyle-cli option.

```javascript
gulp.src('./src/index.html')
    .pipe(vivliostyleBuild());
// -> output ./src/index.pdf

gulp.src('./src/index.html')
    .pipe(vivliostyleBuild({outputPath:'dist/out.pdf'}));
// -> output ./dist/out.pdf

gulp.src('./src/index.html')
    .pipe(vivliostyleBuild({outputDir:'build'}));
// -> output ./build/index.pdf

gulp.src('./src/index.html')
    .pipe(vivliostyleBuild({outputPath:'dist/out.pdf',outputDir:'build'}));
// -> output ./build/dist/out.pdf
```

See [vivliostyle-cli/cli-build.ts](https://github.com/vivliostyle/vivliostyle-cli/blob/main/src/cli-build.ts) for details.

## License

Licensed under [AGPL Version 3](http://www.gnu.org/licenses/agpl.html).
