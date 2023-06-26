const gulp = require("gulp");

const sass = require("gulp-sass")(require("sass"));
const cssnano = require("gulp-cssnano");
const rev = require("gulp-rev");

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
