import { optimizeSlideImages } from './vite.image-optimizer.ts';

console.log('🔧 Running image optimization test...\n');

try {
  await optimizeSlideImages();
  console.log('\n✅ Optimization test completed successfully!');
} catch (error) {
  console.error('❌ Optimization test failed:', error);
  process.exit(1);
}