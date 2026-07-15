import { defineConfig } from 'vitest/config';

export default defineConfig({
  define: {
    'import.meta.env.DEV': 'false'
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts']
  }
});
