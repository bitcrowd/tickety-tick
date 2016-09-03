/* eslint-disable import/no-extraneous-dependencies, arrow-body-style */

import path from 'path';

import gulp from 'gulp';
import postcss from 'gulp-postcss';
import sass from 'gulp-sass';
import srcmaps from 'gulp-sourcemaps';
import uglify from 'gulp-uglify';
import zip from 'gulp-zip';

import autoprefixer from 'autoprefixer';
import buffer from 'vinyl-buffer';
import browserify from 'browserify';
import rimraf from 'rimraf';
import srcstream from 'vinyl-source-stream';
import through from 'through2';

import pkg from './package';

function src(...p) {
  return path.join('./src', ...p);
}

src.common = src.bind(null, 'common');
src.chrome = src.bind(null, 'chrome');
src.firefox = src.bind(null, 'firefox');
src.safari = src.bind(null, 'safari');

function dist(...p) {
  return path.join('./dist', ...p);
}

dist.chrome = dist.bind(null, 'chrome-extension');
dist.firefox = dist.bind(null, 'firefox-extension');
dist.safari = dist.bind(null, 'tickety-tick.safariextension');

function copy(source, destination) {
  return gulp.src(source).pipe(gulp.dest(destination));
}

function backgroundjs(browser) {
  return copy(src[browser]('background.js'), dist[browser]());
}

function contentjs(browser) {
  const bundler = browserify({
    basedir: src[browser](),
    entries: ['./content.js'],
    transform: ['babelify', 'envify'],
    debug: true
  });

  return bundler.bundle()
    .pipe(srcstream('content.js'))
    .pipe(buffer())
    .pipe(srcmaps.init({ loadMaps: true }))
    .pipe(uglify())
    .pipe(srcmaps.write())
    .pipe(gulp.dest(dist[browser]()));
}

function html(browser) {
  return gulp.src(src.common('popup', 'popup.html'))
    .pipe(gulp.dest(dist[browser]('popup')));
}

function css(browser, compat) {
  const prefixer = autoprefixer({ browsers: compat });
  return gulp.src(src.common('popup', 'popup.scss'))
    .pipe(sass({}).on('error', sass.logError))
    .pipe(postcss([prefixer]))
    .pipe(gulp.dest(dist[browser]('popup')));
}

function js(browser) {
  const bundler = browserify({
    basedir: src[browser]('popup'),
    entries: ['./popup.jsx'],
    transform: ['babelify', 'envify'],
    extensions: ['.jsx'],
    debug: true
  });

  return bundler.bundle()
    .pipe(srcstream('popup.js'))
    .pipe(buffer())
    .pipe(srcmaps.init({ loadMaps: true }))
    .pipe(uglify())
    .pipe(srcmaps.write())
    .pipe(gulp.dest(dist[browser]('popup')));
}

function manifest(browser, pkginfo) {
  const process = (file, enc, cb) => {
    const mf = JSON.parse(file.contents.toString());

    mf.name = pkginfo.name;
    mf.version = pkginfo.version;
    mf.description = pkginfo.description;
    mf.icons = {
      16: 'icons/icon-16.png',
      32: 'icons/icon-32.png',
      48: 'icons/icon-48.png',
      64: 'icons/icon-64.png',
      128: 'icons/icon-128.png'
    };

    // eslint-disable-next-line no-param-reassign
    file.contents = new Buffer(JSON.stringify(mf));

    cb(null, file);
  };

  return gulp.src(src[browser]('manifest.json'))
    .pipe(through.obj(process))
    .pipe(gulp.dest(dist[browser]()));
}

gulp.task('clean', (done) => {
  rimraf(dist(), done);
});

gulp.task('build:chrome:backgroundjs', () => {
  return backgroundjs('chrome');
});

gulp.task('build:chrome:contentjs', () => {
  return contentjs('chrome');
});

gulp.task('build:chrome:html', () => {
  return html('chrome');
});

gulp.task('build:chrome:css', () => {
  return css('chrome', ['Chrome >= 49']);
});

gulp.task('build:chrome:js', () => {
  return js('chrome');
});

gulp.task('build:chrome:icons', () => {
  return copy(src.common('icons', '*.png'), dist.chrome('icons'));
});

gulp.task('build:chrome:manifest', () => {
  return manifest('chrome', pkg);
});

gulp.task('build:chrome', [
  'build:chrome:backgroundjs',
  'build:chrome:contentjs',
  'build:chrome:html',
  'build:chrome:css',
  'build:chrome:js',
  'build:chrome:icons',
  'build:chrome:manifest'
], () => {
  return gulp.src(dist.chrome('*'))
    .pipe(zip('chrome-extension.zip'))
    .pipe(gulp.dest(dist()));
});

gulp.task('build:firefox:backgroundjs', () => {
  return backgroundjs('firefox');
});

gulp.task('build:firefox:contentjs', () => {
  return contentjs('firefox');
});

gulp.task('build:firefox:html', () => {
  return html('firefox');
});

gulp.task('build:firefox:css', () => {
  return css('firefox', ['Firefox >= 48']);
});

gulp.task('build:firefox:js', () => {
  return js('firefox');
});

gulp.task('build:firefox:icons', () => {
  return copy(src.common('icons', '*.png'), dist.firefox('icons'));
});

gulp.task('build:firefox:manifest', () => {
  return manifest('firefox', pkg);
});

gulp.task('build:firefox', [
  'build:firefox:backgroundjs',
  'build:firefox:contentjs',
  'build:firefox:html',
  'build:firefox:css',
  'build:firefox:js',
  'build:firefox:icons',
  'build:firefox:manifest'
], () => {
  return gulp.src(dist.firefox('*'))
    .pipe(zip('firefox-extension.zip'))
    .pipe(gulp.dest(dist()));
});

gulp.task('build:safari:contentjs', () => {
  return contentjs('safari');
});

gulp.task('build:safari:html', () => {
  return html('safari');
});

gulp.task('build:safari:css', () => {
  return css('safari', ['Safari >= 9.1']);
});

gulp.task('build:safari:js', () => {
  return js('safari');
});

gulp.task('build:safari:icons', () => {
  return copy(src.common('icons', '*.png'), dist.safari('icons'));
});

gulp.task('build:safari:plist', () => {
  return copy(src.safari('Info.plist'), dist.safari());
});

gulp.task('build:safari', [
  'build:safari:contentjs',
  'build:safari:html',
  'build:safari:css',
  'build:safari:js',
  'build:safari:icons',
  'build:safari:plist'
]);

gulp.task('build', [
  'build:chrome',
  'build:firefox',
  'build:safari'
]);

gulp.task('watch', () => {
  gulp.watch(src('**', '*'), ['build']);
});

gulp.task('default', ['clean'], () => {
  gulp.start('build');
});
