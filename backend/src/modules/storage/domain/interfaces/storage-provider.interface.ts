export abstract class IStorageProvider {
  /**
   * Saves a file to the storage and returns the relative path or URL.
   * @param file The file to save
   * @param folder The target folder/path within storage
   */
  abstract save(file: Express.Multer.File, folder: string): Promise<string>;

  /**
   * Deletes a file from storage.
   * @param path The relative path to delete
   */
  abstract delete(path: string): Promise<void>;

  /**
   * Returns a signed URL or public URL for the file.
   * @param path The relative path to the file
   */
  abstract getUrl(path: string): string;
}
