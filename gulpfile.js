const highlightjs = require('highlight.js')
const gulp = require('gulp')
const rename = require("gulp-rename")
const mvb = require('gulp-mvb')
const less = require('gulp-less')
const sourcemaps = require('gulp-sourcemaps')
const LessPluginAutoPrefix = require('less-plugin-autoprefix')
const pug = require('gulp-pug')
const gulpif = require('gulp-if')
const changed = require('gulp-changed')
const cached = require('gulp-cached')
const browserSync = require('browser-sync').create()
const errorHandler = require('gulp-error-handle')
const filter = require('gulp-filter')
const debug = require('gulp-debug')
const remember = require('gulp-remember')
const autoprefix = new LessPluginAutoPrefix({
	browsers: ["Chrome >= 57", "Edge >= 39", "Safari >= 10", "iOS >= 10", "Opera 50", "Firefox 50"]
})
const npmDist = require('gulp-npm-dist');
const glsl = require('gulp-glsl');
const urlBuilder = require('gulp-url-builder')
const include = require('gulp-include')
const replace = require('gulp-replace');

const path = {
	src: {
		static: 'src/static/**/*.*',
		js: 'src/js/**/*.js',
		less: 'src/less/**/*.less',
		less_main: 'src/less/*.less',
		less_articles: 'src/articles-less/*.less',
		pug: 'src/pug/**/*.pug',
		pug_includes: 'src/pug/_includes/*.pug',
		pug_main: ['src/pug/**/*.pug', '!src/pug/_includes/*.pug'],
		articles: 'src/articles/**/*.md',
		shaders: 'src/shaders/**/*.glsl',
		demos: "src/articles-demos/**/*.pug"
	},
	dist: {
		root: 'docs/',
		js: 'docs/js/',
		less: 'docs/css/',
		less_articles: 'docs/articles/',
		pug: 'docs/',
		articles: 'docs/articles',
		shaders: 'docs/shaders',
		demos: "src/articles-demos"
	},
	articlesBase: 'articles',
	feedTemplate: 'src/pug/_templates/atom.pug',
	articleTemplate: 'src/pug/_templates/article.pug'
};


const mvbConf = {
	// glob that locates the article markdown files
	glob: path.src.articles,
	// the template for an article page
	template: path.articleTemplate,

	// optionally define custom markdown-it plugins
	plugins: [
		'markdown-it-mark',
		['markdown-it-anchor', { tabIndex: false }]
	],

	// callback function for generating an article permalink.
	// see docs below for info on the article properties.
	permalink(article) {
		return `/${path.articlesBase}/${article.id}/`;
	},
	// callback function to further modify an article after it has been loaded.
	//loaded(article) {
	//article.calculatedData = doSomething();
	//},
	highlight(code, lang) {
		const languages = (lang != null) ? [lang] : undefined;
		return highlightjs.highlightAuto(code, languages).value;
	},
	// callback function for generating custom article groups.
	// access the return value via the groupedArticles property, so that you can
	// either return an array if you only have one group or return an object with
	// named groups in case you want to use multiple groups (by date, by tag, ...)
	grouping(articles) {
		const byYear = {}
		const byTag = {}

		articles.forEach(function (article) {
			const year = article.date.toISOString().replace(/-.*/, '')
			if (!byYear[year]) { byYear[year] = [] }
			byYear[year].push(article)

			return (article.tags || []).forEach(function (tag) {
				if (!byTag[tag]) { byTag[tag] = [] }
				return byTag[tag].push(article)
			})
		})

		// year
		const articlesByYear = []
		Object.keys(byYear).reverse().forEach(year => articlesByYear.push({ year, articles: byYear[year] }))

		// tag
		const articlesByTag = byTag

		// groups
		return {
			byTag: articlesByTag,
			byYear: articlesByYear
		}
	}
};

gulp.task('less', () => {
	return gulp.src(path.src.less_main)
		.pipe(errorHandler())

		// //only pass unchanged *main* files and *all* the partials
		// .pipe(gulpif(global.isWatching, changed('docs', { extension: '.css' })))

		// //filter out unchanged partials, but it only works when watching
		// .pipe(gulpif(global.isWatching, cached('less')))

		.pipe(sourcemaps.init())
		.pipe(less())
		.pipe(sourcemaps.write('.'))
		.pipe(debug({ title: 'less' }))
		.pipe(gulp.dest(path.dist.less))
		.pipe(browserSync.stream())
});

gulp.task('pug', () => {
	return gulp.src(path.src.pug)
		.pipe(errorHandler())
		.pipe(mvb(mvbConf))

		//only pass unchanged *main* files and *all* the partials
		.pipe(gulpif(global.isWatching, changed('docs', { extension: '.html' })))

		//filter out unchanged partials, but it only works when watching
		.pipe(gulpif(global.isWatching, cached('pug')))

		//filter out partials (folders and files starting with "_" )
		.pipe(filter(function (file) {
			return !/\/_/.test(file.path) && !/^_/.test(file.relative);
		}))

		//.pipe(cached('pug'))
		.pipe(pug({ pretty: true, doctype: 'HTML' }))
		//.pipe(debug({ title: 'pug' }))
		.pipe( urlBuilder() )
		.pipe(remember('pug'))

		.pipe(gulp.dest(path.dist.pug))
		.pipe(browserSync.stream());
});

gulp.task('js', () => {
	return gulp.src(path.src.js)
		.pipe(errorHandler())
		.pipe(gulp.dest(path.dist.js))
});

gulp.task('static', () => {
	return gulp.src(path.src.static)
		.pipe(errorHandler())
		//.pipe(debug({ title: 'STATIC' }))
		.pipe(gulp.dest(path.dist.root))
});

gulp.task('browser-sync', function () {
	browserSync.init({
		server: {
			baseDir: "./docs/index.html",
		},
		browser: "firefox"
	});
});

// Blog

gulp.task('articles:md', () =>
	gulp.src(path.src.articles)
		.pipe(debug({ title: 'articles:md' }))
		.pipe(mvb(mvbConf))
		.pipe(rename(function (path) {
			// Returns a completely new object, make sure you return all keys needed!
			return {
				dirname: path.dirname + "/" + path.basename,
				basename: "index",
				extname: ".html"
			};
		}))
		.pipe(pug({pretty: true}))
		.pipe(include({
			includePaths: [
				path.dist.demos
			  ]
		}))
		.pipe(gulp.dest(path.dist.articles))
);

gulp.task('articles:demos', () => {
	return gulp.src(path.src.demos)
		.pipe(errorHandler())
		.pipe(pug({ pretty: true, doctype: 'HTML' }))
		.pipe(debug({ title: 'articles:demos' }))
		.pipe(gulp.dest(path.dist.demos))
		.pipe(browserSync.stream());
});

gulp.task('less:articles', () => {
	return gulp.src(path.src.less_articles)
		.pipe(errorHandler())
		.pipe(less())
		.pipe( urlBuilder() )
		.pipe(debug({ title: 'less:articles' }))
		.pipe(gulp.dest(path.dist.less_articles))
		.pipe(browserSync.stream())
});

gulp.task('articles', gulp.series("articles:demos", "articles:md", "less:articles")) 

gulp.task('feed', () =>
	gulp.src(path.feedTemplate)
		.pipe(mvb(mvbConf))
		.pipe(pug())
		.pipe(rename('atom.xml'))
		.pipe(gulp.dest(path.dist.root))
);

// Libs

gulp.task('copy:libs', () =>
	gulp.src(npmDist(), { base: './node_modules', nodir: true })
		.pipe(rename((path) =>
			path.dirname = path.dirname.replace(/\/dist/, '').replace(/\\dist/, '')
		))
		.pipe(rename((path) =>
			path.dirname = path.dirname.replace(/\/build/, '').replace(/\\build/, '')
		))
		.pipe(gulp.dest('./docs/libs'))
);

gulp.task("shaders", () =>
	gulp.src(path.src.shaders)
		.pipe(glsl({ format: 'module', es6: true }))
		.pipe(gulp.dest(path.dist.shaders))
);

// Watch

gulp.task('watch', gulp.parallel('articles', 'less', 'pug', 'js', 'static', function () {

	browserSync.init({
		server: './docs',
		browser: "firefox"
	});

	gulp.watch([path.src.demos, path.src.articles, path.src.less_articles], gulp.series('articles'));
	gulp.watch(path.src.less, gulp.parallel('less'));
	gulp.watch(path.src.pug, gulp.parallel('pug'));
	gulp.watch(path.src.js, gulp.parallel('js'));
	gulp.watch(path.src.static, gulp.parallel('static'));
	gulp.watch('docs/**/*.html').on('change', browserSync.reload);
	gulp.watch('docs/**/*.css').on('change', browserSync.reload);
	gulp.watch('docs/**/*.js').on('change', browserSync.reload);
}));

gulp.task('setWatch', function (done) {
	global.isWatching = true;
	done();
});


// Tasks

gulp.task('default', gulp.series('setWatch', 'watch'));
gulp.task('build', gulp.series('pug', 'articles', 'js', 'static', 'less', 'feed', 'copy:libs', "shaders"));