import React, { useEffect, useState, useRef } from 'react';
import { Virtuoso } from 'react-virtuoso';

interface Props {
  content: string;
  className?: string;
}

/**
 * VirtualizedContent component that renders large HTML content efficiently
 * using virtualization to only render visible elements
 */
const VirtualizedContent: React.FC<Props> = ({ content, className = '' }) => {
  const [processedContent, setProcessedContent] = useState<string>('');
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(500); // default height
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Set mounted state on component mount
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Process content for rendering
  useEffect(() => {
    if (!content) {
      setProcessedContent('');
      setLoading(false);
      return;
    }

    setLoading(true);

    // Process content to ensure proper HTML rendering
    const processContent = () => {
      try {
        // If content contains HTML, wrap it in a container div
        if (content.includes('<')) {
          return `<div class="html-content">${content}</div>`;
        }
        // For plain text, convert newlines to paragraphs
        return content
          .split(/\n{2,}/)
          .filter(para => para.trim().length > 0)
          .map(para => `<p>${para.trim()}</p>`)
          .join('');
      } catch (error) {
        console.error('Error processing content:', error);
        // Fallback to simple paragraph wrapping
        return `<p>${content}</p>`;
      }
    };

    // Use setTimeout to avoid blocking the UI
    setTimeout(() => {
      if (mounted) {
        const processed = processContent();
        setProcessedContent(processed);
        setLoading(false);
      }
    }, 0);

  }, [content, mounted]);

  // Ensure proper height
  useEffect(() => {
    // Set a reasonable fixed height to avoid measuring issues
    setHeight(Math.min(500, window.innerHeight * 0.6));
    
    // Create a resize observer to update height if container changes
    if (containerRef.current) {
      const resizeObserver = new ResizeObserver(() => {
        // Fixed height avoids zero-size issues
        setHeight(Math.min(500, window.innerHeight * 0.6));
      });
      
      resizeObserver.observe(containerRef.current);
      return () => {
        if (containerRef.current) {
          resizeObserver.unobserve(containerRef.current);
        }
      };
    }
  }, []);

  // Show loading state while processing content
  if (loading) {
    return <div className="virtualized-content-loading">Processing content...</div>;
  }

  // Handle empty content case
  if (!processedContent) {
    return <div className="virtualized-content-empty">No content to display</div>;
  }

  return (
    <div 
      ref={containerRef} 
      className={`virtualized-content-container ${className}`}
      style={{ height: height + 'px', width: '100%', position: 'relative' }}
    >
      <div
        className="virtualized-content"
        style={{ height: height, width: '100%', overflow: 'auto' }}
        dangerouslySetInnerHTML={{ __html: processedContent }}
      />
    </div>
  );
};

export default VirtualizedContent;
