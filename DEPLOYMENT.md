# Deployment Workflow: GitHub Pages

This workflow allows you to deploy the **Sales Funnel Dashboard** to GitHub Pages directly from your repository.

## 🏗️ Prerequisites
1. Create a new repository on GitHub.
2. Push your code to the repository.

## 🚀 Steps to Deploy

### 1. Install Deployment Package
In your terminal, within the `dashboard` directory, run:
```bash
npm install gh-pages --save-dev
```

### 2. Update `package.json`
Add these fields to your `dashboard/package.json`:
- **homepage**: `"https://[your-username].github.io/[your-repo-name]"`
- **scripts**: 
  - `"predeploy": "npm run build"`
  - `"deploy": "gh-pages -d dist"`

### 3. Deploy
Run the following command:
```bash
npm run deploy
```

---

## 🛠️ GitHub Actions (Automated)
Alternatively, you can create `.github/workflows/deploy.yml` with the following content for automatic deployment on every push:

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [ main ]
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout 🛎️
        uses: actions/checkout@v3

      - name: Install and Build 🔧
        run: |
          cd dashboard
          npm install
          npm run build

      - name: Deploy 🚀
        uses: JamesIves/github-pages-deploy-action@v4
        with:
          folder: dashboard/dist
```
