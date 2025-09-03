// GitHub Integration Configuration
// TODO: Replace these with your actual GitHub repo details
export const GITHUB_OWNER = "your-username"; // Replace with your GitHub username/org
export const GITHUB_REPO = "your-repo-name"; // Replace with your repo name  
export const GITHUB_BRANCH = "main"; // Usually "main" or "master"

export const REMOTE_ASSET_BASE = 
  `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}/public/about-conditions`;

// Helper function to encode path components for URLs
export function encodePath(path: string): string {
  return path.split('/').map(encodeURIComponent).join('/');
}

// Asset source types
export type AssetSource = 'IMAGES_REMOTE' | 'PDF_REMOTE' | 'IMAGES_LOCAL' | 'PDF_LOCAL' | 'MISSING';

export interface AssetStatus {
  source: AssetSource;
  count?: number;
  error?: string;
}