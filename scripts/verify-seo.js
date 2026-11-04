import fs from 'node:fs';

const routes = [
  { file: 'dist/index.html', route: '/' },
  { file: 'dist/spaces/index.html', route: '/spaces' },
  { file: 'dist/facilities/index.html', route: '/facilities' },
  { file: 'dist/how-it-works/index.html', route: '/how-it-works' },
  { file: 'dist/pricing/index.html', route: '/pricing' },
  { file: 'dist/educators/index.html', route: '/educators' },
  { file: 'dist/contact/index.html', route: '/contact' },
  { file: 'dist/faq/index.html', route: '/faq' },
  { file: 'dist/404.html', route: '/404' }
];

console.log('\n--- VERIFYING STATIC PRERENDERED HTML FILES ---');
let allPassed = true;

for (const r of routes) {
  if (!fs.existsSync(r.file)) {
    console.error(`MISSING FILE: ${r.file}`);
    allPassed = false;
    continue;
  }
  const content = fs.readFileSync(r.file, 'utf8');
  const title = (content.match(/<title>(.*?)<\/title>/) || [])[1] || 'NONE';
  const desc = (content.match(/<meta name="description" content="(.*?)"/) || [])[1] || 'NONE';
  const h1Match = content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
  const h1 = h1Match ? h1Match[1].replace(/<[^>]+>/g, '').trim() : 'NONE';
  const canonical = (content.match(/<link rel="canonical" href="(.*?)"/) || [])[1] || 'NONE';
  const jsonLdCount = (content.match(/application\/ld\+json/g) || []).length;

  console.log(`\nRoute: ${r.route} (${r.file})`);
  console.log(`  Title:     ${title}`);
  console.log(`  Desc:      ${desc}`);
  console.log(`  H1:        ${h1}`);
  console.log(`  Canonical: ${canonical}`);
  console.log(`  JSON-LD:   ${jsonLdCount} block(s)`);

  if (title === 'NONE' || desc === 'NONE' || h1 === 'NONE' || canonical === 'NONE') {
    allPassed = false;
    console.warn(`  ⚠️ Missing required SEO tag in ${r.file}`);
  }
}

if (allPassed) {
  console.log('\n✅ ALL ROUTES PASSED VERIFICATION WITH COMPLETE STATIC SEO CONTENT!\n');
} else {
  console.error('\n❌ SOME CHECKS FAILED!\n');
  process.exit(1);
}

