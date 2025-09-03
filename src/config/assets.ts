// GitHub Integration Configuration
// TODO: Replace these with your actual GitHub repo details
export const GITHUB_OWNER = "your-username"; // Replace with your GitHub username/org
export const GITHUB_REPO = "your-repo-name"; // Replace with your repo name  
export const GITHUB_BRANCH = "main"; // Usually "main" or "master"

export const REMOTE_ASSET_BASE = 
  `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}/public/about-conditions`;

// Helper functions
function enc(p: string): string {
  return p.split('/').map(encodeURIComponent).join('/');
}

export function remoteSlidesJson(title: string): string {
  const f = enc(title);
  return `${REMOTE_ASSET_BASE}/${f}/slides.json`;
}

export function remotePdf(title: string): string {
  const f = enc(title);
  return `${REMOTE_ASSET_BASE}/${f}/${f}.pdf`;
}