const gulp = require('gulp');
const environments = require('gulp-environments');
const gutil = require('gulp-util');
const sourcemaps = require('gulp-sourcemaps');
const cleanCSS = require('gulp-clean-css');
const plumber = require('gulp-plumber');
const uglify = require('gulp-uglify');
const browserSync = require('browser-sync');
const path = require('path');
const rimraf = require('rimraf');

const publicPath = path.join(__dirname, 'public');
const development = environments.development;
const production = environments.production;

// Task: Clean public foler
gulp.task('clean', cb => rimraf('./public', cb));

// Task: Copy html to public
gulp.task('html', () => {
  return gulp.src('src/*.html')
    .pipe(plumber((err) => {
      gutil.log('Html task error: ', err);
      this.emit('end');
    }))
    .pipe(gulp.dest(publicPath));
});

// Task: Copy images
gulp.task('images', () => {
  return gulp.src(['src/img/**/*.png', 'src/img/**/*.jpg'], {
    base: 'src',
  })
    .pipe(plumber((err) => {
      gutil.log('Images task error: ', err);
      this.emit('end');
    }))
    .pipe(gulp.dest(publicPath));
});

// Task: Copy vendors
gulp.task('vendors', () => {
  return gulp.src(['src/vendor/**/*'], {
    base: 'src',
  })
    .pipe(plumber((err) => {
      gutil.log('Vendors task error: ', err);
      this.emit('end');
    }))
    .pipe(gulp.dest(publicPath));
});

// Task: CSS - Minify CSS
gulp.task('styles', () => {
  return gulp.src(['src/css/**/*.css'])
    .pipe(plumber((err) => {
      gutil.log('Styles task error: ', err);
      this.emit('end');
    }))
    .pipe(development(sourcemaps.init()))
    .pipe(cleanCSS())
    .pipe(development(sourcemaps.write()))
    .pipe(gulp.dest(`${publicPath}/css`));
});

// Task: Minify - Javascript
gulp.task('scripts', () => {
  return gulp.src('src/js/*.js')
    .pipe(plumber((err) => {
      gutil.log('Styles task error: ', err);
      this.emit('end');
    }))
    .pipe(development(sourcemaps.init()))
    .pipe(uglify())
    .pipe(development(sourcemaps.write()))
    .pipe(gulp.dest(`${publicPath}/js`));
});

// Task: Browser-syn reload
gulp.task('reload', (done) => {
  browserSync.reload();
  done();
});

// Task: Watch
gulp.task('watch', () => {
  browserSync.init({
    server: {
      baseDir: './public',
    },
  });

  gulp.watch('src/css/**/*.css', gulp.series('styles', 'reload'));
  gulp.watch('src/*.html', gulp.series('html', 'reload'));
  gulp.watch('src/js/*.js', gulp.series('scripts', 'reload'));
});

// Task: Build
gulp.task('set-dev', development.task);
gulp.task('set-prod', production.task);
gulp.task('build', gulp.series('clean', 'html', 'images', 'vendors', 'styles', 'scripts'));

