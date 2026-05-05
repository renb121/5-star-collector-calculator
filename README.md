# 5 Star Collector Calculator

A React app that helps plumbing businesses visualize their review gap and revenue impact.

## Setup Instructions

### 1. Clone or Download This Project

```bash
# If you have git installed:
git clone <your-repo-url>
cd 5-star-collector-calculator

# If downloading as ZIP, just extract it to a folder
```

### 2. Install Dependencies

Make sure you have Node.js installed (download from nodejs.org if needed).

```bash
npm install
```

### 3. Test Locally

```bash
npm run dev
```

This will open the app at `http://localhost:3000`. You can test the calculator locally before deploying.

### 4. Deploy to Netlify

**Option A: Using GitHub (Recommended)**

1. Create a free GitHub account if you don't have one (github.com)
2. Create a new public repository called `5-star-collector-calculator`
3. Upload all these files to the repository
4. Go to netlify.com and sign in with GitHub
5. Click "New site from Git" → Connect to GitHub → Select your repository
6. Leave all the build settings as default (Netlify will auto-detect)
7. Click "Deploy site"
8. Wait ~2 minutes and you'll get a live URL like `https://[random-name].netlify.app`

**Option B: Manual Upload**

1. Run `npm run build` in your terminal
2. This creates a `dist` folder with your built site
3. Go to netlify.com
4. Drag and drop the `dist` folder onto the page
5. You get a live URL instantly

### 5. Customize

Edit `src/App.jsx` to change:
- Form labels
- Output messaging
- Revenue calculations
- CTA text or phone handling

After making changes and pushing to GitHub, Netlify auto-deploys!

## File Structure

```
├── src/
│   ├── App.jsx          (The calculator component)
│   ├── main.jsx         (Entry point)
│   └── index.css        (Tailwind styles)
├── index.html           (Main HTML file)
├── package.json         (Dependencies)
├── vite.config.js       (Build config)
├── tailwind.config.js   (Tailwind config)
└── postcss.config.js    (CSS config)
```

## Next Steps

- Customize the API prompt in App.jsx to match your exact positioning
- Test with real plumber names to see results
- Set up form backend to capture phone numbers
- Add Google Analytics to track conversions
