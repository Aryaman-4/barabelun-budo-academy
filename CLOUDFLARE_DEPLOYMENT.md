# Deploying Barabelun Budo Academy to Cloudflare Pages

This website is 100% static (HTML, CSS, JavaScript, assets) and requires zero build steps or server configurations. It deploys in seconds to Cloudflare Pages for free worldwide hosting.

---

## 🚀 Option 1: 1-Click Drag & Drop (Fastest & Easiest)

1. Open your browser and navigate to the **[Cloudflare Dashboard](https://dash.cloudflare.com/)** (Sign in or sign up for free).
2. In the left navigation menu, click **Workers & Pages**.
3. Click the **Create application** button, then select the **Pages** tab.
4. Click **Upload assets** (Direct Upload).
5. Enter a project name: `barabelun-budo-academy` (or your preferred name).
6. Upload either:
   - The pre-packaged zip file:
     `barabelun-budo-academy-cloudflare.zip`
   - OR drag the entire `barabelun-budo-academy` folder directly into the browser upload box.
7. Click **Deploy site**.
8. Cloudflare will generate your live URL immediately:
   `https://barabelun-budo-academy.pages.dev`

---

## ⚡ Option 2: Deploy via Wrangler CLI

If you prefer deploying directly from your terminal:

1. Open your PowerShell or terminal in this directory:
   ```powershell
   cd C:\Users\Aryaman\.gemini\antigravity-ide\scratch\barabelun-budo-academy
   ```
2. Run wrangler login:
   ```bash
   npx wrangler login
   ```
   *(This will open your default browser to authorize your Cloudflare account).*
3. Deploy the site:
   ```bash
   npx wrangler pages deploy . --project-name barabelun-budo-academy
   ```

Alternatively, if you create a Cloudflare API Token with `Cloudflare Pages: Edit` permissions at [dash.cloudflare.com/profile/api-tokens](https://dash.cloudflare.com/profile/api-tokens):
```powershell
$env:CLOUDFLARE_API_TOKEN="your_api_token_here"
npx wrangler pages deploy . --project-name barabelun-budo-academy
```

---

## 🌐 Custom Domain Setup (Optional)
Once deployed on `*.pages.dev`, you can connect your custom domain (e.g. `barabelunbudo.com` or `karatedo.in`) for free in Cloudflare Pages:
1. Go to your project in the Cloudflare Dashboard.
2. Click **Custom domains** &rarr; **Set up a custom domain**.
3. Follow the DNS instructions to activate your custom URL with free automatic HTTPS.
