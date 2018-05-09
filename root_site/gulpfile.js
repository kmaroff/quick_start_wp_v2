var syntax        = 'sass'; // Syntax: sass or scss;
var theme        = 'default'; // Theme;

var gulp          = require('gulp'),
		gutil         = require('gulp-util' ),
		sass          = require('gulp-sass'),
		browsersync   = require('browser-sync'),
		concat        = require('gulp-concat'),
		uglify        = require('gulp-uglify'),
		cleancss      = require('gulp-clean-css'),
		rename        = require('gulp-rename'),
		autoprefixer  = require('gulp-autoprefixer'),
		notify        = require("gulp-notify"),
		rsync         = require('gulp-rsync');

gulp.task('browser-sync', function() {
	browsersync({
		proxy: "default.loc",
		notify: false,
		open: false,
		//tunnel: true,
		//tunnel: "admion", //Demonstration page: http://projectname.localtunnel.me
	})
});

gulp.task('styles', function() {
	return gulp.src('wp-content/themes/'+theme+'/'+syntax+'/**/*.'+syntax+'')
	.pipe(sass({ outputStyle: 'expand' }).on("error", notify.onError()))
	.pipe(rename({ suffix: '.min', prefix : '' }))
	.pipe(autoprefixer(['last 15 versions']))
	.pipe(cleancss( {level: { 1: { specialComments: 0 } } })) // Opt., comment out when debugging
	.pipe(gulp.dest('wp-content/themes/'+theme+'/css'))
	.pipe(browsersync.reload( {stream: true} ))
});

gulp.task('js', function() {
	return gulp.src([
		'wp-content/themes/'+theme+'/js/common.js', // Always at the end
		])
	.pipe(concat('scripts.min.js'))
	// .pipe(uglify()) // Mifify js (opt.)
	.pipe(gulp.dest('wp-content/themes/'+theme+'/js'))
	.pipe(browsersync.reload({ stream: true }))
});

gulp.task('rsync', function() {
	return gulp.src('wp-content/themes/'+theme+'/**')
	.pipe(rsync({
		root: '/',
		hostname: 'username@yousite.com',
		destination: 'yousite/public_html/',
		// include: ['*.htaccess'], // Includes files to deploy
		exclude: ['**/Thumbs.db', '**/*.DS_Store'], // Excludes files from deploy
		recursive: true,
		archive: true,
		silent: false,
		compress: true
	}))
});

gulp.task('watch', ['styles', 'js', 'browser-sync'], function() {
	gulp.watch('wp-content/themes/'+theme+'/'+syntax+'/**/*.'+syntax+'', ['styles']);
	gulp.watch(['wp-content/themes/'+theme+'/libs/**/*.js', 'wp-content/themes/'+theme+'/js/common.js'], ['js']);
	gulp.watch('wp-content/themes/'+theme+'/*.php', browsersync.reload);
	gulp.watch('wp-content/themes/'+theme+'/*.html', browsersync.reload)
});

gulp.task('default', ['watch']);
