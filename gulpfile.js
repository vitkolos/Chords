var gulp = require('gulp');
var browserSync = require('browser-sync');
var htmlInjector = require("bs-html-injector");

browserSync.use(htmlInjector, {
    files: "*.html"
});

gulp.task('browser-sync', function() {
    browserSync.init(null, {
        //proxy: "hello-world.dev"
    });
});

gulp.task('js', function () {
    gulp.src(jsFiles)
        .pipe(browserSync.reload({stream:true}));
});

gulp.task('default', ['browser-sync'], function () {

});
