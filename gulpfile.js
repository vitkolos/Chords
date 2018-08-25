var gulp = require("gulp");
var browserSync = require("browser-sync").create();
var htmlInjector = require("bs-html-injector");

var minifycss = require("gulp-minify-css"),
	autoprefixer = require("gulp-autoprefixer"),
	concat = require("gulp-concat"),
	gulpIf = require("gulp-if"),
	uglify = require("gulp-uglify"),
	del = require("del");

var config = {
	cssFiles: "./*.css",
	jsFiles: "./*.js",
	outputFolderCssJs: "cache",
	production: true
}

gulp.task("concatCssMain", function () {
	return gulp.src(config.cssFiles)
		.pipe(concat("styles.css"))
		.pipe(gulpIf(config.production, autoprefixer("last 4 version", "ie8", "ie9", "safari 5", "opera 12.1")))
		.pipe(gulpIf(config.production, minifycss({
			compatibility: "ie8",
			keepSpecialComments: "0"
		})))
		.pipe(gulp.dest(config.outputFolderCssJs))
});

gulp.task("concatJs", function () {
	return gulp.src(config.jsFiles)
		.pipe(concat("scripts.js"))
		.pipe(gulpIf(config.production, uglify()))
		.pipe(gulp.dest(config.outputFolderCssJs))
});

gulp.task("deleteCache", function () {
	del([config.outputFolderCssJs + "/*.js", config.outputFolderCssJs + "/*.css"])
});

gulp.task("browser-sync", function () {
	return browserSync.init({
		server: true,
		files: config.filesBrowserSync
	});
	browserSync.use(htmlInjector, {
		files: ".html"
	});
});

gulp.task("watchAssets", function () {
	gulp.watch(config.cssFiles, ["concatCssMain", browserSync.reload])
	gulp.watch(config.jsFiles, ["concatJs", browserSync.reload])
});

gulp.task("default", ["deleteCache", "concatCssMain", "concatJs", "watchAssets", "browser-sync"]);

/*gulp.task("browser-sync", function () {
	browserSync.use(htmlInjector, {
		files: "*.html"
	});
	browserSync.init({
		server: true
	});
});

gulp.task('css', function () {
	gulp.src(cssFiles)
		.pipe(browserSync.reload({
			stream: true
		}));
});

gulp.task('js', function () {
	gulp.src(jsFiles)
		.pipe(browserSync.reload({
			stream: true
		}));
});

gulp.task("default", ["browser-sync"], function () {
	gulp.watch(cssFiles, ['css']);
	gulp.watch(jsFiles, ['js']);
});*/