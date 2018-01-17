const path = require('path');
const webpack = require('webpack');
const HappyPack = require('happypack');

const srcPath = path.resolve(__dirname, 'app/src');
const distPath = path.resolve(__dirname, 'app/dist');

module.exports = {
	target: 'electron-renderer',
    context: srcPath,
    resolve: {
        alias: {
            states: path.resolve(srcPath, 'states'),
            utilities: path.resolve(srcPath, 'utilities'),
            components: path.resolve(srcPath, 'components'),
            api: path.resolve(srcPath, 'api')
        }
    },
    entry: {
        index: './index.jsx',
        vendor: ['react', 'react-dom']
    },
    output: {
        path: distPath,
        filename: '[name].bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: [/node_modules/],
                use: 'happypack/loader'
            }, {
                test: /\.css$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options : {
                            url: false
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({name: 'vendor', filename: 'vendor.bundle.js', minChunks: 2}), 
        new HappyPack({
            // 3) re-add the loaders you replaced above in #1:
            loaders: [ 
                {
                    loader: 'babel-loader',
                    query: {
                        presets: [
                            [
                                'es2015', {
                                    modules: false
                                }
                            ],
                            'react'
                        ],
                        plugins: [
                            'babel-plugin-transform-class-properties',
                            'transform-object-rest-spread'
                        ]
                    }
                }
            ]
        })
    ],
    devtool: 'cheap-source-map'
};
