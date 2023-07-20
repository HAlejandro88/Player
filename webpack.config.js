const path = require('path');

module.exports = {
  entry: './Player.js', // Ruta al archivo de entrada principal
  output: {
    filename: 'bundle.js', // Nombre del archivo de salida
    path: path.resolve(__dirname, 'dist'), // Ruta de salida
  },
  module: {
    rules: [
      {
        test: /\.js$/, // Aplicar la configuración a archivos .js
        exclude: /node_modules/, // Excluir la carpeta node_modules
        use: {
          loader: 'babel-loader', // Utilizar Babel como loader
          options: {
            presets: ['@babel/preset-env'], // Preset de Babel a utilizar
          },
        },
      },
    ],
  },
};
