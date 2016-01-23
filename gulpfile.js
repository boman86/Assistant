var gulp = require('gulp'),
    sass = require('gulp-sass'),
    csso = require('gulp-csso'),
    plumber = require('gulp-plumber'),
    gutil = require('gulp-util'),
    babel = require('gulp-babel');

var config = {
    src: {
        css: {
            endpoint: 'app/scss/main.scss',
            files: 'app/scss/**/*.scss'
        },
        html: '**/*.html',
        js: 'app/js/**/*.js'
    },
    dest: {
        css: 'dist/css',
        js: 'dist/js'
    }
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

gulp.task('css', function() {
    return gulp.src(config.src.css.endpoint)
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
});;

gulp.task('build', ['css', 'js']);
gulp.task('default', ['watch']);