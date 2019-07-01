var wallabyWebpack = require('wallaby-webpack');
var path = require('path');

var compilerOptions = Object.assign(
  require('./tsconfig.json').compilerOptions,
  require('./tsconfig.spec.json').compilerOptions
);


compilerOptions.module = 'CommonJs';

module.exports = function(wallaby) {
  var webpackPostprocessor = wallabyWebpack({
    entryPatterns: ['src/wallabyTest.js', 'src/**/*spec.js', 'projects/ngx-adal-8/src/lib/**/*.spec.js'],

    module: {
      rules: [
        { test: /\.css$/, loader: ['raw-loader'] },
        { test: /\.html$/, loader: 'raw-loader' },
        {
          test: /\.ts$/,
          loader: '@ngtools/webpack',
          include: /node_modules/,
          query: { tsConfigPath: 'tsconfig.json' }
        },
        {
          test: /\.js$/,
          loader: 'angular2-template-loader',
          exclude: /node_modules/
        },
        { test: /\.styl$/, loaders: ['raw-loader', 'stylus-loader'] },
        {
          test: /\.less$/,
          loaders: [
            'raw-loader',
            { loader: 'less-loader', options: { paths: [__dirname] } }
          ]
        },
        { test: /\.scss$|\.sass$/, loaders: ['raw-loader', 'sass-loader'] },
        { test: /\.(jpg|png|svg)$/, loader: 'url-loader?limit=128000' }
      ]
    },

    resolve: {
      extensions: ['.js', '.ts'],
      modules: [
        path.join(wallaby.projectCacheDir, 'src/app'),
        path.join(wallaby.projectCacheDir, 'src'),
        'node_modules'
      ],
      alias: {
        'ngx-adal-8': path.join(wallaby.projectCacheDir, 'projects/ngx-adal-8/src/public-api')
      }
    },
    node: {
      fs: 'empty',
      net: 'empty',
      tls: 'empty',
      dns: 'empty'
    }
  });

  return {
    files: [
      {
        pattern: 'src/**/*.+(ts|css|less|scss|sass|styl|html|json|svg)',
        load: false
      },
      { pattern: 'src/**/*.d.ts', ignore: true },
      { pattern: 'src/**/*spec.ts', ignore: true },
      {pattern: 'projects/ngx-adal-8/src/**/*.+(ts|css|less|scss|sass|styl|html|json|svg)', load: false},
      {pattern: 'projects/ngx-adal-8/src/**/*.d.ts', ignore: true},
      {pattern: 'projects/ngx-adal-8/src/**/*spec.ts', ignore: true}
    ],

    tests: [
      { pattern: 'src/**/*spec.ts', load: false },
      { pattern: 'src/**/*e2e-spec.ts', ignore: true },
      {pattern: 'projects/ngx-adal-8/src/**/*spec.ts', load: false},
      { pattern: 'projects/ngx-adal-8/src/**/*e2e-spec.ts', ignore: true }
    ],

    testFramework: 'jasmine',

    compilers: {
      '**/*.ts': wallaby.compilers.typeScript(compilerOptions)
    },

    middleware: function(app, express) {
      var path = require('path');
      app.use(
        '/favicon.ico',
        express.static(path.join(__dirname, 'src/favicon.ico'))
      );
      app.use('/assets', express.static(path.join(__dirname, 'src/assets')));
    },

    env: {
      kind: 'chrome'
    },

    postprocessor: webpackPostprocessor,

    setup: function() {
      window.__moduleBundler.loadTests();
    },

    debug: true
  };
};
