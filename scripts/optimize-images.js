#!/usr/bin/env node

import { glob } from 'glob';
import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';

const MAX_WIDTH = 1600;
const WEBP_QUALITY = 80;

async function getFileSize(filePath) {
  try {
    const stats = await fs.stat(filePath);
    return stats.size;
  } catch (error) {
    return 0;
  }
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

async function optimizeImage(inputPath) {
  try {
    const metadata = await sharp(inputPath).metadata();
    const originalSize = await getFileSize(inputPath);
    
    console.log(`Processing: ${inputPath}`);
    console.log(`  Original: ${metadata.width}x${metadata.height} (${formatBytes(originalSize)})`);
    
    // Generate output path with .webp extension
    const parsedPath = path.parse(inputPath);
    const outputPath = path.join(parsedPath.dir, parsedPath.name + '.webp');
    
    // Optimize the image
    let sharpInstance = sharp(inputPath);
    
    // Resize if width exceeds MAX_WIDTH
    if (metadata.width && metadata.width > MAX_WIDTH) {
      sharpInstance = sharpInstance.resize(MAX_WIDTH, null, {
        withoutEnlargement: true,
        fit: 'inside'
      });
    }
    
    // Convert to WebP with quality setting
    await sharpInstance
      .webp({ quality: WEBP_QUALITY })
      .toFile(outputPath);
    
    const optimizedSize = await getFileSize(outputPath);
    const savings = ((originalSize - optimizedSize) / originalSize * 100).toFixed(1);
    
    console.log(`  Optimized: WebP (${formatBytes(optimizedSize)}) - ${savings}% smaller`);
    
    // If we created a .webp file and original wasn't .webp, remove the original
    if (!inputPath.endsWith('.webp')) {
      await fs.unlink(inputPath);
      console.log(`  Removed original: ${inputPath}`);
    }
    
    return {
      originalPath: inputPath,
      optimizedPath: outputPath,
      originalSize,
      optimizedSize,
      savings: parseFloat(savings)
    };
  } catch (error) {
    console.error(`Error processing ${inputPath}:`, error.message);
    return null;
  }
}

async function updateSlidesJson(conditionDir, optimizations) {
  const slidesJsonPath = path.join(conditionDir, 'slides.json');
  
  try {
    const jsonContent = await fs.readFile(slidesJsonPath, 'utf-8');
    const slidesData = JSON.parse(jsonContent);
    
    // Update slide references to point to optimized files
    const updatedSlides = slidesData.slides.map(slidePath => {
      const fullOriginalPath = path.join(conditionDir, slidePath);
      const optimization = optimizations.find(opt => 
        opt && opt.originalPath === fullOriginalPath
      );
      
      if (optimization) {
        // Convert absolute path back to relative path
        const relativePath = path.relative(conditionDir, optimization.optimizedPath);
        console.log(`  Updated slides.json: ${slidePath} → ${relativePath}`);
        return relativePath;
      }
      return slidePath;
    });
    
    slidesData.slides = updatedSlides;
    
    await fs.writeFile(slidesJsonPath, JSON.stringify(slidesData, null, 2));
    console.log(`Updated: ${slidesJsonPath}`);
  } catch (error) {
    console.error(`Error updating ${slidesJsonPath}:`, error.message);
  }
}

async function optimizeConditionImages() {
  console.log('🖼️  Starting image optimization for slide images...\n');
  
  // Find all condition directories
  const conditionDirs = await glob('public/about-conditions/*/');
  const conditionStats = {};
  
  for (const conditionDir of conditionDirs) {
    const conditionName = path.basename(conditionDir);
    console.log(`\n📁 Processing condition: ${conditionName}`);
    
    // Find all image files in the slides directory
    const imagePatterns = [
      path.join(conditionDir, 'slides/*.png'),
      path.join(conditionDir, 'slides/*.PNG'),
      path.join(conditionDir, 'slides/*.jpg'),
      path.join(conditionDir, 'slides/*.JPG'),
      path.join(conditionDir, 'slides/*.jpeg'),
      path.join(conditionDir, 'slides/*.JPEG'),
      path.join(conditionDir, 'slides/*.webp'),
      path.join(conditionDir, 'slides/*.WEBP')
    ];
    
    const imageFiles = [];
    for (const pattern of imagePatterns) {
      const files = await glob(pattern);
      imageFiles.push(...files);
    }
    
    if (imageFiles.length === 0) {
      console.log(`  No images found in ${conditionDir}slides/`);
      conditionStats[conditionName] = {
        count: 0,
        originalSize: 0,
        optimizedSize: 0,
        savings: 0
      };
      continue;
    }
    
    console.log(`  Found ${imageFiles.length} image(s)`);
    
    // Optimize each image
    const optimizations = [];
    for (const imageFile of imageFiles) {
      const result = await optimizeImage(imageFile);
      if (result) {
        optimizations.push(result);
      }
    }
    
    // Update slides.json with new file references
    await updateSlidesJson(conditionDir, optimizations);
    
    // Calculate stats for this condition
    const totalOriginalSize = optimizations.reduce((sum, opt) => sum + opt.originalSize, 0);
    const totalOptimizedSize = optimizations.reduce((sum, opt) => sum + opt.optimizedSize, 0);
    const totalSavings = totalOriginalSize > 0 ? 
      ((totalOriginalSize - totalOptimizedSize) / totalOriginalSize * 100) : 0;
    
    conditionStats[conditionName] = {
      count: optimizations.length,
      originalSize: totalOriginalSize,
      optimizedSize: totalOptimizedSize,
      savings: totalSavings
    };
    
    if (optimizations.length > 0) {
      console.log(`  ✅ Optimized ${optimizations.length} images`);
      console.log(`  📊 Total savings: ${formatBytes(totalOriginalSize - totalOptimizedSize)} (${totalSavings.toFixed(1)}%)`);
    }
  }
  
  // Print final summary
  console.log('\n📊 OPTIMIZATION SUMMARY');
  console.log('='.repeat(60));
  console.log('Condition'.padEnd(35) + 'Images'.padEnd(8) + 'Before'.padEnd(10) + 'After'.padEnd(10) + 'Savings');
  console.log('-'.repeat(60));
  
  let grandTotalOriginal = 0;
  let grandTotalOptimized = 0;
  let totalImagesProcessed = 0;
  
  for (const [condition, stats] of Object.entries(conditionStats)) {
    if (stats.count > 0) {
      const beforeSize = formatBytes(stats.originalSize).padEnd(9);
      const afterSize = formatBytes(stats.optimizedSize).padEnd(9);
      const savings = `${stats.savings.toFixed(1)}%`;
      
      console.log(
        condition.substring(0, 34).padEnd(35) + 
        stats.count.toString().padEnd(8) + 
        beforeSize + 
        afterSize + 
        savings
      );
      
      grandTotalOriginal += stats.originalSize;
      grandTotalOptimized += stats.optimizedSize;
      totalImagesProcessed += stats.count;
    }
  }
  
  if (totalImagesProcessed > 0) {
    const grandSavings = ((grandTotalOriginal - grandTotalOptimized) / grandTotalOriginal * 100);
    console.log('-'.repeat(60));
    console.log(
      `TOTAL (${totalImagesProcessed} images)`.padEnd(35) + 
      totalImagesProcessed.toString().padEnd(8) + 
      formatBytes(grandTotalOriginal).padEnd(10) + 
      formatBytes(grandTotalOptimized).padEnd(10) + 
      `${grandSavings.toFixed(1)}%`
    );
    console.log(`\n🎉 Optimization complete! Total space saved: ${formatBytes(grandTotalOriginal - grandTotalOptimized)}`);
  } else {
    console.log('\nNo images found to optimize.');
  }
}

// Run the optimization
optimizeConditionImages().catch(console.error);