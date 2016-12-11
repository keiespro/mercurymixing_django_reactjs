import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import autoprefixer from 'autoprefixer';
import path from 'path';

const ENV = process.env.NODE_ENV || 'development';

const PORT = process.env.PORT || 8080;

const CSS_MAPS = ENV!=='production';

module.exports = {
	entry: {
		mixing: './src/index.js',
		classic: './src/classic/classic.js'
	},

	output: {
		path: path.resolve(__dirname, '../static/build'),
		publicPath: ENV !== 'production' ? `http://localhost:${PORT}/` : '/',
		filename: '[name].js'
	},

	resolve: {
		extensions: ['', '.jsx', '.js', '.json', '.scss'],
		modulesDirectories: [
			path.resolve(__dirname, 'src/lib'),
			path.resolve(__dirname, 'node_modules'),
			'node_modules'
		],
		alias: {
			components: path.resolve(__dirname, 'src/components'),		// used for tests
			style: path.resolve(__dirname, 'src/style'),
			'react': 'preact-compat',
			'react-dom': 'preact-compat'
		}
	},

	module: {
		preLoaders: [
			{
				test: /\.jsx?$/,
				loader: 'eslint',
				include: /src\//,
			},
			{
				test: /\.jsx?$/,
				exclude: /src\//,
				loader: 'source-map'
			}
		],
		loaders: [
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				loader: 'babel'
			},
			{
				test: /\.s?css$/,
				include: /src\/style\//,
				loader: ExtractTextPlugin.extract('style', [
					`css?sourceMap=${CSS_MAPS}`,
					`postcss?sourceMap=${CSS_MAPS}`,
					`sass?sourceMap=${CSS_MAPS}`
				].join('!'))
			},
			{
				test: /\.json$/,
				loader: 'json'
			},
			{
				test: /\.(xml|html|txt|md)$/,
				loader: 'raw'
			},
			{
				test: /\.(svg|woff2?|ttf|eot|jpe?g|png|gif)(\?.*)?$/i,
				loader: ENV==='production' ? 'file?name=[path][name]_[hash:base64:5].[ext]' : 'url'
			}
		]
	},

	postcss: () => [
		autoprefixer({ browsers: 'last 2 versions' })
	],

	plugins: ([
		new webpack.NoErrorsPlugin(),
		new ExtractTextPlugin('[name].css', {
			allChunks: true,
			disable: ENV!=='production'
		}),
		new webpack.DefinePlugin({
			'process.env': JSON.stringify({ NODE_ENV: ENV })
		})
	]).concat(ENV === 'production' ? [
		new webpack.optimize.DedupePlugin(),
		new webpack.optimize.OccurenceOrderPlugin()
	] : []),

	stats: { colors: true },

	node: {
		global: true,
		process: false,
		Buffer: false,
		__filename: false,
		__dirname: false,
		setImmediate: false
	},

	devtool: ENV==='production' ? 'source-map' : 'cheap-module-eval-source-map',

	devServer: {
		port: PORT,
		host: '0.0.0.0',
		colors: true,
		stats: 'errors-only',
		publicPath: '/',
		contentBase: './src',
		historyApiFallback: true,
		proxy: {
			// OPTIONAL: proxy configuration:
			// '/optional-prefix/**': { // path pattern to rewrite
			// 	target: 'http://target-host.com',
			// 	pathRewrite: path => path.replace(/^\/[^\/]+\//, '')   // strip first path segment
			// }
		}
	}
};
