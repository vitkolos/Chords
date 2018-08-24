var gulp         = require("gulp");
var browserSync  = require("browser-sync").create();
var htmlInjector = require("bs-html-injector");

/**
 * Start Browsersync
 */
gulp.task("browser-sync", function () {
    browserSync.use(htmlInjector, {
        files: "*.html"
    });
    browserSync.init({
        server: true
    });
});

/**
 * Default task
 */
gulp.task("default", ["browser-sync"], function () {
    gulp.watch("test/fixtures/*.html", htmlInjector);
});
