const { writeFileSync, readFileSync } = require('fs');

writeFileSync(
  './manifest.json',
  JSON.stringify(
    {
      ...JSON.parse(readFileSync('./manifest-template.json', { encoding: 'utf8' })),
      background: { service_worker: 'dist/background.js', type: 'module' },
    },
    null,
    2,
  ),
  { encoding: 'utf8' },
);
