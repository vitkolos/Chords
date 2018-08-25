var gulp = require("gulp");
var browserSync = require("browser-sync").create();
var htmlInjector = require("bs-html-injector");

var minifycss = require("gulp-minify-css"),
	autoprefixer = require("gulp-autoprefixer"),
	concat = require("gulp-concat"),
	gulpIf = require("gulp-if"),
	minify = require("gulp-minify"),
	del = require("del");

var config = {
	cssFiles: "app/*.css",
	jsFiles: "app/*.js",
	outputFolderCssJs: "app/cache",
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
		.pipe(minify())
		.pipe(gulp.dest(config.outputFolderCssJs))
});

gulp.task("deleteCache", function () {
	del([config.outputFolderCssJs + "/*.js", config.outputFolderCssJs + "/*.css"])
});

gulp.task("browser-sync", function () {
	browserSync.use(htmlInjector, {
		files: "app/*.html"
	});
	browserSync.init({
		server: "app",
		files: config.filesBrowserSync
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