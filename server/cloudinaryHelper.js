import { v2 as cloudinary } from 'cloudinary'
import { Readable } from 'stream'

// Configura Cloudinary com env vars (CLOUDINARY_URL ou componentes separados)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  // Alternativa: usar CLOUDINARY_URL diretamente se configurado
  // secure: true
})

/**
 * Faz upload de arquivo para Cloudinary e retorna a URL pública
 * @param {Buffer|Stream|string} source - arquivo em buffer, stream ou filepath
 * @param {string} folder - pasta no Cloudinary (ex: 'blocos/fotos')
 * @param {object} options - opções adicionais
 * @returns {Promise<string>} URL pública da imagem
 */
export async function uploadToCloudinary(source, folder = 'carnaval-blocos', options = {}) {
  try {
    // Se for string (caminho local ou URL), use o uploader direto
    if (typeof source === 'string') {
      const result = await cloudinary.uploader.upload(source, {
        folder: folder,
        resource_type: 'auto',
        quality: 'auto',
        fetch_format: 'auto',
        ...options
      })
      return result.secure_url
    }

    // Se for Buffer, converte para Readable stream
    let uploadSource = source
    if (Buffer.isBuffer(source)) {
      uploadSource = Readable.from(source)
    }

    // Se for um stream legível, use upload_stream
    if (uploadSource && typeof uploadSource.pipe === 'function') {
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream({
          folder: folder,
          resource_type: 'auto',
          quality: 'auto',
          fetch_format: 'auto',
          ...options
        }, (error, result) => {
          if (error) return reject(error)
          resolve(result)
        })
        uploadSource.pipe(uploadStream)
      })
      return result.secure_url
    }

    throw new Error('Unsupported source type for Cloudinary upload')
  } catch (error) {
    console.error('[Cloudinary] Upload error:', error)
    throw error
  }
}

/**
 * Deleta arquivo do Cloudinary
 * @param {string} publicId - ID público da imagem (ex: 'carnaval-blocos/1234')
 */
export async function deleteFromCloudinary(publicId) {
  try {
    await cloudinary.uploader.destroy(publicId)
    console.log(`[Cloudinary] Deleted: ${publicId}`)
  } catch (error) {
    console.error('[Cloudinary] Delete error:', error)
  }
}

/**
 * Checa se Cloudinary está configurado
 */
export function isCloudinaryConfigured() {
  return !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY)
}

export default { uploadToCloudinary, deleteFromCloudinary, isCloudinaryConfigured }
