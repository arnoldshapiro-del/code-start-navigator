import { glob } from 'glob';
import sharp from 'sharp';
import { promises as fs } from 'fs';
import path from 'path';

const MAX_WIDTH = 1600;
const WEBP_QUALITY = 80;

interface OptimizationResult {
  originalPath: string;
  optimizedPath: string;
  originalSize: number;
  optimizedSize: number;
  savings: number;
}

interface ConditionStats {
  count: number;
  originalSize: number;
  optimizedSize: number;
  savings: number;
}

async function getFileSize(filePath: string): Promise<number> {
  try {
    const stats = await fs.stat(filePath);
    return stats.size;
  } catch (error) {
    return 0;
  }
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

async function optimizeImage(inputPath: string): Promise<OptimizationResult | null> {
  try {
    const metadata = await sharp(inputPath).metadata();
    const originalSize = await getFileSize(inputPath);
    
    // Generate output path with .webp extension
    const parsedPath = path.parse(inputPath);
    const outputPath = path.join(parsedPath.dir, parsedPath.name + '.webp');
    
    // Skip if already WebP and size is acceptable
    if (inputPath.endsWith('.webp') && metadata.width <= MAX_WIDTH) {
      return {
        originalPath: inputPath,
        optimizedPath: inputPath,
        originalSize,
        optimizedSize: originalSize,
        savings: 0
      };
    }
    
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
    const savings = originalSize > 0 ? ((originalSize - optimizedSize) / originalSize * 100) : 0;
    
    // If we created a .webp file and original wasn't .webp, remove the original
    if (!inputPath.endsWith('.webp')) {
      await fs.unlink(inputPath);
    }
    
    return {
      originalPath: inputPath,
      optimizedPath: outputPath,
      originalSize,
      optimizedSize,
      savings
    };
  } catch (error) {
    console.error(`Error processing ${inputPath}:`, (error as Error).message);
    return null;
  }
}

async function updateSlidesJson(conditionDir: string, optimizations: (OptimizationResult | null)[]): Promise<void> {
  const slidesJsonPath = path.join(conditionDir, 'slides.json');
  
  try {
    const jsonContent = await fs.readFile(slidesJsonPath, 'utf-8');
    const slidesData = JSON.parse(jsonContent);
    
    // Update slide references to point to optimized files
    const updatedSlides = slidesData.slides.map((slidePath: string) => {
      const fullOriginalPath = path.join(conditionDir, slidePath);
      const optimization = optimizations.find((opt: OptimizationResult | null) => 
        opt && opt.originalPath === fullOriginalPath
      );
      
      if (optimization) {
        // Convert absolute path back to relative path
        const relativePath = path.relative(conditionDir, optimization.optimizedPath);
        return relativePath;
      }
      return slidePath;
    });
    
    slidesData.slides = updatedSlides;
    
    await fs.writeFile(slidesJsonPath, JSON.stringify(slidesData, null, 2));
  } catch (error) {
    console.error(`Error updating ${slidesJsonPath}:`, (error as Error).message);
  }
}

export async function optimizeSlideImages(): Promise<void> {
  console.log('\n🖼️  Optimizing slide images...');
  
  // Find all condition directories
  const conditionDirs = await glob('public/about-conditions/*/');
  const conditionStats: Record<string, ConditionStats> = {};
  
  for (const conditionDir of conditionDirs) {
    const conditionName = path.basename(conditionDir);
    
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
      conditionStats[conditionName] = {
        count: 0,
        originalSize: 0,
        optimizedSize: 0,
        savings: 0
      };
      continue;
    }
    
    // Optimize each image
    const optimizations: (OptimizationResult | null)[] = [];
    for (const imageFile of imageFiles) {
      const result = await optimizeImage(imageFile);
      if (result) {
        optimizations.push(result);
      }
    }
    
    // Update slides.json with new file references
    await updateSlidesJson(conditionDir, optimizations);
    
    // Calculate stats for this condition
    const validOptimizations = optimizations.filter((opt): opt is OptimizationResult => opt !== null);
    const totalOriginalSize = validOptimizations.reduce((sum, opt) => sum + opt.originalSize, 0);
    const totalOptimizedSize = validOptimizations.reduce((sum, opt) => sum + opt.optimizedSize, 0);
    const totalSavings = totalOriginalSize > 0 ? 
      ((totalOriginalSize - totalOptimizedSize) / totalOriginalSize * 100) : 0;
    
    conditionStats[conditionName] = {
      count: validOptimizations.length,
      originalSize: totalOriginalSize,
      optimizedSize: totalOptimizedSize,
      savings: totalSavings
    };
  }
  
  // Print summary
  const processedConditions = Object.entries(conditionStats)
    .filter(([_, stats]: [string, ConditionStats]) => stats.count > 0);
  
  if (processedConditions.length > 0) {
    console.log('\n📊 Image Optimization Results:');
    console.log('Condition'.padEnd(30) + 'Images'.padEnd(8) + 'Before'.padEnd(10) + 'After'.padEnd(10) + 'Savings');
    console.log('-'.repeat(65));
    
    let grandTotal = { original: 0, optimized: 0, count: 0 };
    
    for (const [condition, stats] of processedConditions) {
      const beforeSize = formatBytes(stats.originalSize).padEnd(9);
      const afterSize = formatBytes(stats.optimizedSize).padEnd(9);
      const savings = `${stats.savings.toFixed(1)}%`;
      
      console.log(
        condition.substring(0, 29).padEnd(30) + 
        stats.count.toString().padEnd(8) + 
        beforeSize + 
        afterSize + 
        savings
      );
      
      grandTotal.original += stats.originalSize;
      grandTotal.optimized += stats.optimizedSize;
      grandTotal.count += stats.count;
    }
    
    if (grandTotal.count > 0) {
      const totalSavings = ((grandTotal.original - grandTotal.optimized) / grandTotal.original * 100);
      console.log('-'.repeat(65));
      console.log(
        `TOTAL (${grandTotal.count} images)`.padEnd(30) + 
        grandTotal.count.toString().padEnd(8) + 
        formatBytes(grandTotal.original).padEnd(10) + 
        formatBytes(grandTotal.optimized).padEnd(10) + 
        `${totalSavings.toFixed(1)}%`
      );
      console.log(`✅ Space saved: ${formatBytes(grandTotal.original - grandTotal.optimized)}\n`);
    }
  } else {
    console.log('No images found to optimize.\n');
  }
}

export function imageOptimizerPlugin() {
  return {
    name: 'image-optimizer',
    async buildStart() {
      await optimizeSlideImages();
    }
  };
}