import typescript from '@rollup/plugin-typescript';
import nodeResolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

export default {
  input: 'src/custom-bottom-nav.ts',
  output: {
    file: 'dist/custom-bottom-nav.js',
    format: 'es',
    sourcemap: false
  },
  plugins: [
    nodeResolve(),
    typescript({
      tsconfig: './tsconfig.json'
    }),
    terser({
      format: {
        comments: false
      }
    })
  ]
};