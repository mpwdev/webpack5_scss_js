module.exports = {
  plugins: {
    'postcss-preset-env': {
      autoprefixer: {
        grid: true,
      },
      stage: 3,
      features: {
        'nesting-rules': true,
        'logical-properties-and-values': false,
        'opacity-percentage': true,
        'text-decoration-shorthand': true,
      },
      browsers: '> 2%',
    },
  },
};

// https://preset-env.cssdb.org/features/#stage-0
// stage: 0 - experimental
// stage: 2 - personal or checking
// stage: 3 - better for clients project
// stage: 4 - most stable features available right now

//https://github.com/csstools/postcss-plugins/tree/main/plugin-packs/postcss-preset-env
