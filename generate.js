const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const readline = require('readline');

// Read the Bruno logo and convert to base64 data URI
const logoPath = path.join(__dirname, 'bruno-logo.png');
let logoDataUri = '';
if (fs.existsSync(logoPath)) {
  const logoBase64 = fs.readFileSync(logoPath).toString('base64');
  logoDataUri = `data:image/png;base64,${logoBase64}`;
}

// Output directory
const outputDir = path.join(__dirname, 'output');

function getStandardTemplate(title, subtitle) {
  const logoHtml = logoDataUri 
    ? `<img src="${logoDataUri}" class="logo" />`
    : '<div class="logo-text">Bruno</div>';
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 1200px; height: 630px;
    background: #1F2937;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    display: flex; flex-direction: column; justify-content: center;
    padding: 80px;
    position: relative; overflow: hidden;
  }
  .accent-bar { position: absolute; top: 0; left: 0; right: 0; height: 6px; background: linear-gradient(90deg, #F4AA41, #E89B2F); }
  .logo { height: 72px; width: auto; object-fit: contain; position: absolute; bottom: 40px; left: 80px; }
  .logo-text { position: absolute; bottom: 40px; left: 80px; font-size: 36px; font-weight: 800; color: #F4AA41; }
  .title { font-size: 64px; font-weight: 800; color: #FFFFFF; line-height: 1.1; margin-bottom: 20px; max-width: 900px; }
  .subtitle { font-size: 28px; color: #9CA3AF; font-weight: 400; max-width: 800px; line-height: 1.4; }
  .corner-accent { position: absolute; bottom: 60px; right: 80px; font-size: 20px; color: #F4AA41; font-weight: 600; letter-spacing: 1px; }
</style></head><body>
  <div class="accent-bar"></div>
  ${logoHtml}
  <div class="title">${title}</div>
  <div class="subtitle">${subtitle}</div>
  <div class="corner-accent">usebruno.com</div>
</body></html>`;
}

function getVideoTemplate(title, subtitle) {
  const logoHtml = logoDataUri 
    ? `<img src="${logoDataUri}" class="logo" />`
    : '<div class="logo-text">Bruno</div>';
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 1280px; height: 720px;
    background: #1F2937;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    display: flex; flex-direction: column; justify-content: center;
    padding: 80px;
    position: relative; overflow: hidden;
  }
  .accent-bar { position: absolute; top: 0; left: 0; right: 0; height: 6px; background: linear-gradient(90deg, #F4AA41, #E89B2F); }
  .logo { height: 72px; width: auto; object-fit: contain; position: absolute; bottom: 40px; left: 80px; }
  .logo-text { position: absolute; bottom: 40px; left: 80px; font-size: 36px; font-weight: 800; color: #F4AA41; }
  .play-icon { position: absolute; bottom: 50px; right: 80px; width: 60px; height: 60px; background: #F4AA41; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
  .play-icon::after { content: ''; border-left: 20px solid #1F2937; border-top: 12px solid transparent; border-bottom: 12px solid transparent; margin-left: 4px; }
  .title { font-size: 72px; font-weight: 800; color: #FFFFFF; line-height: 1.1; margin-bottom: 20px; max-width: 1000px; }
  .subtitle { font-size: 32px; color: #9CA3AF; font-weight: 400; max-width: 900px; line-height: 1.4; }
</style></head><body>
  <div class="accent-bar"></div>
  ${logoHtml}
  <div class="title">${title}</div>
  <div class="subtitle">${subtitle}</div>
  <div class="play-icon"></div>
</body></html>`;
}

async function generateImage(title, subtitle, filename, type) {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const isVideo = type === 'video';
  const dimensions = isVideo ? { width: 1280, height: 720 } : { width: 1200, height: 630 };

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport(dimensions);

  const html = isVideo ? getVideoTemplate(title, subtitle) : getStandardTemplate(title, subtitle);
  await page.setContent(html, { waitUntil: 'domcontentloaded' });

  const outputPath = path.join(outputDir, `${filename}.png`);
  await page.screenshot({ path: outputPath, type: 'png' });
  await browser.close();

  const stats = fs.statSync(outputPath);
  const sizeKB = Math.round(stats.size / 1024);
  console.log(`\nGenerated: ${outputPath} (${sizeKB}KB)`);
}

function prompt(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => rl.question(question, answer => { rl.close(); resolve(answer); }));
}

async function main() {
  console.log('\nBruno OG Image Generator\n');
  
  const title = await prompt('Title: ');
  if (!title.trim()) {
    console.log('Error: Title is required');
    process.exit(1);
  }
  
  const subtitle = await prompt('Subtitle (optional): ');
  const filename = await prompt('Filename (without extension) [og-image]: ');
  const typeInput = await prompt('Type - standard (1200x630) or video (1280x720) [standard]: ');
  
  const type = typeInput.toLowerCase() === 'video' ? 'video' : 'standard';
  const finalFilename = filename.trim() || 'og-image';

  console.log('\nGenerating image...');
  await generateImage(title, subtitle || '', finalFilename, type);
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});