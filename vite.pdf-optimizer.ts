import { Plugin } from 'vite';
import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';
import sharp from 'sharp';
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js for Node.js  
const Canvas = require('canvas');

export function pdfOptimizerPlugin(): Plugin {
  return {
    name: 'pdf-optimizer',
    async buildStart() {
      await generatePdfThumbnails();
    },
  };
}

async function generatePdfThumbnails() {
  try {
    const conditionDirs = glob.sync('public/about-conditions/*/');
    
    for (const conditionDir of conditionDirs) {
      const conditionName = path.basename(conditionDir);
      const pdfPath = path.join(conditionDir, `${conditionName}.pdf`);
      const slidesDir = path.join(conditionDir, 'slides');
      const thumbnailPath = path.join(slidesDir, 'first.webp');
      
      // Check if PDF exists and no images in slides folder
      if (fs.existsSync(pdfPath)) {
        const hasImages = fs.existsSync(slidesDir) && 
          fs.readdirSync(slidesDir).some(file => 
            /\.(png|jpg|jpeg|webp)$/i.test(file) && !file.startsWith('first.')
          );
        
        if (!hasImages) {
          console.log(`Generating thumbnail for ${conditionName}...`);
          
          // Ensure slides directory exists
          if (!fs.existsSync(slidesDir)) {
            fs.mkdirSync(slidesDir, { recursive: true });
          }
          
          try {
            // Generate thumbnail from PDF page 1
            await generatePdfThumbnail(pdfPath, thumbnailPath);
            console.log(`✓ Generated thumbnail: ${thumbnailPath}`);
          } catch (error) {
            console.error(`✗ Failed to generate thumbnail for ${conditionName}:`, error);
          }
        }
      }
    }
  } catch (error) {
    console.error('Error in PDF thumbnail generation:', error);
  }
}

async function generatePdfThumbnail(pdfPath: string, outputPath: string) {
  try {
    // Read PDF file
    const pdfBuffer = fs.readFileSync(pdfPath);
    
    // Load PDF document
    const loadingTask = pdfjsLib.getDocument({
      data: pdfBuffer,
    });
    
    const pdf = await loadingTask.promise;
    
    // Get first page
    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 2.0 }); // 2x scale for high quality
    
    // Create canvas
    const canvas = Canvas.createCanvas(viewport.width, viewport.height);
    const context = canvas.getContext('2d');
    
    // Render page to canvas
    const renderContext = {
      canvasContext: context,
      viewport: viewport,
      canvas: canvas,
    };

    await page.render(renderContext).promise;
    
    // Convert canvas to buffer and optimize with Sharp
    const canvasBuffer = canvas.toBuffer('image/png');
    
    // Optimize and convert to WebP
    await sharp(canvasBuffer)
      .resize(1600, null, { 
        withoutEnlargement: true,
        fit: 'inside'
      })
      .webp({ quality: 85 })
      .toFile(outputPath);
      
  } catch (error) {
    console.error('Error generating PDF thumbnail:', error);
    throw error;
  }
}