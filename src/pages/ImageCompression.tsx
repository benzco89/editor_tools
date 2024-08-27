import React, { useState, useCallback } from 'react';
import imageCompression from 'browser-image-compression';

declare module 'browser-image-compression';

const ImageCompression: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<File | null>(null);
  const [compressedImage, setCompressedImage] = useState<string | null>(null);
  const [compressing, setCompressing] = useState(false);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setOriginalImage(event.target.files[0]);
    }
  };

  const compressImage = useCallback(async () => {
    if (!originalImage) return;

    setCompressing(true);
    try {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };

      const compressedFile = await imageCompression(originalImage, options);
      const reader = new FileReader();
      reader.readAsDataURL(compressedFile);
      reader.onloadend = () => {
        setCompressedImage(reader.result as string);
      };
    } catch (error) {
      console.error('שגיאה בדחיסת התמונה:', error);
    } finally {
      setCompressing(false);
    }
  }, [originalImage]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-primary">דחיסת תמונה</h2>
      <div className="bg-white rounded-lg shadow-md p-6">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="input mb-4"
        />
        {originalImage && (
          <button
            onClick={compressImage}
            disabled={compressing}
            className="btn btn-primary"
          >
            {compressing ? 'דוחס...' : 'דחוס תמונה'}
          </button>
        )}
        <div className="flex flex-wrap mt-8">
          {originalImage && (
            <div className="w-full md:w-1/2 p-2">
              <h3 className="text-xl font-semibold mb-2">תמונה מקורית</h3>
              <img
                src={URL.createObjectURL(originalImage)}
                alt="תמונה מקורית"
                className="max-w-full h-auto rounded-lg shadow-md"
              />
              <p className="mt-2">גודל: {(originalImage.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          )}
          {compressedImage && (
            <div className="w-full md:w-1/2 p-2">
              <h3 className="text-xl font-semibold mb-2">תמונה דחוסה</h3>
              <img
                src={compressedImage}
                alt="תמונה דחוסה"
                className="max-w-full h-auto rounded-lg shadow-md"
              />
              <p className="mt-2">
                גודל: {((compressedImage.length * 3) / 4 / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageCompression;