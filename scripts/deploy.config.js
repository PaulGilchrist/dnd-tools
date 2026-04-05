/**
 * Deployment Configuration for GitHub Pages
 * 
 * This file controls how images are batched during deployment to avoid network issues.
 */

export default {
  /**
   * Number of images to process per batch
   * Recommended: 50-100 for most networks
   * Reduce to 25-30 if experiencing timeouts
   */
  batchSize: 50,

  /**
   * Maximum retries per batch before failing
   */
  maxRetries: 3,

  /**
   * Delay between batches in milliseconds
   */
  batchDelay: 1000,

  /**
   * Whether to show detailed progress logs
   */
  verbose: true,

  /**
   * Source directory for images relative to project root
   */
  imageSource: './src/assets/monsters',

  /**
   * Output directory for build
   */
  distDir: './dist',

  /**
   * Files to exclude from deployment
   */
  exclude: [
    '.git',
    'node_modules',
    '.batch-deploy-status.json',
    'DEPLOYMENT.md',
    'deploy.config.js'
  ],

  /**
   * GitHub Pages settings
   */
  githubPages: {
    branch: 'gh-pages',
    repo: process.env.GITHUB_REPOSITORY || 'PaulGilchrist/dnd-tools-react'
  }
};
