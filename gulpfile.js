'use strict';
/**
 * 모듈 호출
 */
var gulp  = require('gulp'),
	del = require('del'),
	fileinclude  = require('gulp-file-include'),
	sass	  = require('gulp-sass'),
	// sourcemaps  = require('gulp-sourcemaps'),
	autoprefixer  = require('gulp-autoprefixer'),
	cleanCSS = require('gulp-clean-css'),
	rename = require('gulp-rename'),
	imagemin = require('gulp-imagemin'),
	watch     = require('gulp-watch'),
	htmlbeautify  = require('gulp-html-beautify'),
	browserSync = require('browser-sync').create(), // browser-sync 호출

	config  = require('./config')(); // 환경설정 ./config.js
	
	sass.compiler = require('node-sass');

/*
 * Gulp 업무(Tasks) 정의 v3.9.1
 */

// 기본
gulp.task('default', ['browserSync', 'watch']);
gulp.task('mobile', ['browserSync_m', 'watch_m']);

gulp.task('browserSync', ['template', 'sass', 'js', 'img'], function() {
	browserSync.init({
		port: 3030,
		server: {
			baseDir: './dist'
		}
	});
});
gulp.task('browserSync_m', ['template_m', 'sass', 'js', 'img'], function() {
	browserSync.init({
		port: 3035,
		server: {
			baseDir: './dist'
		}
	});
});

// PC 관찰
gulp.task('watch', [], function(){
	// HTML 템플릿 업무 관찰
	gulp.watch([config.template.src, config.template.parts], function() {
		gulp.start('template');
	});
	// Sass 업무 관찰
	gulp.watch(config.sass.src, function() {
		gulp.start('sass');
	});
	// Js 업무 관찰qkedk
	gulp.watch(config.js.src, function() {
		gulp.start('js');
	});
});
// Mobile 관찰
gulp.task('watch_m', [], function(){
	// HTML 템플릿 업무 관찰
	gulp.watch([config.template.src_m, config.template.parts_m], function() {
		gulp.start('template_m');
	});
	// Sass 업무 관찰
	gulp.watch(config.sass.src, function() {
		gulp.start('sass');
	});
	// Js 업무 관찰
	gulp.watch(config.js.src, function() {
		gulp.start('js');
	});
});

// 제거
gulp.task('clean:all', function(){
	del(config.dev);
});
gulp.task('clean:template', function(){
	del(config.template.dest);
});
gulp.task('clean:css', function(){
	del(config.sass.dest);
});
gulp.task('clean:css', function(){
	del(config.css.dest);
});
gulp.task('clean:js', function(){
	del(config.js.dest);
});
gulp.task('clean:img', function(){
	del(config.img.dest);
});

// var static_origin = '/static/svc/',
// 	img_origin = '/img/svc/',
// 	views_origin = '/views/svc/',
// 	static_sv = 'http://static.seabay.co.kr/svc/',
// 	img_sv = 'http://img.seabay.co.kr/svc/',
// 	views_sv = 'http://static.seabay.co.kr/views/svc/';


// gulp.task('replace_sv', function() {
// 	return gulp.src(config.dev + '/**/*')
// 		.pipe( replace(static_origin, static_sv) )
// 		.pipe( replace(img_origin, img_sv) )
// 		.pipe( replace(views_origin, views_sv) )
// 		.pipe( gulp.dest(config.dev) );

// });
// gulp.task('replace_origin', function() {
// 	return gulp.src(config.dev + '/**/*')
// 		.pipe( replace(static_sv, static_origin) )
// 		.pipe( replace(img_sv, img_origin) )
// 		.pipe( replace(views_sv, views_origin) )
// 		.pipe( gulp.dest(config.dev) );

// });

// HTML 템플릿
gulp.task('template', function(){
	return gulp.src(config.template.src)
		.pipe( fileinclude({
			prefix: '@@',
			basepath: '@file'
			// basepath: '@root'
		}))
		.pipe( htmlbeautify(config.htmlbeautify) )
		.pipe( gulp.dest(config.template.dest) )
		.pipe( browserSync.stream({ match: '**/*.html' }) );
});
gulp.task('template_m', function(){
	return gulp.src(config.template.src_m)
		.pipe( fileinclude({
			prefix: '@@',
			basepath: '@file'
		}))
		.pipe( htmlbeautify(config.htmlbeautify) )
		.pipe( gulp.dest(config.template.dest_m) )
		.pipe( browserSync.stream({ match: '**/*.html' }) );
});
// scss 컴파일러
gulp.task('sass', function() {
	return gulp.src(config.sass.src)
		// .pipe( sourcemaps.init() )
		.pipe( sass({outputStyle: 'compact'}).on('error', sass.logError)) // {outputStyle: nested} expanded, compact, compressed
		.pipe( autoprefixer() )
		.pipe( cleanCSS())
		// .pipe( cleanCSS({compatibility: 'ie8'}) )
		// .pipe( sourcemaps.write() )
		.pipe( gulp.dest(config.sass.dest) )
		.pipe( browserSync.stream({ match: '**/*.css' }) );
});
gulp.task('css', function() {
	return gulp.src(config.css.src)
		.pipe( autoprefixer() )
		.pipe( cleanCSS())
		.pipe( rename({suffix: '.min'}) )
		.pipe( gulp.dest(config.css.dest) )
		.pipe( browserSync.stream({ match: '**/*.css' }) );
});
gulp.task('js', function(){
	return gulp.src(config.js.src)
		.pipe( gulp.dest(config.js.dest) )
		.pipe( browserSync.stream({ match: '**/*.js' }) );
});
gulp.task('img', function() {
	return gulp.src(config.img.src)
        .pipe( imagemin() )
		.pipe( gulp.dest(config.img.dest)) ;
});