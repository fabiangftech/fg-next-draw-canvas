import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.cjs.js',
      format: 'cjs',
      sourcemap: true,
      exports: 'named'
    },
    {
      file: 'dist/index.esm.js',
      format: 'esm',
      sourcemap: true,
      exports: 'named'
    }
  ],
  plugins: [
    // Automatically externalize peerDependencies
    peerDepsExternal(),
    
    // Resolve node modules
    resolve({
      extensions: ['.js', '.jsx', '.ts', '.tsx']
    }),
    
    // Convert CommonJS modules to ES6
    commonjs(),
    
    // Process CSS files
    postcss({
      extensions: ['.css'],
      inject: true,
      extract: false,
      minimize: true
    }),
    
    // Compile TypeScript
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      declarationDir: 'dist',
      exclude: [
        '**/*.test.ts',
        '**/*.test.tsx',
        '**/*.stories.tsx',
        'src/App.tsx',
        'src/setupTests.ts',
        'src/reportWebVitals.ts'
      ]
    }),
    
    // Minify the output
    terser()
  ],
  
  // Suppress warnings for some common issues
  onwarn: (warning, warn) => {
    // Suppress "this is undefined" warnings
    if (warning.code === 'THIS_IS_UNDEFINED') return;
    warn(warning);
  },
  
  // Explicitly mark these as external
  external: ['react', 'react-dom', 'react/jsx-runtime']
};

