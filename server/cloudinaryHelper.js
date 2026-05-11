// Helper Cloudinary: gerencia upload de imagens para CDN em nuvem
// Cloudinary: serviço que armazena e otimiza imagens na nuvem
import { v2 as cloudinary } from 'cloudinary'
import { Readable } from 'stream'

// Configura credenciais do Cloudinary a partir de variáveis de ambiente
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Nome do account Cloudinary
  api_key: process.env.CLOUDINARY_API_KEY, // Chave pública
  api_secret: process.env.CLOUDINARY_API_SECRET, // Chave privada
})

/**
 * Faz upload de arquivo para Cloudinary e retorna URL pública otimizada
 * Benefícios: armazenamento em nuvem, otimização automática de imagens,
 * CDN global para distribuição rápida
 * 
 * @param {Buffer|Stream|string} source - arquivo em buffer, stream ou caminho local
 * @param {string} folder - pasta no Cloudinary para organizar uploads
 * @param {object} options - opções adicionais de upload
 * @returns {Promise<string>} URL pública da imagem na nuvem
 */
export async function uploadToCloudinary(source, folder = 'carnaval-blocos', options = {}) {
  try {
    // Se o source for uma string (caminho local ou URL remota)
    if (typeof source === 'string') {
      const result = await cloudinary.uploader.upload(source, {
        folder: folder, // Organiza uploads em pastas
        resource_type: 'auto', // Detecta automaticamente o tipo (imagem, vídeo, etc)
        quality: 'auto', // Otimiza qualidade automaticamente
        fetch_format: 'auto', // Escolhe melhor formato (WebP, JPG, etc)
        ...options
      })
      // Retorna URL segura (HTTPS)
      return result.secure_url
    }

    // Se for Buffer (dados em memória), converte para stream
    let uploadSource = source
    if (Buffer.isBuffer(source)) {
      uploadSource = Readable.from(source)
    }

    // Se for stream legível, usa upload_stream
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
