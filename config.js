module.exports = function() {

	var source       = 'src',
		development  = 'dist',
		remove       = ['.sass-cache', 'dist'],

		// 템플릿 경로
		template = {
			src  : source + '/template/**/!(_)*.html',
			parts: source + '/template/**/_*.html',
			dest : development + '/views',
			src_m  : source + '/template_m/**/!(_)*.html',
			parts_m : source + '/template_m/**/_*.html',
			dest_m : development + '/views_m'
		},

		// Sass 경로
		sass = {
			src : source + '/sass/**/*.{scss,sass}',
			// src       : source + '/sass/**',
			dest: development + '/public/css'
		},

		// Css 경로
		css = {
			src : source + '/css/**/*.css',
			// src : source + '/css/**',
			dest: development + '/public/css'
		},

		// JS 경로
		js = {
			src : source + '/js/**/*.js',
			// src : source + '/js/**',
			dest: development + '/public/js'
		},

		// Img 경로
		img = {
			// src : source + '/img/**/*.{gif,jpg,png,ico}',
			src : source + '/img/!(sprite)*/*',
			dest: development + '/public/img',
			src_sprite : source + '/img/sprite/**/*',
		},
		
		// HTML 옵션
		htmlbeautify = {
			"indentSize": 4
		};

	return {
		del  : remove,
		src  : source,
		dev  : development,
		
		template : template,
		css  : css,
		sass : sass,
		js   : js,
		img   : img,

		htmlbeautify : htmlbeautify
	};
};