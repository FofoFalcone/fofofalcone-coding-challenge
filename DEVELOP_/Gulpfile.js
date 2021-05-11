const gulp = require("gulp");
const rename = require("gulp-rename");
const replace = require('gulp-replace');
const sass = require("gulp-sass");
const uglify = require("gulp-uglify");
const { gulpSassError } = require("gulp-sass-error");
const browsersync = require("browser-sync").create();
const imagemin = require("gulp-imagemin");
const themeKit = require("@shopify/themekit");

// Compile SCSS into CSS
function style() {
  // 1. Find SCSS file position
  return (
    gulp
      .src("src/styles/*.scss")
      // 2. Compile SCSS
      // a. Minify CSS file
      .pipe(
        sass()
          // b. Throw compile error on console
          .on("error", gulpSassError(true))
      )
      // c. Replace compiled file extension from .scss to .css
      .pipe(
        rename(function (path) {
          path.basename = path.basename.replace(".scss", ".css");
        })
      )
      // d. Replaces interpolation characters needed to make liquid variables work within your Sass files without errors again to liquid compatible ones
      .pipe(replace('"{{', "{{"))
      .pipe(replace('}}"', "}}"))
      .pipe(replace('px"', "px"))
      // 3. Push file to correct folder
      .pipe(gulp.dest("src/assets"))
      .pipe(browsersync.stream())
  );
}

// Compile JS to JS Minified
function js() {
  // 1. Find JS file position
  return (
    gulp
      .src("src/js/*.js")
      // 2. Compile JS
      // a. Minify JS file
      .pipe(uglify())
      // b. Replace compiled file extension from .js to .min.js
      .pipe(
        rename(function (path) {
          path.basename = path.basename.replace(".js", "");
          path.extname = ".min.js";
        })
      )
      // 3. Push file to correct folder
      .pipe(gulp.dest("src/assets"))
  );
}

// Minify images
function img(){
  return (
    gulp.src("src/img/*")
    .pipe(imagemin({
      optimizationLevel: 7
    }))
    .pipe(gulp.dest("src/assets"))
  )
  
}

// Compile new HTML page live
function browsersyncStart() {
  browsersync.init({
    proxy: {
      target: "http://localhost/boolean/src"
    }
  });
}

function browsersyncReload(callback) {
  browsersync.reload();
  callback();
}

function watch() {
  browsersyncStart();
  gulp.watch("src/*.html", browsersyncReload);
  gulp.watch("src/js", gulp.series(js));
  gulp.watch("src/styles", gulp.series(style));
  gulp.watch("src/img", gulp.series(img));
}

gulp.task("watch", watch);
