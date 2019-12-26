var gulp = require("gulp");
const files = {
  htmlPath: "src/*.html",
  imgPath: "src/img/*.+(png|jpg|jpeg|gif|svg)",
  scssPath: "src/scss/*.scss",
  jsPath: "src/js/*.js"
};

/*
    gulp.task - Define Task
    gulp.src - Point to files to use
    gulp.dest - Points to folder to output
    gulp.watch - Watch files and folders for changes
    browserSync - live reloader
    sourcemaps - debug code easier
    autoprefixer - auto prefix code css
    series - for sequential execution
    parallel - for parallel execution
    concat - concatenates multiple JS files into one file (prefer useref) 
    cssnano - minify CSS
    uglify - minify JS

*/

var browserSync = require("browser-sync").create();
// npm install browser-sync --save-dev
var sass = require("gulp-sass");
// npm install gulp-sass --save-dev
var sourcemaps = require("gulp-sourcemaps");

var autoprefixer = require("gulp-autoprefixer");

var uglify = require("gulp-uglify-es");
gulp.task("sass", function() {
  return gulp
    .src("src/scss/**/*.scss")
    .pipe(
      browserSync.reload({
        stream: true
      })
    )
});

gulp.task("scss", function() {
  return gulp
    .src(files.scssPath)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(
      autoprefixer({
        browsers: ["last 99 versions"],
        cascade: false
      })
    )
    .pipe(
      browserSync.reload({
        stream: true
      })
    )
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("dist/css"));
});

gulp.task("html", function() {
  return gulp
    .src(files.htmlPath)
    .pipe(
      browserSync.reload({
        stream: true
      })
    )
    .pipe(gulp.dest("dist"));
});

gulp.task("js", function() {
  return gulp
    .src(files.jsPath)
    .pipe(uglify())
    .pipe(
      browserSync.reload({
        stream: true
      })
    )
    .pipe(gulp.dest("dist/js"));
});

gulp.task("browserSync", function() {
  browserSync.init({
    server: {
      baseDir: "dist"
    }
  });
});

var imagemin = require("gulp-imagemin");
// npm install gulp-imagemin --save-dev
gulp.task("images", function() {
  return gulp
    .src(files.imgPath)
    .pipe(imagemin())
    .pipe(gulp.dest("dist/img"));
});

gulp.task("watch", function() {
  gulp.watch("src/scss/**/*.scss", gulp.series(["sass",'scss'] ));
  gulp.watch(files.htmlPath, gulp.series(["html"]));
  gulp.watch(files.jsPath, gulp.series(["js"]));
});

gulp.task('fonts', function(){
    return gulp.src('src/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'))
})

gulp.task(
  "default",
  gulp.parallel(["browserSync", "sass",'scss', 'fonts' ,"html", "images"], "watch", function(
    callback
  ) {
    callback;
  })
);
