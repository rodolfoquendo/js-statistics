// webpack.mix.js

const mix = require('laravel-mix');
mix.setPublicPath('dist')
    .js('lib/Statistics.js', 'dist/rodolfoquendo-statistics.js');