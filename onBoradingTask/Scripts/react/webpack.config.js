module.exports = {
    mode: 'development',
    context: __dirname,
    entry: {
        Home: "./index.jsx",
        Customer: "./Customer/CustomerIndex.jsx",
        Sales: "./Sales/SalesIndex.jsx",
        Product: "./Product/ProductIndex.jsx",
        Store: "./Store/StoreIndex.jsx"
    },
    output: {
        path: __dirname + "/dist",
        filename: "[name].bundle.js"
    },
    watch: true,
    module: {
        rules: [{
            test: /\.jsx?$/,
            exclude: /(node_modules)/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env', '@babel/preset-react']
                }
            }
        }]
    }
}
