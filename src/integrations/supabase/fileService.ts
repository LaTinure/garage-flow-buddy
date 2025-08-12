import { supabase } from './client';

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export interface FileUploadOptions {
  bucket: 'garage-logos' | 'user-avatars' | 'repair-photos';
  file: File;
  path?: string;
  onProgress?: (progress: number) => void;
}

export class FileService {
  /**
   * Upload un fichier vers Supabase Storage
   */
  static async uploadFile(options: FileUploadOptions): Promise<UploadResult> {
    try {
      const { bucket, file, path, onProgress } = options;

      // Vérifier la taille du fichier
      if (file.size > 2 * 1024 * 1024) { // 2MB
        return {
          success: false,
          error: 'Le fichier est trop volumineux. Taille maximum : 2MB'
        };
      }

      // Validation plus permissive des types de fichiers
      const allowedExtensions = ['.png', '.jpg', '.jpeg', '.svg'];
      const fileName = file.name.toLowerCase();
      const hasValidExtension = allowedExtensions.some(ext => fileName.endsWith(ext));

      // Vérifier aussi le type MIME mais être plus permissif
      const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];
      const hasValidMimeType = allowedMimeTypes.includes(file.type);

      if (!hasValidExtension && !hasValidMimeType) {
        return {
          success: false,
          error: 'Type de fichier non supporté. Formats acceptés : PNG, JPG, SVG'
        };
      }

      // Générer un nom de fichier unique
      const timestamp = Date.now();
      const fileExtension = fileName.split('.').pop() || 'png';
      const uniqueFileName = `${path || 'upload'}_${timestamp}.${fileExtension}`;

      // Upload du fichier
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(uniqueFileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      // Simuler la progression si nécessaire
      if (onProgress) {
        onProgress(100);
      }

      if (error) {
        console.error('Erreur upload:', error);
        return {
          success: false,
          error: error.message
        };
      }

      // Obtenir l'URL publique
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(uniqueFileName);

      return {
        success: true,
        url: urlData.publicUrl
      };

    } catch (error) {
      console.error('Erreur upload fichier:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  }

  /**
   * Upload un logo de garage
   */
  static async uploadGarageLogo(file: File, onProgress?: (progress: number) => void): Promise<UploadResult> {
    return this.uploadFile({
      bucket: 'garage-logos',
      file,
      path: 'logo',
      onProgress
    });
  }

  /**
   * Upload un avatar utilisateur
   */
  static async uploadUserAvatar(file: File, userId?: string, onProgress?: (progress: number) => void): Promise<UploadResult> {
    if (!userId) {
      const user = (await supabase.auth.getUser()).data.user;
      userId = user?.id;
    }
    
    if (!userId) {
      return {
        success: false,
        error: 'Utilisateur non authentifié'
      };
    }

    return this.uploadFile({
      bucket: 'user-avatars',
      file,
      path: `${userId}/avatar`,
      onProgress
    });
  }

  /**
   * Upload une photo de réparation
   */
  static async uploadRepairPhoto(file: File, repairId: string, onProgress?: (progress: number) => void): Promise<UploadResult> {
    return this.uploadFile({
      bucket: 'repair-photos',
      file,
      path: `${repairId}/photo`,
      onProgress
    });
  }

  /**
   * Supprimer un fichier
   */
  static async deleteFile(bucket: string, path: string): Promise<boolean> {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([path]);

      if (error) {
        console.error('Erreur suppression fichier:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erreur suppression fichier:', error);
      return false;
    }
  }

  /**
   * Obtenir l'URL publique d'un fichier
   */
  static getPublicUrl(bucket: string, path: string): string {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);

    return data.publicUrl;
  }

  /**
   * Vérifier si un fichier existe
   */
  static async fileExists(bucket: string, path: string): Promise<boolean> {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .list('', {
          search: path
        });

      if (error) {
        console.error('Erreur vérification fichier:', error);
        return false;
      }

      return data.some(file => file.name === path);
    } catch (error) {
      console.error('Erreur vérification fichier:', error);
      return false;
    }
  }

  /**
   * Obtenir la taille d'un fichier
   */
  static async getFileSize(bucket: string, path: string): Promise<number | null> {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .list('', {
          search: path
        });

      if (error || !data.length) {
        return null;
      }

      const file = data.find(f => f.name === path);
      return file?.metadata?.size || null;
    } catch (error) {
      console.error('Erreur récupération taille fichier:', error);
      return null;
    }
  }

  /**
   * Lister les fichiers d'un bucket
   */
  static async listFiles(bucket: string, folder?: string): Promise<string[]> {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .list(folder || '');

      if (error) {
        console.error('Erreur liste fichiers:', error);
        return [];
      }

      return data.map(file => file.name);
    } catch (error) {
      console.error('Erreur liste fichiers:', error);
      return [];
    }
  }
}
