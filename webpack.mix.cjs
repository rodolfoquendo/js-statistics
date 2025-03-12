// webpack.mix.js

const mix = require('laravel-mix');
mix.setPublicPath('dist')
    .js('index.js', 'dist/rodolfoquendo-statistics.js');