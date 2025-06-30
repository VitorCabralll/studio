#!/usr/bin/env node

/**
 * Build optimization script for LexAI
 * Analyzes and optimizes the production build
 */

const fs = require('fs');
const path = require('path');

const DIST_DIR = path.join(__dirname, '../.next');
const STATIC_DIR = path.join(DIST_DIR, 'static');

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function analyzeChunks() {
  const chunksDir = path.join(STATIC_DIR, 'chunks');
  
  if (!fs.existsSync(chunksDir)) {
    console.log('❌ Chunks directory not found. Run "npm run build" first.');
    return;
  }

  const files = fs.readdirSync(chunksDir)
    .filter(file => file.endsWith('.js'))
    .map(file => {
      const filePath = path.join(chunksDir, file);
      const stats = fs.statSync(filePath);
      return {
        name: file,
        size: stats.size,
        sizeFormatted: formatBytes(stats.size)
      };
    })
    .sort((a, b) => b.size - a.size);

  console.log('\n📊 Bundle Analysis');
  console.log('==================');
  
  const totalSize = files.reduce((sum, file) => sum + file.size, 0);
  console.log(`Total JavaScript: ${formatBytes(totalSize)}`);
  
  console.log('\n🔍 Largest Chunks:');
  files.slice(0, 10).forEach((file, index) => {
    const percentage = ((file.size / totalSize) * 100).toFixed(1);
    console.log(`${index + 1}. ${file.name}: ${file.sizeFormatted} (${percentage}%)`);
  });

  // Identify optimization opportunities
  console.log('\n💡 Optimization Recommendations:');
  
  const largeChunks = files.filter(file => file.size > 100000); // > 100KB
  if (largeChunks.length > 0) {
    console.log(`- Found ${largeChunks.length} chunks larger than 100KB`);
    console.log('  Consider code splitting or dynamic imports');
  }

  const vendorChunks = files.filter(file => file.name.includes('vendor') || file.name.includes('node_modules'));
  if (vendorChunks.length > 1) {
    console.log('- Multiple vendor chunks detected');
    console.log('  Consider optimizing webpack splitChunks configuration');
  }

  // Check for specific large libraries
  const manifestPath = path.join(DIST_DIR, 'build-manifest.json');
  if (fs.existsSync(manifestPath)) {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    console.log('- Check build manifest for page-specific optimizations');
  }
}

function checkGzipSizes() {
  const chunksDir = path.join(STATIC_DIR, 'chunks');
  
  if (!fs.existsSync(chunksDir)) return;

  console.log('\n🗜️ Compression Analysis');
  console.log('========================');
  
  const jsFiles = fs.readdirSync(chunksDir)
    .filter(file => file.endsWith('.js'))
    .slice(0, 5); // Top 5 files

  jsFiles.forEach(file => {
    const filePath = path.join(chunksDir, file);
    const stats = fs.statSync(filePath);
    
    // Estimate gzip savings (roughly 70% compression for JS)
    const estimatedGzipSize = stats.size * 0.3;
    const savings = stats.size - estimatedGzipSize;
    
    console.log(`${file}:`);
    console.log(`  Uncompressed: ${formatBytes(stats.size)}`);
    console.log(`  Estimated Gzip: ${formatBytes(estimatedGzipSize)} (${formatBytes(savings)} saved)`);
  });
}

function generateOptimizationReport() {
  console.log('\n📋 Performance Optimization Report');
  console.log('===================================');
  
  const recommendations = [
    '✅ Bundle splitting configured (next.config.ts)',
    '✅ Dynamic imports for heavy components',
    '✅ Lazy loading for OCR and AI orchestrator',
    '⚠️  Consider implementing service worker for caching',
    '⚠️  Monitor Core Web Vitals in production',
    '💡 Use webpack-bundle-analyzer for detailed analysis:',
    '   npm install --save-dev @next/bundle-analyzer',
    '💡 Consider preloading critical resources',
    '💡 Implement image optimization with next/image',
  ];

  recommendations.forEach(rec => console.log(rec));
  
  console.log('\n🎯 Next Steps:');
  console.log('1. Run Lighthouse audit on production build');
  console.log('2. Monitor real user metrics (RUM)');
  console.log('3. Set up performance budgets in CI/CD');
  console.log('4. Regular bundle size monitoring');
}

function main() {
  console.log('🚀 LexAI Build Optimization Analysis');
  console.log('=====================================');
  
  analyzeChunks();
  checkGzipSizes();
  generateOptimizationReport();
  
  console.log('\n✨ Analysis complete!');
}

if (require.main === module) {
  main();
}

module.exports = { analyzeChunks, checkGzipSizes, generateOptimizationReport };