const typescript = require('@rollup/plugin-typescript');
const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const replace = require('@rollup/plugin-replace');
const { dts } = require('rollup-plugin-dts');

module.exports = [
  {
    input: 'src/index.ts',
    output: [
      {
        file: 'dist/index.js',
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: 'dist/index.mjs',
        format: 'es',
        sourcemap: true,
      },
      {
        file: 'dist/index.umd.js',
        format: 'umd',
        name: 'ZhbrUniverUtils',
        sourcemap: true,
        globals: {
          '@univerjs/core': 'UniverCore',
          '@univerjs/sheets-data-validation': 'UniverSheetsDataValidation'
        }
      },
    ],
    external: ['@univerjs/core', '@univerjs/sheets-data-validation'],
    plugins: [
      replace({
        preventAssignment: true,
        values: {
          'process.env.NODE_ENV': JSON.stringify('production'),
          'process.env': JSON.stringify({}),
          'process.browser': JSON.stringify(true),
        }
      }),
      resolve({
        preferBuiltins: true,
        browser: true,
      }),
      commonjs({
        include: /node_modules/
      }),
      typescript({ 
        tsconfig: './tsconfig.json',
        sourceMap: true,
      }),
    ],
  },
  {
    input: 'src/index.ts',
    output: [{ file: 'dist/index.d.ts', format: 'es' }],
    plugins: [dts()],
  },
]; 