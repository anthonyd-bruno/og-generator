# Bruno OG Image Generator

A standalone tool for generating Open Graph (social media preview) images for Bruno.

## What It Does

Generates professional-looking social media preview images with:
- Custom title and subtitle text
- Bruno branding and logo
- Two format options: standard OG images (1200x630) or video thumbnails (1280x720)

## Prerequisites

- Node.js (v14 or higher recommended)
- npm

## Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd og-generator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Ensure the Bruno logo exists**
   - The tool expects `bruno-logo.png` in the root directory
   - If missing, it will fall back to text-based branding

## Usage

Run the generator:
```bash
npm run generate
```

You'll be prompted for:
- **Title** (required) - Main heading text
- **Subtitle** (optional) - Secondary text below the title
- **Filename** (optional) - Output filename without extension (defaults to "og-image")
- **Type** (optional) - Either "standard" or "video" (defaults to "standard")

### Example Session

```
Bruno OG Image Generator

Title: Introducing Bruno v1.0
Subtitle: The open-source API client
Filename (without extension) [og-image]: bruno-v1-launch
Type - standard (1200x630) or video (1280x720) [standard]: standard

Generating image...

Generated: /path/to/output/bruno-v1-launch.png (45KB)
```

## Output

Generated images are saved to the `output/` directory as PNG files.

### Image Formats

**Standard (1200x630px)**
- Optimized for Open Graph social media previews
- Used by Twitter, Facebook, LinkedIn, etc.

**Video (1280x720px)**
- 16:9 aspect ratio for video thumbnails
- Includes a play button icon
- Suitable for YouTube thumbnails and video previews

## Design

Both templates feature:
- Dark gray background (#1F2937)
- Orange accent gradient bar
- Bruno logo (bottom-left)
- Clean, modern typography
- Responsive text sizing

## Technical Details

- **Puppeteer** - Uses headless Chrome to render HTML templates as images
- **Base64 Logo** - Embeds the logo directly in HTML for self-contained rendering
- **Inline CSS** - All styling is embedded in the HTML template

## File Structure

```
og-generator/
├── generate.js       # Main script
├── bruno-logo.png    # Bruno logo (required)
├── package.json      # Dependencies
├── output/           # Generated images (created automatically)
└── README.md         # This file
```

## Troubleshooting

**"Error: Title is required"**
- You must provide a title when prompted

**Missing logo**
- Ensure `bruno-logo.png` exists in the root directory
- The tool will work without it but use text branding instead

**Puppeteer installation issues**
- Puppeteer downloads Chromium automatically
- If it fails, try: `npm install puppeteer --unsafe-perm=true`

## License

Part of the Bruno project.

