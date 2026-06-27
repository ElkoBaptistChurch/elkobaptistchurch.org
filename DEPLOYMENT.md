# Deployment Guide — Elko Baptist Church Website

This guide walks through deploying the site to [Cloudflare Pages](https://pages.cloudflare.com), which is the recommended hosting platform for this project. The site is fully static, so no server configuration is required.

---

## Prerequisites

Before deploying, confirm you have the following:

- [ ] **Node.js 20 or newer** — check with `node --version`
- [ ] **npm** — included with Node.js
- [ ] **A Cloudflare account** — free tier is sufficient. Sign up at [cloudflare.com](https://cloudflare.com) if you do not have one.
- [ ] **The code in a GitHub repository** — required for Option A (dashboard deployment with continuous deployment)

---

## Option A: Deploy via Cloudflare Dashboard (Recommended)

This is the easiest option and sets up automatic deployments every time you push code changes to GitHub.

### Step 1 — Log in to Cloudflare

Go to [dash.cloudflare.com](https://dash.cloudflare.com) and log in to your account.

### Step 2 — Open Cloudflare Pages

In the left sidebar, click **Workers & Pages**, then click the **Pages** tab.

### Step 3 — Create a new project

Click the **Create application** button, then select **Pages**, then **Connect to Git**.

### Step 4 — Connect your GitHub repository

- Click **Connect GitHub** and authorize Cloudflare to access your repositories.
- Select the repository containing this project (e.g., `elkobaptistchurch.org`).
- Click **Begin setup**.

### Step 5 — Configure the build settings

Fill in the build configuration form exactly as shown:

| Setting | Value |
|---------|-------|
| Project name | `elko-baptist-church` (or your preferred name) |
| Production branch | `main` (or whichever branch is your main branch) |
| Build command | `npm run build` |
| Build output directory | `dist` |

### Step 6 — Set the Node.js version

Astro 5 requires Node.js 20 or newer. Cloudflare Pages defaults to an older version, so you must set it manually.

- Scroll down to the **Environment variables** section.
- Click **Add variable**.
- Set the variable name to `NODE_VERSION` and the value to `20`.

### Step 7 — Save and deploy

Click **Save and Deploy**. Cloudflare will pull the code, install dependencies, run `npm run build`, and publish the `dist/` folder. The first deploy typically takes about 60–90 seconds.

Once complete, your site will be live at a URL like `https://elko-baptist-church.pages.dev`.

---

## Option B: Deploy via Wrangler CLI

Use this option if you prefer the command line or need to deploy manually without a Git connection.

### Step 1 — Install Wrangler

```bash
npm install -g wrangler
```

### Step 2 — Log in to Cloudflare

```bash
wrangler login
```

This will open a browser window. Authorize Wrangler to access your account.

### Step 3 — Build the site

```bash
npm run build
```

The built site will be in the `dist/` folder.

### Step 4 — Deploy to Cloudflare Pages

```bash
wrangler pages deploy dist --project-name elko-baptist-church
```

Replace `elko-baptist-church` with your chosen Cloudflare Pages project name. If the project does not yet exist, Wrangler will prompt you to create it.

> **Note:** The Wrangler CLI deployment does not automatically set up continuous deployment. You will need to run these commands again each time you want to publish changes.

---

## Custom Domain Setup

After the initial deployment, connect the `elkobaptistchurch.org` domain.

### Step 1 — Open your Pages project

In the Cloudflare dashboard, go to **Workers & Pages**, select your project, and click the **Custom domains** tab.

### Step 2 — Add the domain

Click **Set up a custom domain** and type `elkobaptistchurch.org`. Click **Continue**.

Repeat this step to also add `www.elkobaptistchurch.org` if desired. Cloudflare Pages will automatically redirect `www` to the bare domain (or vice versa).

### Step 3 — Configure DNS

**If your domain is already managed through Cloudflare DNS:**

Cloudflare will add the necessary DNS records automatically. No further action is needed on your part.

**If your domain is registered elsewhere (GoDaddy, Namecheap, Google Domains, etc.):**

You will need to update your domain's nameservers to point to Cloudflare. Cloudflare will show you the nameserver values to enter. Log in to your domain registrar and update the nameservers. DNS propagation can take up to 48 hours, though it is usually much faster.

### HTTPS (SSL)

HTTPS is automatic and free through Cloudflare. Once the domain is connected and DNS has propagated, Cloudflare will provision a TLS certificate. No configuration is required.

---

## Environment Variables

The base static site does not require any environment variables to build or run.

If you set up **Cloudflare Pages Functions** for form handling (see README.md — Forms section), you will need to add the appropriate API keys:

| Variable | Used for |
|----------|----------|
| `RESEND_API_KEY` | Sending form submission emails via Resend (if using Pages Functions) |
| `NODE_VERSION` | Always set to `20` to ensure Astro builds correctly |

To add environment variables in the Cloudflare dashboard:
1. Open your Pages project.
2. Go to **Settings** > **Environment variables**.
3. Click **Add variable** under the **Production** section.
4. Enter the variable name and value, then click **Save**.

> **Warning:** Never commit API keys or secrets to your Git repository. Always set them as environment variables in the Cloudflare dashboard.

---

## Continuous Deployment

Once your GitHub repository is connected (Option A), Cloudflare Pages sets up continuous deployment automatically:

- Every push to your **production branch** (usually `main`) triggers a new production deployment.
- Every push to a **non-production branch** creates a preview deployment at a unique URL (like `https://abc123.elko-baptist-church.pages.dev`) — useful for reviewing changes before publishing them.
- Pull requests also get preview deployments, with a link posted in the GitHub PR.

You do not need to do anything extra to enable this — it works as soon as the GitHub connection is established.

---

## Build Performance Notes

| Metric | Expected |
|--------|----------|
| Build time | ~30 seconds (first run may be slightly longer as dependencies are cached) |
| Page cold start | Under 100ms (static files served from Cloudflare's edge network) |
| Global CDN | Yes — Cloudflare serves files from data centers around the world |
| Bandwidth | Generous free tier; a small church site will not approach limits |

---

## Cache Headers

Cloudflare Pages automatically serves static assets (images, fonts, JavaScript, CSS) with long cache durations. This means repeat visitors load the site almost instantly from their browser cache.

If you ever need to override cache behavior for specific files, create a `_headers` file in the `public/` folder. For example, to prevent caching on the home page:

```
/
  Cache-Control: no-cache
```

This file uses the same format as Netlify's `_headers` file.

---

## Redirects

URL redirect rules are already configured in `public/_redirects`. Cloudflare Pages reads this file automatically. The current redirects are:

| From | To | Type |
|------|----|------|
| `/watch` | YouTube channel | 302 (temporary) |
| `/facebook` | Facebook page | 302 (temporary) |
| `/livestream` | YouTube channel | 302 (temporary) |
| `/give` | `/contact/` | 302 (temporary) |

To add more redirects, edit `public/_redirects`. Each line follows the format:

```
/from-path   /to-path-or-url   302
```

Use `301` for permanent redirects (when you are sure the old URL will never be used again) and `302` for temporary ones.

---

## Troubleshooting Common Issues

### Build fails with a Node.js version error

**Symptom:** Cloudflare shows a build error mentioning Node.js version or Astro compatibility.

**Fix:** Make sure the `NODE_VERSION` environment variable is set to `20` in your Pages project settings (Settings > Environment variables).

---

### Fonts are not loading

**Symptom:** Headings appear in a generic serif or sans-serif font instead of Playfair Display or Inter.

**Fix:** Check that the Google Fonts `<link>` tag in `src/components/layout/BaseLayout.astro` is present and correctly formatted. Also check that your browser has internet access (Google Fonts requires an outbound request).

---

### Sitemap returns a 404

**Symptom:** Visiting `https://elkobaptistchurch.org/sitemap-index.xml` shows a 404 error.

**Fix:** The sitemap is generated at build time by `@astrojs/sitemap`. It will not exist until after a successful `npm run build`. Run a full production build and redeploy. After a successful deploy, the sitemap should be accessible.

---

### Contact or prayer request forms are not submitting

**Symptom:** Clicking the form submit button does nothing, or the page reloads without sending an email.

**Fix:** The site is static and requires a form handler to be configured. See the **Forms** section in `README.md` for step-by-step instructions. The three options are Cloudflare Pages Functions, Formspree, and Netlify Forms.

---

### Changes are not showing up after deploy

**Symptom:** You pushed a code change and the deploy completed, but the live site still shows the old version.

**Fix:**
1. Hard reload your browser: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac).
2. Check the Cloudflare Pages dashboard to confirm the latest deploy was successful and is marked as "Active."
3. If using a custom domain, wait a few minutes for Cloudflare's edge cache to update, or use the **Purge Cache** option in the Cloudflare dashboard under **Caching** > **Configuration**.

---

### Custom domain shows "Too many redirects" error

**Symptom:** After connecting the custom domain, the browser shows an infinite redirect error.

**Fix:** In the Cloudflare dashboard, go to your domain's **SSL/TLS** settings and make sure the encryption mode is set to **Full** or **Full (Strict)**, not **Flexible**. The Flexible setting causes a redirect loop when Cloudflare Pages is involved.
