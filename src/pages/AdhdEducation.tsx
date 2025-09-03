import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, ChevronLeft, ChevronRight, X, Maximize, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { usePdfViewer } from "@/hooks/usePdfViewer";
import { remoteSlidesJson, remotePdf, REMOTE_ASSET_BASE } from "@/config/assets";

type SlideSource = 'IMAGES_REMOTE' | 'PDF_REMOTE' | 'MISSING';

interface SlideData {
  source: SlideSource;
  slides?: string[];
  pdfUrl?: string;
}

// Helper function for encoding paths
function enc(p: string): string {
  return p.split('/').map(encodeURIComponent).join('/');
}

// Load slides with GitHub remote only
export async function loadSlidesForCondition(title: string): Promise<SlideData> {
  const jsonUrl = remoteSlidesJson(title);
  try {
    const jr = await fetch(jsonUrl);
    if (jr.ok) {
      const j: any = await jr.json();
      const arr = (j?.slides ?? []).map((p: string) => `${REMOTE_ASSET_BASE}/${enc(title)}/${enc(p)}`);
      if (arr.length) {
        const result = { source: 'IMAGES_REMOTE' as SlideSource, slides: arr };
        console.log('SOURCE', title, result.source);
        return result;
      }
    }
  } catch {}
  
  const pdfUrl = remotePdf(title);
  try {
    const pr = await fetch(pdfUrl, { method: 'HEAD' });
    if (pr.ok) {
      const result = { source: 'PDF_REMOTE' as SlideSource, pdfUrl };
      console.log('SOURCE', title, result.source);
      return result;
    }
  } catch {}
  
  const result = { source: 'MISSING' as SlideSource };
  console.log('SOURCE', title, result.source);
  return result;
}

export default function AdhdEducation() {
  const [currentCondition, setCurrentCondition] = useState('ADHD');
  // @ts-ignore
  const [slideData, setSlideData] = useState<SlideData>({ source: 'MISSING', slides: [] });
  const [currentSlide, setCurrentSlide] = useState<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pdfPages, setPdfPages] = useState<string[]>([]);
  
  // PDF viewer hook
  // @ts-ignore
  const { numPages, getPageDataUrl, isLoading: pdfLoading } = usePdfViewer(
    slideData.source === 'PDF_REMOTE' ? slideData.pdfUrl || null : null
  );
  
  useEffect(() => {
    const loadSlides = async () => {
      setIsLoading(true);
      try {
        const data = await loadSlidesForCondition(currentCondition);
        setSlideData(data);
        
        // @ts-ignore
        if (data.source === 'IMAGES_REMOTE' && data.slides && data.slides.length > 0) {
          // Preload first image slide
          const preloadImg = new Image();
          preloadImg.src = data.slides[0];
        }
      } catch (error) {
        console.error('Error loading slides:', error);
        // @ts-ignore
        setSlideData({ source: 'MISSING', slides: [] });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSlides();
  }, [currentCondition]);

  // Generate PDF page URLs when PDF is loaded
  useEffect(() => {
    // @ts-ignore
    if (slideData.source === 'PDF_REMOTE' && numPages > 0) {
      const generatePages = async () => {
        const pages: string[] = [];
        
        // Generate placeholder URLs for all pages (will render on-demand)
        for (let i = 1; i <= numPages; i++) {
          pages.push(`pdf-page-${i}`); // Placeholder for lazy loading
        }
        
        setPdfPages(pages);
      };
      
      generatePages();
    } else {
      setPdfPages([]);
    }
  }, [slideData, numPages]);

  // Get current slides array based on source
  // @ts-ignore
  const currentSlides = slideData.source === 'IMAGES_REMOTE' ? (slideData.slides || []) : pdfPages;

  const conditions = [
    { id: 'ADHD', name: 'ADHD', icon: '🧠' },
    { id: 'Generalized Anxiety Disorder', name: 'Generalized Anxiety Disorder', icon: '😟' },
    { id: 'Autism Spectrum Disorder', name: 'Autism Spectrum Disorder', icon: '🧩' },
    { id: 'PTSD', name: 'PTSD', icon: '🛡️' },
    { id: 'OCD', name: 'OCD', icon: '🔄' },
    { id: 'Panic Disorder', name: 'Panic Disorder', icon: '💨' },
    { id: 'Sleep Disorders', name: 'Sleep Disorders', icon: '😴' },
    { id: 'Eating Disorders', name: 'Eating Disorders', icon: '🍽️' },
    { id: 'Alcohol Use Disorder', name: 'Alcohol Use Disorder', icon: '🍺' },
    { id: 'Cannabis Use Disorder', name: 'Cannabis Use Disorder', icon: '🌿' },
    { id: 'Substance Use Disorder', name: 'Substance Use Disorder', icon: '🚫' },
    { id: 'Opioid Use Disorder', name: 'Opioid Use Disorder', icon: '💊' },
    { id: 'Major Depressive Disorder', name: 'Major Depressive Disorder', icon: '🌧️' },
    { id: 'Childhood Bipolar Disorder', name: 'Childhood Bipolar Disorder', icon: '🎭' },
    { id: 'Personality Disorders', name: 'Personality Disorders', icon: '🎭' },
    { id: 'Antisocial Personality Disorder', name: 'Antisocial Personality Disorder', icon: '⚡' },
    { id: 'Borderline Personality Disorder', name: 'Borderline Personality Disorder', icon: '💔' },
    { id: 'Narcissistic Personality Disorder', name: 'Narcissistic Personality Disorder', icon: '👑' },
    { id: 'Social Anxiety Disorder', name: 'Social Anxiety Disorder', icon: '👥' },
    { id: 'Childhood GAD', name: 'Childhood GAD', icon: '😰' }
  ];

  const openSlide = (index: number) => {
    setCurrentSlide(index);
    setIsFullscreen(true);
  };

  const closeSlide = () => {
    setIsFullscreen(false);
    setCurrentSlide(null);
  };

  const nextSlide = async () => {
    if (currentSlide !== null && currentSlide < currentSlides.length - 1) {
      const nextIndex = currentSlide + 1;
      setCurrentSlide(nextIndex);
      
      // If PDF and page needs rendering, render it now
      // @ts-ignore
      if (slideData.source === 'PDF_REMOTE' && pdfPages[nextIndex]?.startsWith('pdf-page-')) {
        const pageNum = nextIndex + 1;
        const pageDataUrl = await getPageDataUrl(pageNum);
        if (pageDataUrl) {
          setPdfPages(prev => {
            const updated = [...prev];
            updated[nextIndex] = pageDataUrl;
            return updated;
          });
        }
      }
    }
  };

  const prevSlide = () => {
    if (currentSlide !== null && currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') closeSlide();
    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === 'ArrowLeft') prevSlide();
  };

  return (
    <main className="min-h-screen bg-background p-6">
      <div className="container max-w-6xl mx-auto">
        <div className="mb-6">
          <Link to="/">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
        
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Mental Health Education Slideshows</h1>
          <p className="text-muted-foreground mb-6">
            Comprehensive educational materials about mental health conditions from Dr. Arnold G. Shapiro
          </p>
          
          {/* Crystal clear but subtle directions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 max-w-2xl mx-auto">
            <p className="text-sm text-blue-800 font-medium mb-2">📖 How to Use:</p>
            <div className="text-sm text-blue-700 space-y-1">
              <p>• Click any slide thumbnail to start presentation mode</p>
              <p>• Click slide or → arrow to go to next slide</p>
              <p>• Press ESC or click X to exit presentation</p>
            </div>
          </div>
          
          <Button asChild className="mb-4">
            <a 
              href={`/about-conditions/${currentCondition}/${conditions.find(c => c.id === currentCondition)?.name}.pdf`} 
              download={`${conditions.find(c => c.id === currentCondition)?.name.replace(/\s+/g, '-')}-Education-Dr-Shapiro.pdf`}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download {conditions.find(c => c.id === currentCondition)?.name} Education PDF
            </a>
          </Button>
        </div>

        {/* Working Condition Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {conditions.map((condition) => (
              <Button
                key={condition.id}
                variant={currentCondition === condition.id ? "default" : "outline"}
                onClick={() => setCurrentCondition(condition.id)}
                className={currentCondition === condition.id ? "bg-primary text-primary-foreground" : ""}
              >
                {condition.icon} {condition.name}
              </Button>
            ))}
          </div>
          
          {!isLoading && !pdfLoading && slideData.source === 'MISSING' && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 max-w-4xl mx-auto">
              <p className="text-sm text-amber-800 font-medium mb-2">📁 No slides found for {conditions.find(c => c.id === currentCondition)?.name}</p>
              <div className="text-sm text-amber-700 space-y-1">
                <p><strong>To add slides:</strong></p>
                <p>1. Create folder: <code className="bg-amber-100 px-1 rounded">/public/about-conditions/{currentCondition}/slides/</code></p>
                <p>2. Add slide images: <code className="bg-amber-100 px-1 rounded">Slide1.png, Slide2.png</code>, etc.</p>
                <p>3. Update: <code className="bg-amber-100 px-1 rounded">/public/about-conditions/{currentCondition}/slides.json</code></p>
                <p>4. <strong>OR</strong> Add PDF: <code className="bg-amber-100 px-1 rounded">{conditions.find(c => c.id === currentCondition)?.name}.pdf</code></p>
              </div>
            </div>
          )}

          {/* @ts-ignore */}
          {slideData.source === 'PDF_REMOTE' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-4xl mx-auto mb-6">
              <p className="text-sm text-blue-800 font-medium mb-2">📄 PDF Mode Active</p>
              <p className="text-sm text-blue-700">
                Displaying pages from PDF document. Pages are rendered on-demand for optimal performance.
                <span className="ml-2 font-semibold text-green-700">(Remote GitHub)</span>
              </p>
            </div>
          )}
        </div>

        {/* Status Readout */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
            <span className={`w-2 h-2 rounded-full ${
              slideData.source === 'IMAGES_REMOTE' ? 'bg-green-500' :
              slideData.source === 'PDF_REMOTE' ? 'bg-blue-500' :
              'bg-red-500'
            }`}></span>
            SOURCE: {slideData.source}
            {/* @ts-ignore */}
            {slideData.slides && slideData.slides.length > 0 && ` (${slideData.slides.length})`}
          </div>
        </div>

        {/* Slide Grid */}
        <h2 className="text-2xl font-bold text-center mb-6">
          {conditions.find(c => c.id === currentCondition)?.icon} {conditions.find(c => c.id === currentCondition)?.name} Education Slides
          {currentSlides.length > 0 && (
            <span className="text-muted-foreground ml-2">
              {/* @ts-ignore */}
              ({currentSlides.length} {slideData.source === 'PDF_REMOTE' ? 'pages' : 'slides'})
              {slideData.source === 'PDF_REMOTE' && <FileText className="inline h-4 w-4 ml-1" />}
            </span>
          )}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {currentSlides.map((src, idx) => {
            const isPlaceholder = src.startsWith('pdf-page-');
            const displaySrc = isPlaceholder ? '/placeholder.svg' : src;
            
            return (
              <div 
                key={`${slideData.source}-${idx}`}
                className="relative group cursor-pointer hover:shadow-lg transition-all duration-300 rounded-lg overflow-hidden border border-border"
                onClick={() => openSlide(idx)}
              >
                <img 
                  src={displaySrc}
                  alt={`${conditions.find(c => c.id === currentCondition)?.name} Education ${slideData.source === 'PDF_REMOTE' ? 'Page' : 'Slide'} ${idx + 1}`} 
                  loading={idx === 0 ? "eager" : "lazy"}
                  decoding="async"
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                  <Maximize className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                  {slideData.source === 'PDF_REMOTE' ? 'Page' : 'Slide'} {idx + 1}
                  {isPlaceholder && <span className="ml-1 opacity-70">(loading...)</span>}
                </div>
                <div className="absolute top-2 right-2 bg-blue-600/90 text-white px-2 py-1 rounded text-xs">
                  Click to present
                </div>
                {slideData.source === 'PDF_REMOTE' && (
                  <div className="absolute top-2 left-2 bg-green-600/90 text-white px-1 py-0.5 rounded text-xs">
                    REMOTE PDF
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {(isLoading || pdfLoading) && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Loading {slideData.source === 'PDF_REMOTE' ? 'PDF pages' : 'slides'}...
            </p>
          </div>
        )}

        {/* Fullscreen Slideshow Modal */}
        {isFullscreen && currentSlide !== null && (
          <div 
            className="fixed inset-0 bg-black z-50 flex items-center justify-center"
            onKeyDown={handleKeyDown}
            tabIndex={0}
          >
            {/* Close button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white hover:bg-white/20 z-10"
              onClick={closeSlide}
            >
              <X className="h-6 w-6" />
            </Button>

            {/* Slide counter */}
            <div className="absolute top-4 left-4 text-white bg-black/50 px-3 py-1 rounded z-10">
              {currentSlide + 1} / {currentSlides.length}
              {slideData.source === 'PDF_REMOTE' && <FileText className="inline h-4 w-4 ml-1" />}
            </div>

            {/* Previous button */}
            {currentSlide > 0 && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 z-10"
                onClick={prevSlide}
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>
            )}

            {/* Next button */}
            {currentSlide < currentSlides.length - 1 && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 z-10"
                onClick={nextSlide}
              >
                <ChevronRight className="h-8 w-8" />
              </Button>
            )}

            {/* Main slide */}
            <div className="w-full h-full flex items-center justify-center p-8">
              {(() => {
                const currentSrc = currentSlides[currentSlide];
                
                // Handle PDF page placeholder - render on demand
                if (currentSrc?.startsWith('pdf-page-')) {
                  const pageNum = currentSlide + 1;
                  
                  // Render page on demand
                  React.useEffect(() => {
                    // @ts-ignore
                    if (slideData.source === 'PDF_REMOTE') {
                      getPageDataUrl(pageNum).then((pageDataUrl) => {
                        if (pageDataUrl) {
                          setPdfPages(prev => {
                            const updated = [...prev];
                            updated[currentSlide] = pageDataUrl;
                            return updated;
                          });
                        }
                      });
                    }
                  }, [pageNum]);
                  
                  return (
                    <div className="flex items-center justify-center">
                      <p className="text-white">Rendering page {pageNum}...</p>
                    </div>
                  );
                }
                
                return (
                  <img 
                    src={currentSrc} 
                    alt={`${conditions.find(c => c.id === currentCondition)?.name} Education ${slideData.source === 'PDF_REMOTE' ? 'Page' : 'Slide'} ${currentSlide + 1}`}
                    className="max-w-full max-h-full object-contain"
                    onClick={nextSlide}
                  />
                );
              })()}
            </div>

            {/* Instructions */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/50 px-4 py-2 rounded">
              Click slide or use arrow keys to navigate • ESC to close
            </div>
          </div>
        )}
        
        <div className="text-center mt-12 p-6 bg-muted/50 rounded-lg">
          <p className="text-muted-foreground text-sm">
            <strong>Disclaimer:</strong> This educational material is for informational purposes only and does not constitute medical advice. 
            Please consult with Dr. Arnold G. Shapiro or another qualified healthcare provider for proper evaluation and treatment.
          </p>
        </div>
      </div>
    </main>
  );
}