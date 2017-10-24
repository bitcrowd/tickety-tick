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

import pkg from './package.json';

function src(...p) {
  return path.join('./src', ...p);
}

src.common = src.bind(null, 'common');
src.webext = src.bind(null, 'web-extension');
src.safari = src.bind(null, 'safari-extension');

function dist(...p) {
  return path.join('./dist', ...p);
}

dist.webext = dist.bind(null, 'web-extension');
dist.safari = dist.bind(null, 'tickety-tick.safariextension');

function copy(source, destination) {
  return gulp.src(source).pipe(gulp.dest(destination));
}

function backgroundjs(version) {
  return copy(src[version]('background.js'), dist[version]());
}

function contentjs(version) {
  const bundler = browserify({
    basedir: src[version](),
    entries: ['./content.js'],
    transform: ['babelify', 'envify'],
    debug: true,
  });

  bundler.external('jquery.js'); // ...just to please mozilla

  return bundler.bundle()
    .pipe(srcstream('content.js'))
    .pipe(buffer())
    .pipe(srcmaps.init({ loadMaps: true }))
    .pipe(uglify())
    .pipe(srcmaps.write())
    .pipe(gulp.dest(dist[version]()));
}

function jquery(version) {
  return copy('./node_modules/jquery/dist/jquery.js', dist[version]());
}

function html(version) {
  return gulp.src(src.common('popup', 'popup.html'))
    .pipe(gulp.dest(dist[version]('popup')));
}

function css(version, compat) {
  const prefixer = autoprefixer({ browsers: compat });
  return gulp.src(src.common('popup', 'popup.scss'))
    .pipe(sass({ includePaths: './node_modules' }).on('error', sass.logError))
    .pipe(postcss([prefixer]))
    .pipe(gulp.dest(dist[version]('popup')));
}

function js(version) {
  const bundler = browserify({
    basedir: src[version]('popup'),
    entries: ['./popup.jsx'],
    transform: ['babelify', 'envify'],
    extensions: ['.jsx'],
    debug: true,
  });

  return bundler.bundle()
    .pipe(srcstream('popup.js'))
    .pipe(buffer())
    .pipe(srcmaps.init({ loadMaps: true }))
    .pipe(uglify())
    .pipe(srcmaps.write())
    .pipe(gulp.dest(dist[version]('popup')));
}

function manifest(version, pkginfo) {
  const postProcess = (file, enc, cb) => {
    const mf = JSON.parse(file.contents.toString());

    mf.name = pkginfo.name;
    mf.version = pkginfo.version;
    mf.description = pkginfo.description;
    mf.icons = {
      16: 'icons/icon-16.png',
      32: 'icons/icon-32.png',
      48: 'icons/icon-48.png',
      64: 'icons/icon-64.png',
      128: 'icons/icon-128.png',
    };

    if (process.env.WITH_ADDON_ID) {
      mf.applications = {
        gecko: {
          id: 'tickety-tick@bitcrowd.net',
        },
      };
    }

    // eslint-disable-next-line no-param-reassign
    file.contents = Buffer.from(JSON.stringify(mf));

    cb(null, file);
  };

  return gulp.src(src[version]('manifest.json'))
    .pipe(through.obj(postProcess))
    .pipe(gulp.dest(dist[version]()));
}

gulp.task('clean', (done) => {
  rimraf(dist(), done);
});

gulp.task('build:webext:backgroundjs', () => {
  return backgroundjs('webext');
});

gulp.task('build:webext:contentjs', () => {
  return contentjs('webext');
});

gulp.task('build:webext:jquery', () => {
  return jquery('webext');
});

gulp.task('build:webext:html', () => {
  return html('webext');
});

gulp.task('build:webext:css', () => {
  return css('webext', ['Chrome >= 49', 'Firefox >= 48']);
});

gulp.task('build:webext:js', () => {
  return js('webext');
});

gulp.task('build:webext:icons', () => {
  return copy(src.common('icons', '*.png'), dist.webext('icons'));
});

gulp.task('build:webext:manifest', () => {
  return manifest('webext', pkg);
});

gulp.task('build:webext', [
  'build:webext:backgroundjs',
  'build:webext:contentjs',
  'build:webext:jquery',
  'build:webext:html',
  'build:webext:css',
  'build:webext:js',
  'build:webext:icons',
  'build:webext:manifest',
], () => {
  return gulp.src(dist.webext('**/*'))
    .pipe(zip('web-extension.zip'))
    .pipe(gulp.dest(dist()));
});

gulp.task('build:safari:contentjs', () => {
  return contentjs('safari');
});

gulp.task('build:safari:jquery', () => {
  return jquery('safari');
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
  'build:safari:jquery',
  'build:safari:html',
  'build:safari:css',
  'build:safari:js',
  'build:safari:icons',
  'build:safari:plist',
]);

gulp.task('build', [
  'build:webext',
  'build:safari',
]);

gulp.task('watch', () => {
  gulp.watch(src('**', '*'), ['build']);
});

gulp.task('default', ['clean'], () => {
  gulp.start('build');
});
