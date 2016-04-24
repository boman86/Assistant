var elixir = require('laravel-elixir');
var fs = require('fs');

elixir.config.assetsPath = 'app';
elixir.config.publicPath = 'dist';
elixir.config.css.sass.folder = 'scss';
elixir.config.sourcemaps = false;

var themes = fs.readdirSync('app/scss/themes/');

elixir(function(mix) {
    themes.forEach(function(theme) {
        mix.sass('themes/' + theme);
    })
    mix.browserify('main.js');
})
