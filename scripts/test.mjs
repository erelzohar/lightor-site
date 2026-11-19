/**
 * LT-695: the site's tests (`npm test`). No test dependency: Node's own runner
 * (node:test), with each tests/*.test.mjs loaded through Vite, so a test
 * imports the site's TypeScript exactly as the build does.
 */
import { readdirSync } from 'node:fs';
import { createServer } from 'vite';

const server = await createServer({
  configFile: false,
  appType: 'custom',
  logLevel: 'error',
  server: { middlewareMode: true, hmr: false, watch: null },
  optimizeDeps: { noDiscovery: true, include: [] },
});
try {
  const files = readdirSync('tests').filter((name) => name.endsWith('.test.mjs')).sort();
  if (!files.length) throw new Error('no tests found in tests/');
  for (const file of files) await server.ssrLoadModule(`/tests/${file}`);
} finally {
  await server.close();
}
