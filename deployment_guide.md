# Deployment Guide - Portfolio at /portfolio

I've configured your portfolio to be deployment-ready. Here is how you can get it live on the internet at a URL like **`www.sinega.com/portfolio`**.

## 1. Fast & Free Deployment (Recommended)

### Option A: Vercel
1. Go to [Vercel](https://vercel.com/) and sign up.
2. Click **Add New** > **Project**.
3. Import your GitHub repository.
4. **Important**: In the **Build & Development Settings**:
   - Framework Preset: `Vite`
   - Build Command: `pnpm build`
   - Output Directory: `dist/public`
5. Click **Deploy**.

### Option B: Netlify
1. Go to [Netlify](https://www.netlify.com/) and sign up.
2. Click **Add New Site** > **Import from Git**.
3. Choose your repository.
4. **Build settings**:
   - Base directory: `/` (Root)
   - Build command: `pnpm build`
   - Publish directory: `dist/public`
5. Click **Deploy Site**.

## 2. Using a Custom Domain (e.g., sinega.com/portfolio)

> [!TIP]
> To use a URL like `https://sinega.com/portfolio`, follow these steps:

1. **Buy a Domain**: Purchase a domain from Namecheap, GoDaddy, or Google Domains.
2. **Connect to Host**: In Vercel or Netlify settings, go to **Domains** and add `sinega.com`.
3. **DNS Setup**: Follow the host's instructions to point your DNS (A records or CNAME) to their servers.
4. **Subpath Hosting**: Since I've already configured `base: "/portfolio/"` in the code, simply hosting the build in a folder named `portfolio` on your server will work perfectly.

## 3. GitHub Pages Deployment
If you want to host it entirely for free on GitHub:
1. Go to your repo **Settings** > **Pages**.
2. Select **GitHub Actions** as the source.
3. Your site will automatically build and deploy every time you push code!

---

**Current Status**: 
- **Build**: Successfully verified (`pnpm build`).
- **Assets**: All point to `/portfolio/`.
- **Routing**: `wouter` is configured with `base="/portfolio"`.

*Happy Deploying!*
