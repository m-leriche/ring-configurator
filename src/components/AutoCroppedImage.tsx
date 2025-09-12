import React, { useRef, useEffect, useState } from 'react';

interface AutoCroppedImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  onCropComplete?: (croppedDataUrl: string) => void;
  onMeasurementComplete?: (ringThickness: number) => void;
}

interface BoundingBox {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

const AutoCroppedImage: React.FC<AutoCroppedImageProps> = ({
  src,
  alt,
  className = '',
  style = {},
  onCropComplete,
  onMeasurementComplete,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const debugDivRef = useRef<HTMLDivElement>(null);
  const [croppedImageUrl, setCroppedImageUrl] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [debugInfo, setDebugInfo] = useState<{
    ringThickness: number;
    bottomEdge: number;
    topOfBand: number;
    cropWidth: number;
    cropHeight: number;
  } | null>(null);
  const [actualRenderedHeight, setActualRenderedHeight] = useState<
    number | null
  >(null);

  const findContentBounds = (imageData: ImageData): BoundingBox | null => {
    const { data, width, height } = imageData;
    let minX = width;
    let minY = height;
    let maxX = 0;
    let maxY = 0;
    let hasContent = false;

    // Scan all pixels to find non-transparent ones
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const index = (y * width + x) * 4;
        const alpha = data[index + 3]; // Alpha channel

        // Consider pixels with alpha > threshold as content
        if (alpha > 10) {
          // Small threshold for anti-aliased edges
          hasContent = true;
          minX = Math.min(minX, x);
          minY = Math.min(minY, y);
          maxX = Math.max(maxX, x);
          maxY = Math.max(maxY, y);
        }
      }
    }

    if (!hasContent) return null;

    return { minX, minY, maxX, maxY };
  };

  const measureRingThickness = (imageData: ImageData): number => {
    const { data, width, height } = imageData;

    // Find the horizontal center of the image
    const centerX = Math.floor(width / 2);

    let bottomEdge = -1;
    let topOfBand = -1;

    // Find bottom edge - scan from bottom up
    for (let y = height - 1; y >= 0; y--) {
      const index = (y * width + centerX) * 4;
      const alpha = data[index + 3];

      if (alpha > 50) {
        bottomEdge = y;
        break;
      }
    }

    // From the bottom edge, scan upward to find where the ring band meets the center hole
    if (bottomEdge !== -1) {
      for (let y = bottomEdge; y >= 0; y--) {
        const index = (y * width + centerX) * 4;
        const alpha = data[index + 3];

        // When we hit transparency (the center hole), that's the top of the band
        if (alpha <= 50) {
          topOfBand = y + 1; // +1 to get the last solid pixel
          break;
        }
      }
    }

    // Calculate ring band thickness
    if (bottomEdge !== -1 && topOfBand !== -1) {
      return bottomEdge - topOfBand + 1;
    }

    return 0; // No ring found or measurement failed
  };

  const processImage = async () => {
    try {
      setIsProcessing(true);
      setError('');

      const canvas = canvasRef.current;
      if (!canvas) {
        setIsProcessing(false);
        return;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setIsProcessing(false);
        return;
      }

      // Create and load the image
      const img = new Image();
      // Remove crossOrigin for local images to avoid CORS issues
      if (!src.startsWith('http')) {
        // Local image, no CORS needed
      } else {
        img.crossOrigin = 'anonymous';
      }

      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Image loading timeout'));
        }, 10000); // 10 second timeout

        img.onload = () => {
          clearTimeout(timeout);
          resolve();
        };
        img.onerror = () => {
          clearTimeout(timeout);
          reject(new Error('Failed to load image'));
        };
        img.src = src;
      });

      // Set canvas size to match image
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw the original image
      ctx.drawImage(img, 0, 0);

      // Get image data for processing
      const imageData = ctx.getImageData(0, 0, img.width, img.height);

      // Find the content bounds
      const bounds = findContentBounds(imageData);

      if (!bounds) {
        setError('No content found in image');
        setIsProcessing(false);
        return;
      }

      // Add small padding to avoid cutting too close
      const padding = 2;
      const cropX = Math.max(0, bounds.minX - padding);
      const cropY = Math.max(0, bounds.minY - padding);
      const cropWidth = Math.min(
        img.width - cropX,
        bounds.maxX - bounds.minX + padding * 2
      );
      const cropHeight = Math.min(
        img.height - cropY,
        bounds.maxY - bounds.minY + padding * 2
      );

      // Create a new canvas for the cropped image
      const croppedCanvas = document.createElement('canvas');
      const croppedCtx = croppedCanvas.getContext('2d');
      if (!croppedCtx) return;

      croppedCanvas.width = cropWidth;
      croppedCanvas.height = cropHeight;

      // Draw the cropped portion
      croppedCtx.drawImage(
        img,
        cropX,
        cropY,
        cropWidth,
        cropHeight, // Source rectangle
        0,
        0,
        cropWidth,
        cropHeight // Destination rectangle
      );

      // Measure ring thickness on the cropped image
      const croppedImageData = croppedCtx.getImageData(
        0,
        0,
        cropWidth,
        cropHeight
      );
      const ringThickness = measureRingThickness(croppedImageData);

      // Capture debug info for visual overlay
      if (ringThickness > 0) {
        const centerX = Math.floor(cropWidth / 2);

        // Find the bottom edge and top of band using same logic as measurement
        let bottomEdge = -1;
        let topOfBand = -1;

        // Find bottom edge
        for (let y = cropHeight - 1; y >= 0; y--) {
          const index = (y * cropWidth + centerX) * 4;
          const alpha = croppedImageData.data[index + 3];
          if (alpha > 50) {
            bottomEdge = y;
            break;
          }
        }

        // Find top of band (where ring meets center hole)
        if (bottomEdge !== -1) {
          for (let y = bottomEdge; y >= 0; y--) {
            const index = (y * cropWidth + centerX) * 4;
            const alpha = croppedImageData.data[index + 3];
            if (alpha <= 50) {
              topOfBand = y + 1;
              break;
            }
          }
        }

        // Store debug info for overlay rendering
        setDebugInfo({
          ringThickness,
          bottomEdge,
          topOfBand,
          cropWidth,
          cropHeight,
        });
      }

      // Convert to data URL
      const croppedDataUrl = croppedCanvas.toDataURL('image/png');
      setCroppedImageUrl(croppedDataUrl);

      if (onCropComplete) {
        onCropComplete(croppedDataUrl);
      }

      if (onMeasurementComplete) {
        onMeasurementComplete(ringThickness);
      }

      setIsProcessing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process image');
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    if (src) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        if (canvasRef.current) {
          processImage();
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [src]);

  // Measure the actual rendered height of the debug div
  useEffect(() => {
    if (debugInfo && debugDivRef.current) {
      const renderedHeight = debugDivRef.current.getBoundingClientRect().height;
      setActualRenderedHeight(renderedHeight);

      // Call onMeasurementComplete with the actual rendered value
      if (onMeasurementComplete) {
        onMeasurementComplete(renderedHeight);
      }
    }
  }, [debugInfo]); // Remove onMeasurementComplete from dependencies

  if (error) {
    return (
      <>
        {/* Hidden canvas for processing */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        <div
          className={`flex items-center justify-center bg-gray-100 ${className}`}
          style={style}
        >
          <span className="text-red-500 text-sm">Error: {error}</span>
        </div>
      </>
    );
  }

  if (isProcessing) {
    return (
      <>
        {/* Hidden canvas for processing */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        <div
          className={`flex items-center justify-center bg-gray-100 ${className}`}
          style={style}
        >
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </>
    );
  }

  return (
    <div className="relative inline-block">
      {/* Hidden canvas for processing */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* Display the cropped image or fallback to original */}
      {croppedImageUrl ? (
        <img
          src={croppedImageUrl}
          alt={alt}
          className={className}
          style={{
            ...style,
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
          }}
        />
      ) : (
        // Fallback to original image if cropping fails
        <img
          src={src}
          alt={alt}
          className={className}
          style={{
            ...style,
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
          }}
        />
      )}

      {/* Debug overlay div */}
      {debugInfo && croppedImageUrl && (
        <div
          ref={debugDivRef}
          className="absolute pointer-events-none" //bg-black for debugging
          style={{
            left: '50%',
            top: `${(debugInfo.topOfBand / debugInfo.cropHeight) * 100}%`,
            width: '4px',
            height: `${(debugInfo.ringThickness / debugInfo.cropHeight) * 100}%`,
            transform: 'translateX(-50%)',
            zIndex: 9999,
          }}
          title={`Original: ${debugInfo.ringThickness}px | Rendered: ${actualRenderedHeight?.toFixed(2)}px`}
        />
      )}
    </div>
  );
};

export default AutoCroppedImage;
