/* eslint-disable */
const webpack = require('webpack');
const path = require('path');
const fs = require('fs');

// Plugins
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = env => {
	return {
		entry: {
			app: './src/index.js',
		},

		output: {
			path: path.resolve(__dirname, 'dist'),
			filename: '[name].bundle.js',
		},

		module: {
			rules: [
				{
					test: /\.(js|jsx)$/,
					exclude: /node_modules/,
					use: ['babel-loader'],
				},
				{
					test: /\.html$/,
					loader: 'text-loader',
				},
				{
					test: /\.(sa|sc|c)ss$/,
					use: ['style-loader', 'css-loader', 'sass-loader'],
				},
				{
					test: /\.(jpe?g|gif|png|PNG|ico|ogg)$/,
					use: [{
						loader: 'file-loader',
						options: {
							name: '[path][name].[ext]',
							emitFile: false,
						},
					}],
				},
				{
					test: /\.(ttf|eot|svg|woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
					use: [{
						loader: 'file-loader',
						options: {
							name: '[path][name].[ext]',
							emitFile: false,
						},
					}],
				},
				{
					test: /\.svg/,
					use: [{
						loader: 'url-loader',
						options: {
							limit: 10000,
							emitFile: false,
							mimetype: 'image/svg+xml'
						}
					}]
				},
				{ test: /\.ejs$/, use: ['ejs-loader'] },
			],
		},

		resolve: {
			modules: [
				path.resolve('./node_modules'),
				path.resolve(__dirname),
			],

			alias: {
				'@': path.join(__dirname, 'src')
			},

			extensions: ['.js'],
		},
		plugins: [
			new webpack.ProvidePlugin({}),
			new CleanWebpackPlugin({
				cleanOnceBeforeBuildPatterns: [path.resolve(__dirname, 'dist')]
			}),
			new HtmlWebpackPlugin({
				template: './index.html',
			})
		],

		optimization: {
			minimizer: [],
			splitChunks: {
				cacheGroups: {
					default: false,
					vendors: false,
					vendor: {
						test: /[\\/]node_modules[\\/]/,
						name: 'vendor',
						// filename: '[name].bundle.js',
						chunks: 'all',
						// enforce: true,
					},
				},
			},
		},
		devServer: {
			contentBase: __dirname,
			historyApiFallback: true,
			contentBase: './',
			compress: true,
			port: 9000,
			hot: true,
			inline: true,
			// quiet: false,
			// noInfo: false,
			// stats: {
			// 	all: false,
			// 	wds: false,
			// 	assets: false,
			// 	colors: false,
			// 	version: false,
			// 	hash: false,
			// 	timings: false,
			// 	chunks: false,
			// 	chunkModules: false,
			// }
		},
		mode: 'development'
	}
};