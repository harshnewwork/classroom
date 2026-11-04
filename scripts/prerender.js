import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');
const distSsrDir = path.resolve(rootDir, 'dist-ssr');

const routes = [
  '/',
  '/spaces',
  '/facilities',
  '/how-it-works',
  '/pricing',
  '/educators',
  '/contact',
  '/faq',
  '/404',
];

async function prerender() {
  console.log('\n🚀 Starting SEO Prerendering Pipeline...');

  // 1. Build the SSR bundle
  console.log('📦 Building SSR entry point...');
  execSync('npx vite build --ssr src/entry-server.jsx --outDir dist-ssr', {
    cwd: rootDir,
    stdio: 'inherit',
  });

  // 2. Read client index.html template
  const templatePath = path.resolve(distDir, 'index.html');
  if (!fs.existsSync(templatePath)) {
    throw new Error('dist/index.html not found. Run client build first.');
  }
  const rawTemplate = fs.readFileSync(templatePath, 'utf8');

  // 3. Import SSR render function
  const entryServerPath = path.resolve(distSsrDir, 'entry-server.js');
  // Cache-busting query to ensure fresh module
  const { render } = await import(`file://${entryServerPath}?t=${Date.now()}`);

  console.log('\n📄 Generating prerendered static HTML for each route:');

  for (const route of routes) {
    const helmetContext = {};
    const { html } = render(route, helmetContext);

    // In React 19, document metadata tags are hoisted to the front of renderToString output
    // Find where the visual application markup begins (cursor, header, main, nav, section, etc.)
    const bodyMatch = html.match(/(<div class="cursor-dot|<header|<main|<section|<div id="root")/);

    let headTags = '';
    let bodyMarkup = html;

    if (bodyMatch && bodyMatch.index !== undefined) {
      headTags = html.slice(0, bodyMatch.index);
      bodyMarkup = html.slice(bodyMatch.index);
    }

    // Also pull any JSON-LD script tags if present anywhere in markup and ensure they are placed in head
    const jsonLdMatches = bodyMarkup.match(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g) || [];
    if (jsonLdMatches.length > 0) {
      // Remove from bodyMarkup to prevent duplication
      for (const scriptTag of jsonLdMatches) {
        bodyMarkup = bodyMarkup.replace(scriptTag, '');
      }
      headTags += '\n' + jsonLdMatches.join('\n');
    }

    // Assemble final HTML
    let pageHtml = rawTemplate;

    // Replace the SEO head placeholder
    if (pageHtml.includes('<!-- SEO_HEAD_TAGS -->')) {
      pageHtml = pageHtml.replace('<!-- SEO_HEAD_TAGS -->', headTags);
    } else {
      pageHtml = pageHtml.replace('</head>', `${headTags}\n</head>`);
    }

    // Inject rendered application markup inside #root
    pageHtml = pageHtml.replace('<div id="root"></div>', `<div id="root">${bodyMarkup}</div>`);

    // Determine target file path
    let targetFile;
    if (route === '/') {
      targetFile = path.resolve(distDir, 'index.html');
    } else if (route === '/404') {
      targetFile = path.resolve(distDir, '404.html');
    } else {
      const cleanRoute = route.startsWith('/') ? route.slice(1) : route;
      const routeDir = path.resolve(distDir, cleanRoute);
      if (!fs.existsSync(routeDir)) {
        fs.mkdirSync(routeDir, { recursive: true });
      }
      targetFile = path.resolve(routeDir, 'index.html');
    }

    fs.writeFileSync(targetFile, pageHtml, 'utf8');

    // Extract title for reporting
    const titleMatch = headTags.match(/<title>(.*?)<\/title>/);
    const titleText = titleMatch ? titleMatch[1] : 'No title';
    const relativeTarget = path.relative(distDir, targetFile);

    console.log(`  ✓ ${route.padEnd(16)} → dist/${relativeTarget.padEnd(20)} [${(pageHtml.length / 1024).toFixed(1)} kB] | "${titleText.slice(0, 45)}..."`);
  }

  // 4. Clean up SSR bundle directory
  console.log('\n🧹 Cleaning up temporary SSR artifacts...');
  if (fs.existsSync(distSsrDir)) {
    fs.rmSync(distSsrDir, { recursive: true, force: true });
  }

  console.log('✨ All routes successfully prerendered with full metadata, titles, and schema!\n');
}

prerender().catch((err) => {
  console.error('❌ Prerender failed:', err);
  process.exit(1);
});

