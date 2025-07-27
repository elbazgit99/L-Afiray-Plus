// Utility functions for handling images in the application

export const getImageUrl = (imageUrl: string, imageFilename?: string, fallbackUrl?: string): string => {
  console.log('getImageUrl called with:', { imageUrl, imageFilename, fallbackUrl });
  
  if (imageFilename) {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
    const constructedUrl = `${baseUrl}/uploads/${imageFilename}`;
    console.log('Using imageFilename, constructed URL:', constructedUrl);
    return constructedUrl;
  }
  
  // If no filename but we have imageUrl
  if (imageUrl) {
    // If it's already a full URL, return as is (old system)
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      console.log('Using existing full URL:', imageUrl);
      return imageUrl;
    }
    
    // If it's a relative path, construct the full URL
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
    const constructedUrl = `${baseUrl}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
    console.log('Using relative imageUrl, constructed URL:', constructedUrl);
    return constructedUrl;
  }
  
  // Fallback to placeholder
  console.log('Using fallback URL:', fallbackUrl || 'https://placehold.co/400x400/E0E0E0/333333?text=No+Image');
  return fallbackUrl || 'https://placehold.co/400x400/E0E0E0/333333?text=No+Image';
};

export const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
  const target = event.currentTarget;
  console.error('Image failed to load:', target.src);
  target.onerror = null; // Prevent infinite loop
  target.src = 'https://placehold.co/400x400/E0E0E0/333333?text=Image+Error';
};

export const validateImageFile = (file: File): { isValid: boolean; error?: string } => {
  // Check file size (5MB limit)
  if (file.size > 5 * 1024 * 1024) {
    return { isValid: false, error: 'Image file size must be less than 5MB' };
  }
  
  // Check file type
  if (!file.type.startsWith('image/')) {
    return { isValid: false, error: 'File must be an image' };
  }
  
  // Check file extension
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
  if (!allowedExtensions.includes(fileExtension)) {
    return { isValid: false, error: 'Only JPG, PNG, GIF, and WebP images are allowed' };
  }
  
  return { isValid: true };
};

export const createImagePreview = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve(e.target?.result as string);
    };
    reader.onerror = () => {
      reject(new Error('Failed to read image file'));
    };
    reader.readAsDataURL(file);
  });
}; 