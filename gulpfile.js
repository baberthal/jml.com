/* jslint node: true */
'use strict';

var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    maps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    del = require('del'),
    useref = require('gulp-useref'),
    iff = require('gulp-if'),
    csso = require('gulp-csso'),
    handleErrors = require('./gulp/util/handleErrors'),
    bs = require('browser-sync').create(),
    pages = require('gulp-gh-pages');

var options = {
    src: './src/',
    dist: './dist/',
    tmp: './tmp',
    scss: {
        indentedSyntax: false
    },
    autoprefixer: {
        browsers: ['last 2 versions']
    },
    browserSync: {
        server: './src'
    }
};

gulp.task('sass', function() {
    return gulp.src(options.src + 'scss/main.scss')
        .pipe(maps.init())
        .pipe(sass(options.scss))
        .on('error', handleErrors)
        .pipe(maps.write())
        .pipe(autoprefixer(options.autoprefixer))
        .pipe(gulp.dest(options.src + 'css/'))
        .pipe(bs.stream());
});

gulp.task('html', ['sass'], function() {
    var assets = useref.assets();
    return gulp.src(options.src + 'index.html')
        .pipe(assets)
        .pipe(iff('*.js', uglify()))
        .pipe(iff('*.css', csso()))
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(gulp.dest(options.dist));
});

gulp.task('watch', function() {
    gulp.watch(options.src + 'scss/**/*.scss', ['sass']);
});

gulp.task('assets', function() {
    return gulp.src([options.src + 'img/**/*',
                     options.src + 'fonts/**/*',
                     options.src + 'font-awesome/**/*',
                     options.src + 'mail/**/*'], { base: options.src })
             .pipe(gulp.dest(options.dist));
});

gulp.task('serve', ['sass', 'watch'], function() {
    bs.init(options.browserSync);
    gulp.watch(options.src + 'scss/**/*.scss', ['sass']);
    gulp.watch(options.src + 'index.html').on('change', bs.reload);
});

gulp.task('clean', function() {
    del([options.dist]);
    del([options.src + 'css/main.css*']);
});

gulp.task('build', ['html', 'assets']);

gulp.task('default', ['clean'], function() {
    gulp.start('build');
});

gulp.task('deploy', function() {
    return gulp.src(options.dist + '**/*')
        .pipe(pages());
});

// vim: set ts=8 sw=4 tw=0 ft=javascript et :
