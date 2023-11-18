const { writeFileSync, readFileSync } = require('fs');

writeFileSync(
  './manifest.json',
  JSON.stringify(
    {
      ...JSON.parse(readFileSync('./manifest-template.json', { encoding: 'utf8' })),
      background: { page: 'dist/background.html' },
      browser_specific_settings: { gecko: { id: 'contact@ntx.fi' } },
    },
    null,
    2,
  ),
  { encoding: 'utf8' },
);
