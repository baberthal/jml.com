/* jslint node: true */
'use strict';

var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    maps = require('gulp-sourcemaps'),
    del = require('del'),
    useref = require('gulp-useref'),
    iff = require('gulp-if'),
    csso = require('gulp-csso');

var options = {
    src: './src/',
    dist: './dist/'
};

gulp.task('sass', function() {
    return gulp.src(options.src + 'scss/main.scss')
        .pipe(maps.init())
        .pipe(sass())
        .pipe(maps.write('./'))
        .pipe(gulp.dest(options.src + 'css/'));
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

gulp.task('serve', ['sass', 'watch']);

gulp.task('clean', function() {
    del([options.dist]);
    del([options.src + 'css/main.css*']);
});

gulp.task('build', ['html', 'assets']);

gulp.task('default', ['clean'], function() {
    gulp.start('build');
});

// vim: set ts=8 sw=4 tw=0 ft=javascript et :
