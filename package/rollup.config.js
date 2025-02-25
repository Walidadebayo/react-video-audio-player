import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import replace from '@rollup/plugin-replace';
import ignore from 'rollup-plugin-ignore-import';

const config = [
  {
    input: 'src/index.tsx',
    output: [
      {
        file: 'dist/index.umd.js',
        format: 'umd',
        name: 'ReactVideoAudioPlayer',
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    ],
    external: ['react', 'react-dom'],
    plugins: [
      resolve(),
      commonjs(),
      typescript(),
      replace({
        'process.env.NODE_ENV': JSON.stringify('production'),
        preventAssignment: true,
      }),
      terser(),
      ignore({
        extensions: ['.css'],
      }),
    ],
  },
  {
    input: 'src/index.standalone.ts',
    output: {
      file: 'dist/index.standalone.js',
      format: 'umd',
      name: 'StandaloneVideoAudioPlayer',
    },
    plugins: [
      resolve(),
      commonjs(),
      typescript(),
      replace({
        'process.env.NODE_ENV': JSON.stringify('production'),
        preventAssignment: true,
      }),
      terser(),
      ignore({
        extensions: ['.css'],
      }),
    ],
  },
];

export default config;