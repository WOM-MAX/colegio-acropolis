import React from 'react';

type VideoConfig = {
  titulo?: string;
  videoUrl?: string;
  anchoRatio?: string; // '16/9', '4/3' o 'auto'
};

export default function VideoBlock({ configuracion }: { configuracion: any }) {
  const config = (configuracion || {}) as VideoConfig;
  
  if (!config.videoUrl) return null;

  // Simple parser to extract Youtube/Vimeo IDs to embed correctly if user pastes regular URL
  // This is a basic helper. Ideally the user pastes the embed URL directly, or we handle it.
  const getEmbedUrl = (url: string) => {
    try {
      if (url.includes('youtube.com/watch?v=')) {
        const urlObj = new URL(url);
        const v = urlObj.searchParams.get('v');
        return `https://www.youtube.com/embed/${v}`;
      }
      if (url.includes('youtu.be/')) {
        const id = url.split('youtu.be/')[1].split('?')[0];
        return `https://www.youtube.com/embed/${id}`;
      }
      if (url.includes('vimeo.com/')) {
        const id = url.split('vimeo.com/')[1].split('?')[0];
        // Must be numeric
        if (!isNaN(Number(id))) return `https://player.vimeo.com/video/${id}`;
      }
      return url; // Returns original if not recognized or already embed
    } catch {
      return url;
    }
  };

  const finalUrl = getEmbedUrl(config.videoUrl);

  return (
    <section className="py-12 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {config.titulo && (
          <div className="rich-title font-bold text-azul-acropolis mb-6 text-center"
              dangerouslySetInnerHTML={{ __html: config.titulo }} />
        )}
        
        <div className={`relative w-full overflow-hidden rounded-2xl shadow-lg ${config.anchoRatio === '4/3' ? 'aspect-[4/3]' : 'aspect-video'}`}>
          <iframe 
            src={finalUrl} 
            className="absolute top-0 left-0 w-full h-full"
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
            title={config.titulo || 'Video Integrado'}
          ></iframe>
        </div>
      </div>
    </section>
  );
}
