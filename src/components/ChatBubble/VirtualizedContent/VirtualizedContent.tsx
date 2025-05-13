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
  const [lines, setLines] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(500); // default height
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Set mounted state on component mount
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Process content into lines for virtualization
  useEffect(() => {
    if (!content) {
      setLines([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    // Simplify content processing to avoid errors
    const processContent = () => {
      try {
        // First handle any content that has HTML tags
        if (content.includes('<')) {
          // Simplified HTML processing - focus on chunking rather than preserving exact structure
          // This helps avoid the zero-sized element errors
          const chunks = content
            .split(/(\n{2,}|<div>|<\/div>|<p>|<\/p>|<br\s*\/?>)/)
            .map(chunk => chunk.trim())
            .filter(chunk => chunk.length > 0);
          
          // Ensure reasonably sized chunks for better virtualization
          const processedChunks: string[] = [];
          let currentChunk = '';
          
          chunks.forEach(chunk => {
            // If chunk contains HTML tag, treat it specially
            if (chunk.match(/<[^>]*>/)) {
              if (currentChunk) {
                processedChunks.push(currentChunk);
                currentChunk = '';
              }
              processedChunks.push(chunk);
            } else {
              // For regular text chunks, merge until we reach a reasonable size
              currentChunk += chunk + ' ';
              if (currentChunk.length > 200) {
                processedChunks.push(currentChunk);
                currentChunk = '';
              }
            }
          });
          
          if (currentChunk) {
            processedChunks.push(currentChunk);
          }
          
          return processedChunks;
        } else {
          // For plain text, split by paragraphs
          return content.split(/\n{2,}/)
            .filter(para => para.trim().length > 0)
            .map(para => para.trim());
        }
      } catch (error) {
        console.error('Error processing content:', error);
        // Fallback to simpler processing
        return content.split(/\n/)
          .filter(line => line.trim().length > 0);
      }
    };
    
    // Use setTimeout to avoid blocking the UI
    setTimeout(() => {
      if (mounted) {
        const processedLines = processContent();
        setLines(processedLines);
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

  // Item renderer for virtualized list
  const itemContent = (index: number) => {
    const line = lines[index];
    if (!line || line.length === 0) return <div style={{ height: '1px' }}>&nbsp;</div>;
    
    // Ensure each line has a minimum height
    const minHeightStyle = { minHeight: '20px' };
    
    // Handle HTML content safely
    if (line.includes('<') && line.includes('>')) {
      return (
        <div 
          style={minHeightStyle} 
          className="virtualized-content-html-line"
          dangerouslySetInnerHTML={{ __html: line }}
        />
      );
    }
    
    // Regular text content
    return (
      <div style={minHeightStyle} className="virtualized-content-line">
        {line}
      </div>
    );
  };

  // Show loading state while processing content
  if (loading) {
    return <div className="virtualized-content-loading">Processing content...</div>;
  }

  // Handle empty content case
  if (lines.length === 0) {
    return <div className="virtualized-content-empty">No content to display</div>;
  }

  return (
    <div 
      ref={containerRef} 
      className={`virtualized-content-container ${className}`}
      style={{ height: height + 'px', width: '100%', position: 'relative' }}
    >
      {/* Force fixed height and proper styling to avoid zero-sized element errors */}
      <Virtuoso
        style={{ height: height, width: '100%', overflow: 'auto' }}
        totalCount={lines.length}
        itemContent={itemContent}
        defaultItemHeight={20} // Provide default item height
        fixedItemHeight={0} // Allow variable height items
        overscan={100} // Reduced overscan for better performance
      />
    </div>
  );
};

export default VirtualizedContent;
