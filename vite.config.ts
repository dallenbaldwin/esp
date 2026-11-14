import vue from '@vitejs/plugin-vue2';
import { defineConfig } from 'vite-plus';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      vue: 'vue/dist/vue.esm.js',
    },
  },
  staged: {
    '*': 'vp check --fix',
  },
  fmt: {
    jsdoc: true,
    printWidth: 80,
    singleQuote: true,
    semi: true,
    singleAttributePerLine: true,
    sortImports: true,
  },
  lint: {
    jsPlugins: [{ name: 'vite-plus', specifier: 'vite-plus/oxlint-plugin' }],
    rules: { 'vite-plus/prefer-vite-plus-imports': 'error' },
    options: { typeAware: true, typeCheck: true },
  },
});
