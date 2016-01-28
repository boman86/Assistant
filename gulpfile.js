var gulp = require('gulp'),
    sass = require('gulp-sass'),
    csso = require('gulp-csso'),
    plumber = require('gulp-plumber'),
    gutil = require('gulp-util'),
    rimraf = require('gulp-rimraf'),
    babel = require('gulp-babel');

var config = {
    src: {
        css: {
            files: 'app/scss/**/*.scss',
            themes: 'app/scss/themes/*.scss'
        },
        html: '**/*.html',
        js: 'app/js/**/*.js'
    },
    dest: {
        css: 'dist/css',
        js: 'dist/js'
    },
    destFolder: 'dist'
};

var onError = function (err) {
  gutil.beep();
  gutil.log(err);
  this.emit('end');
}

gulp.task('watch', ['build'], function() {
    gulp.watch(config.src.css.files, ['css']);
    gulp.watch(config.src.js, ['js']);
    gulp.watch(config.src.html);
});

gulp.task('clean', function () {
    return gulp.src(config.destFolder, { read: false })
            .pipe(plumber({
                errorHandler: onError
            }))
            .pipe(rimraf());
});

gulp.task('css', function() {
    return gulp.src(config.src.css.themes)
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(sass())
        .pipe(csso())
        .pipe(gulp.dest(config.dest.css));
});

gulp.task('js', function () {
    return gulp.src(config.src.js)
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(babel())
        .pipe(gulp.dest(config.dest.js));
});

gulp.task('build', ['clean', 'css', 'js']);
gulp.task('default', ['watch']);
