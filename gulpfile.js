var gulp = require('gulp'),
    sass = require('gulp-sass')
    babel = require('gulp-babel');

var config = {
    src: {
        css: 'app/scss/**/*.scss',
        html: '**/*.html',
        js: 'app/js/**/*.js'
    },
    dest: {
        css: 'dist/css',
        js: 'dist/js'
    }
};

gulp.task('watch', ['build'], function() {
    gulp.watch(config.src.css, ['css']);
    gulp.watch(config.src.js, ['js']);
    gulp.watch(config.src.html);
});

gulp.task('css', function() {
    return gulp.src(config.src.css)
        .pipe(sass())
        .pipe(gulp.dest(config.dest.css));
});

gulp.task('js', function () {
    return gulp.src(config.src.js)
        .pipe(babel())
        .pipe(gulp.dest(config.dest.js));
});;

gulp.task('build', ['css', 'js']);
gulp.task('default', ['watch']);