var gulp = require('gulp'),
    browserSync = require('browser-sync').create(),
    sass = require('gulp-sass'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    cssnano = require('cssnano'),
    sourcemaps = require('gulp-sourcemaps'),
    imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache'),
    useref = require('gulp-useref'),
    uglify = require('gulp-uglify'),
    gulpIf = require('gulp-if'),
    del = require('del'),
    runSequence = require('run-sequence');


// Path objects 
var paths = {
    styles: {
        src: ['src/scss/*.scss'],
        dest: 'src/css'
    },
    scripts: {
        src: ['node_modules/bootstrap/dist/js/bootstrap.min.js', 'node_modules/popper.js/dist/umd/popper.min.js', 'node_modules/jquery/dist/jquery.min.js'],
        dest: 'src/js'
    },
    useref: {
        src: 'src/*.php'
    },
    images: {
        src: 'src/images/**/*.+(png|jpg|jpeg|gif|svg)',
        dest: 'dist/images'
    },
    fonts: {
        src: 'src/fonts/**/*',
        dest: 'dist/fonts'
    }
}

// Compile scss to css
gulp.task('compile-sass', function(){
    return gulp.src(paths.styles.src)
    .pipe(sourcemaps.init())
    .pipe(sass()).on('error', sass.logError)
    .pipe(postcss([
        autoprefixer(),
        cssnano()
    ]))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(browserSync.stream())
})

// Move bootstrap js to js file
gulp.task('move-js', function(){
    return gulp.src(paths.scripts.src)
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(browserSync.stream())
})

// Launches server after scss is compiled into css folder
gulp.task('launch-server', ['compile-sass'], function(){
    gulp.watch(paths.styles.src, ['compile-sass'])
    gulp.watch('src/*.php')
})

// gulp
gulp.task('default', ['move-js', 'launch-server'])


// gulp useref
// Note: This command builds a compressed file only use when you want to build the site
gulp.task('useref', function(){
    return gulp.src(paths.useref.src)
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulp.dest('dist'))
});

// gulp compress-images
// Note: This command compresses iamges and sends them to the dist file
gulp.task('compress-images', function(){
    return gulp.src(paths.images.src)
    .pipe(cache(imagemin({
        interlaced: true
    })))
    .pipe(gulp.dest(paths.images.dest))
});

// gulp fonts
// Note: This command compresses the fonts file and sends them to the dist file
gulp.task('fonts', function(){
    return gulp.src(paths.fonts.src)
    .pipe(gulp.dest(paths.fonts.dest))
});

// gulp cache:clear
// Note: This command clears the cached image files from your computer after images have been deleted
gulp.task('cache:clear', function(callback) {
    return cache.clearAll(callback)
});

// gulp clean:dist
// Note: This deletes the dist file beware!
gulp.task('clean:dist', function() {
    return del.sync('dist');
})

