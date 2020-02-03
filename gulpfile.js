const gulp = require('gulp'),
    gp = require('gulp-load-plugins')(),
    browserSync = require('browser-sync').create();


gulp.task('pug', function() {
    return gulp.src('src/pug/pages/*.pug')
        .pipe(gp.pug({
            pretty: true
        }))
        .pipe(gulp.dest('build'))
        .on('end', browserSync.reload)
});

gulp.task('sass', function() {
    return gulp.src(['src/static/sass/main.scss', 'node_modules/bootstrap/scss/bootstrap.scss'])
        .pipe(gp.sourcemaps.init())
        .pipe(gp.sass())
        .pipe(gp.autoprefixer({
            overrideBrowserslist: ['last 10 versions']
        }))
        .on("error", gp.notify.onError({
            title: "style"
        }))
        .pipe(gp.csso())
        .pipe(gp.sourcemaps.write())
        .pipe(gulp.dest('build/static/css'))
        .on('end', browserSync.stream)
});

gulp.task('scripts:lib', function() {
    return gulp.src(['node_modules/jquery/dist/jquery.js', 'node_modules/popper.js/dist/popper.js', 'node_modules/bootstrap/dist/js/bootstrap.js'])
        .pipe(gp.concat('libs.min.js'))
        .pipe(gulp.dest('build/static/js'))
        .on('end', browserSync.stream)
});

gulp.task('scripts', function() {
    return gulp.src('src/static/js/main.js')
        .pipe(gulp.dest('build/static/js'))
        .on('end', browserSync.stream)
});

gulp.task('img:build', function() {
    return gulp.src('src/static/img/**/*.{png,jpeg,gif}')
        .pipe(gp.tinypng('NhNQfC355SWT4XKkMmxC9yp5rTqcqWjg'))
        .pipe(gulp.dest('build/static/img/'));
});

gulp.task('img:dev', function() {
    return gulp.src('src/static/img/**/*.{png,jpeg,gif}')
        .pipe(gulp.dest('build/static/img/'));
});

gulp.task('svg', function() {
    return gulp.src('src/static/img/svg/**/*.svg')
        .pipe(gp.svgmin({
            js2svg: {
                pretty: true
            }
        }))
        .pipe(gp.cheerio({
            run: function($) {
                $(['fill']).removeAttr('fill');
                $(['stroke']).removeAttr('stroke');
                $(['style']).removeAttr('style');
            },
            parserOptions: {
                xmlMode: true
            }
        }))
        .pipe(gp.replace('&gt;', '>'))
        .pipe(gp.svgSprite({
            mode: {
                symbol: {
                    sprite: 'sprite.svg'
                }
            }
        }))
        .pipe(gulp.dest('./build/static/img/svg/'));
});

gulp.task('fonts', function() {
    return gulp.src('src/static/fonts/**/*')
        .pipe(gulp.dest('./build/static/fonts'))
});


gulp.task('watch', function() {
    gulp.watch('./src/pug/**/*.pug', gulp.series('pug'))
    gulp.watch('./src/static/sass/**/*.scss', gulp.series('sass'))
    gulp.watch('./src/static/js/main.js', gulp.series('scripts'))
    gulp.watch('./src/static/img/**/*', gulp.series('img:dev'))
    gulp.watch('./src/static/fonts/**/*', gulp.series('fonts'))
});


gulp.task('serve', function() {
    browserSync.init({
        server: {
            baseDir: './build'
        }
    });
    browserSync.watch('./build', browserSync.reload)
});

gulp.task('clean', function() {
    return gulp.src('build', { read: false })
        .pipe(gp.clean());
});

gulp.task('default', gulp.series(
    'clean',
    gulp.parallel('pug', 'sass', 'scripts:lib', 'scripts', 'img:dev', 'svg', 'fonts'),
    gulp.parallel('watch', 'serve')
));

gulp.task('build', gulp.series(
    'clean',
    gulp.parallel('pug', 'sass', 'scripts:lib', 'scripts', 'img:build', 'svg', 'fonts'),
    gulp.parallel('watch', 'serve')
));