/**
 * Compresses an image file using Canvas API
 * Target: ~800KB, resize to 1920px max dimension, 85% JPEG quality
 */
export const compressPhoto = (file, maxWidth = 1920, quality = 0.85) => {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      reject(new Error('Invalid image file'))
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        // Calculate new dimensions
        let width = img.width
        let height = img.height
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }
        
        // Create canvas
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)
        
        // Convert to blob with compression
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(new File([blob], file.name, { type: 'image/jpeg', lastModified: Date.now() }))
            } else {
              reject(new Error('Canvas toBlob failed'))
            }
          },
          'image/jpeg',
          quality
        )
      }
      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = e.target.result
    }
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })
}

/**
 * Convert file to base64 for preview
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

/**
 * Upload photo to Supabase Storage
 */
export const uploadPhoto = async (file, bucket = 'verification-photos', path = '') => {
  const { supabase } = await import('@/lib/supabase.js')
  const fileName = `${path}/${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`
  
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, { contentType: 'image/jpeg' })
  
  if (error) throw error
  
  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path)
  
  return publicUrl
}
