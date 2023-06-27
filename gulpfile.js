const gulp = require("gulp");

const sass = require("gulp-sass")(require("sass"));
const cssnano = require("gulp-cssnano");
const rev = require("gulp-rev");

const uglify = require("gulp-uglify-es").default;

const imagemin = require("gulp-imagemin");

const del = require("del");

gulp.task("css", function (done) {
  console.log("minifying css...");

  // converting scss into css and compressing them
  gulp
    .src("./assets/scss/**/*.scss")
    .pipe(sass())
    .pipe(cssnano())
    .pipe(gulp.dest("./assets/css"));

  // renaming css files and storing them into public/assets
  gulp
    .src("./assets/css/**/*.css")
    .pipe(rev())
    .pipe(gulp.dest("./public/assets/css"))
    .pipe(
      rev.manifest({
        cwd: "public",
        merge: true,
      })
    )
    .pipe(gulp.dest("./public/assets"));

  done();
});

gulp.task("js", function (done) {
  console.log("minifying js...");

  // compressing and renaming js files
  gulp
    .src("./assets/js/**/*.js")
    .pipe(uglify())
    .pipe(rev())
    .pipe(gulp.dest("./public/assets/js"))
    .pipe(
      rev.manifest({
        cwd: "public",
        merge: true,
      })
    )
    .pipe(gulp.dest("./public/assets"));

  done();
});

gulp.task("images", function (done) {
  console.log("compressing images...");

  // compressing and renaming images
  gulp
    .src("./assets/images/**/*+(png|jpg|gif|svg|jpeg)") // regex(regular expression)
    .pipe(imagemin())
    .pipe(rev())
    .pipe(gulp.dest("./public/assets/images"))
    .pipe(
      rev.manifest({
        cwd: "public",
        merge: true,
      })
    )
    .pipe(gulp.dest("./public/assets"));

  done();
});

// empty the old build from the public/assets directory brfore creating a new one
gulp.task("clean:assets", function (done) {
  console.log("cleaning previous build...");

  del.sync(["./public/assets"], { force: true });

  done();
});

// build task to run all 4 tasks
gulp.task(
  "build",
  gulp.series("clean:assets", "css", "js", "images"),
  function (done) {
    console.log("Building assets...");

    done();
  }
);
