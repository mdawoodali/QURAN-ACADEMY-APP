const fs = require('fs');
const path = require('path');

const featureName = process.argv[2];
if (!featureName) {
  console.error("Please provide a feature name: pnpm gen:feature <name>");
  process.exit(1);
}

const basePath = path.join(__dirname, '..', 'apps', 'web', 'src', 'features', featureName);

const folders = ['components', 'hooks', 'server', 'schemas', 'types', 'tests'];

fs.mkdirSync(basePath, { recursive: true });
folders.forEach(f => fs.mkdirSync(path.join(basePath, f), { recursive: true }));

fs.writeFileSync(path.join(basePath, 'index.ts'), `// Public API for ${featureName}\n`);
fs.writeFileSync(path.join(basePath, 'tests', 'index.test.ts'), `import { describe, it, expect } from 'vitest';\n\ndescribe('${featureName}', () => {\n  it('should work', () => {\n    expect(true).toBe(true);\n  });\n});\n`);

console.log(`Generated feature slice: ${featureName}`);
