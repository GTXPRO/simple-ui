/* eslint-disable */
const webpack = require('webpack');
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const publicPath = '/assets/dist/js/v5/';
const nameFile = '[sha512:hash:base64:7].[ext]';

function recursiveIssuer(m) {
	if (m.issuer) {
		return recursiveIssuer(m.issuer);
	} else if (m.name) {
		return m.name;
	} else {
		return false;
	}
}

module.exports = {
	entry: {
		app: './src/index.js'
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'index.min.js',
		publicPath: "/assets/dist/js/v5/",
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: ['babel-loader']
			},
			{
				test: /\.html$/,
				//loader: "text-loader",
				use: [{
					loader: 'html-loader',
					options: {
						attributes: {
							list: [
								{
									tag: 'img',
									attribute: 'src',
									type: 'src',
								}
							],
						},
						minimize: true,
					}
				}]
			},
			{//Build css vào file bundle js
				test: /\.(sa|sc|c)ss$/,
				//use: ['style-loader', MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
				use: ['style-loader', MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
			},
			{
				test: /\.(jpeg|jpg|gif|png|PNG|ico|ogg)$/,
				//loader: 'file-loader?emitFile=false&name=[path][name].[ext]' // Sửa đường dẫn file ảnh trong css thì setup variables: publicPath: [path]
				use: [{
					loader: 'file-loader',
					options: {
						//publicPath: publicPath,
						name: nameFile
					}
				}]
			},
			{
				test: /\.(ttf|eot|svg|woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
				//loader: "file-loader?emitFile=false&name=[path][name].[ext]" // Sửa đường dẫn file ảnh trong css thì setup variables: publicPath: [path]
				use: [{
					loader: 'file-loader',
					options: {
						//publicPath: publicPath,
						name: nameFile
					}
				}]
			},
			{ 
				test: /\.svg/,
				//loader: 'url-loader?emitFile=false&limit=10000&mimetype=image/svg+xml' // Sửa đường dẫn file ảnh trong css thì setup variables: publicPath: [path]
				use: [{
					loader: 'url-loader',
					options: {
						mimetype: 'image/svg+xml',
						limit: 10000,
						//publicPath: publicPath,
						name: nameFile
					}
				}]
			}
		],
	},
	resolve: {
		modules: [
			path.resolve('./node_modules'),
			path.resolve(__dirname)
		],
		alias: {
			'@': path.join(__dirname, 'src')
		},
		extensions: ['.js'],
	},
	plugins: [
		new CleanWebpackPlugin({
			cleanOnceBeforeBuildPatterns: [path.resolve(__dirname, 'dist')]
		}), // Webpack clean thư mục build
		new HtmlWebpackPlugin({
			inject: false,
			hash: true,
			headerHasShadow: false,
			template: './src/index.ejs',
			filename: '../build.html',
			minify: false,
		}), //Generate file inden.html auto import css, javascript vào file template ejs
		new webpack.ProvidePlugin({
		}),
		new BundleAnalyzerPlugin(), //Xem file bundle
		//new CompressionPlugin({ asset: "[path].gz[query]", algorithm: "gzip", test: /\.(js|css|html)$/, threshold: 10240, minRatio: 0.8 }),// Build gzip file
		new MiniCssExtractPlugin({ filename: 'styles.[chunkhash].css' }), //Build ra file bundle css
		new WebpackManifestPlugin(),
	],
	optimization: {
		minimizer: [
			new TerserPlugin({
				test: /\.js(\?.*)?$/i,
				terserOptions: {
					ecma: undefined,
					warnings: false,
					parse: {},
					compress: {},
					mangle: true, // Note `mangle.properties` is `false` by default.
					module: false,
					output: null,
					toplevel: false,
					nameCache: null,
					ie8: false,
					keep_classnames: undefined,
					keep_fnames: true,
					safari10: false,
					output: {
						comments: false,
					},
				},
				extractComments: false
			}),
			new OptimizeCSSAssetsPlugin({
				cssProcessor: require('cssnano'),
				cssProcessorOptions: {
					preset: ['default', { discardComments: { removeAll: true } }],
				},
				canPrint: true
			}) //Minify bundle css
		],
		// splitChunks: {
		// 	cacheGroups: {
		// 		default: false,
		// 		vendors: false,
		// 		styles: false,
		// 		vendor: {
		// 			test: /[\\/]node_modules|public\/js[\\/]/,
		// 			name: "vendor",
		// 			//filename: "[name].[chunkhash].js",
		// 			chunks: 'all',
		// 			enforce: true
		// 		},
		// 		styles: {
		// 			name: 'styles',
		// 			test: /\.css$/,
		// 			chunks: 'all',
		// 			enforce: true
		// 		}
		// 	}
		// }
	},
	performance: { hints: false },
	mode: 'production'
};