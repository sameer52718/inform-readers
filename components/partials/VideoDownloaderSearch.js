'use client';

import { useState } from 'react';
import { Icon } from '@iconify/react';

 function VideoDownloaderSearch() {
  const [url, setUrl] = useState('');

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text);
    } catch (error) {
      console.error('Failed to read clipboard:', error);
    }
  };

  const handleDownload = () => {
    if (url) {
      console.log('Downloading from:', url);
      // Add actual download logic here
    }
  };

  return (
    <div className="bg-gray-900 p-3 flex flex-wrap items-center gap-3 sm:gap-4 rounded-lg">
    <input
        type="text"
        placeholder="Paste URL Instagram"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="flex-1 px-3 py-2 border rounded-lg outline-none text-gray-800 w-full sm:w-auto"
    />
    <button
        onClick={handlePaste}
        className="border-2 border-red-500 px-4 py-2 flex items-center space-x-1 rounded-lg text-red-500 font-semibold w-full sm:w-auto justify-center"
    >
        <Icon icon="mdi:content-paste" className="text-lg" />
        <span>Paste</span>
    </button>
    <button
        onClick={handleDownload}
        className="bg-red-500 text-white px-4 py-2 flex items-center space-x-2 rounded-lg font-semibold w-full sm:w-auto justify-center"
    >
        <Icon icon="mdi:download" className="text-lg" />
        <span>Download</span>
    </button>
</div>

  );
}


export default VideoDownloaderSearch;
