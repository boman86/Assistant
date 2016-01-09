var gulp = require('gulp'),
    browserSync = require('browser-sync').create(),
    sass = require('gulp-sass')
    babel = require('gulp-babel')
    concat = require('gulp-concat');

var config = {
    src: {
        css: 'app/scss/*.scss',
        html: '**/*.html',
        js: 'app/js/**/*.js'
    },
    dest: {
        css: 'dist/css',
        js: 'dist/js'
    }
};

gulp.task('serve', function() {
    browserSync.init({
        server: {
            baseDir: './'
        }
    });
});

gulp.task('watch', ['css', 'js'], function() {
    gulp.watch(config.src.css, ['css']);
    gulp.watch(config.src.js, ['js']);
    gulp.watch(config.src.html).on('change', browserSync.reload);
});

gulp.task('css', function() {
    return gulp.src(config.src.css)
        .pipe(sass())
        .pipe(gulp.dest(config.dest.css))
        .pipe(browserSync.stream());
});

gulp.task('js', function () {
    return gulp.src(config.src.js)
        .pipe(babel())
        // .pipe(concat('app.js'))
        .pipe(gulp.dest(config.dest.js))
        .pipe(browserSync.stream());
});;

gulp.task('build', ['css', 'js']);
gulp.task('default', ['serve', 'watch']);