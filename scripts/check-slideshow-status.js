import { readFileSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';
import { glob } from 'glob';

const conditions = [
  'ADHD',
  'Generalized Anxiety Disorder', 
  'Autism Spectrum Disorder',
  'PTSD',
  'OCD',
  'Panic Disorder',
  'Sleep Disorders',
  'Eating Disorders',
  'Alcohol Use Disorder',
  'Cannabis Use Disorder',
  'Substance Use Disorder',
  'Opioid Use Disorder',
  'Major Depressive Disorder',
  'Childhood Bipolar Disorder',
  'Personality Disorders',
  'Antisocial Personality Disorder',
  'Borderline Personality Disorder',
  'Narcissistic Personality Disorder',
  'Social Anxiety Disorder',
  'Childhood GAD'
];

console.log('Slideshow Status Report\n');
console.log('| Condition | SOURCE | Count | Path |');
console.log('|-----------|---------|-------|------|');

for (const condition of conditions) {
  const conditionDir = `public/about-conditions/${condition}`;
  const slidesDir = join(conditionDir, 'slides');
  const slidesJsonPath = join(conditionDir, 'slides.json');
  const pdfPath = join(conditionDir, `${condition}.pdf`);
  
  let source = 'MISSING';
  let count = 0;
  let path = '';
  
  // Check for images first
  if (existsSync(slidesJsonPath)) {
    try {
      const slidesData = JSON.parse(readFileSync(slidesJsonPath, 'utf8'));
      if (slidesData.slides && slidesData.slides.length > 0) {
        // Verify at least one image exists
        const firstSlide = join(conditionDir, slidesData.slides[0]);
        if (existsSync(firstSlide)) {
          source = 'IMAGES';
          count = slidesData.slides.length;
          path = slidesDir;
        }
      }
    } catch (e) {
      // Invalid JSON, continue to PDF check
    }
  }
  
  // Check for PDF fallback if no images
  if (source === 'MISSING' && existsSync(pdfPath)) {
    source = 'PDF';
    count = '?'; // PDF page count would need pdf.js to determine
    path = pdfPath;
  }
  
  console.log(`| ${condition} | ${source} | ${count} | ${path} |`);
}

console.log('\nSummary:');
console.log('- IMAGES: Working with slide images');
console.log('- PDF: Working with PDF fallback'); 
console.log('- MISSING: No content found (see README.txt for upload instructions)');