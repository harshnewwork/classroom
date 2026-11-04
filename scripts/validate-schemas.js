import fs from 'node:fs';

const files = [
  'dist/index.html',
  'dist/spaces/index.html',
  'dist/facilities/index.html',
  'dist/how-it-works/index.html',
  'dist/pricing/index.html',
  'dist/educators/index.html',
  'dist/contact/index.html',
  'dist/faq/index.html',
  'dist/404.html'
];

console.log('\n--- VALIDATING JSON-LD SCHEMAS ---');
let allValid = true;

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  const scriptRegex = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g;
  let match;
  let count = 0;

  while ((match = scriptRegex.exec(content)) !== null) {
    count++;
    try {
      const json = JSON.parse(match[1]);
      if (!json['@context'] || !json['@type']) {
        console.error(`❌ In ${file}: Schema missing @context or @type`, json);
        allValid = false;
      }
    } catch (err) {
      console.error(`❌ In ${file}: JSON Parse Error:`, err.message);
      allValid = false;
    }
  }
  console.log(`✓ ${file.padEnd(28)}: ${count} valid JSON-LD schema block(s)`);
}

if (allValid) {
  console.log('\n✅ ALL JSON-LD SCHEMAS VALIDATED SUCCESSFULLY!\n');
} else {
  console.error('\n❌ SCHEMA VALIDATION FAILED!\n');
  process.exit(1);
}

