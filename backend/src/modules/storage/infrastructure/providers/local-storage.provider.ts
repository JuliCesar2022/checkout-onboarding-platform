import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs/promises';
import * as path from 'path';
import { IStorageProvider } from '../../domain/interfaces/storage-provider.interface';

@Injectable()
export class LocalStorageProvider implements IStorageProvider {
  private readonly logger = new Logger(LocalStorageProvider.name);
  private readonly uploadPath: string;
  private readonly baseUrl: string;

  constructor(private readonly configService: ConfigService) {
    // Default to 'uploads' in the root directory
    this.uploadPath = path.resolve(process.cwd(), 'uploads');
    this.baseUrl =
      this.configService.get<string>('APP_URL') || 'http://localhost:3000';

    // Ensure the directory exists
    this.ensureDirectoryExists();
  }

  private async ensureDirectoryExists() {
    try {
      await fs.access(this.uploadPath);
    } catch {
      await fs.mkdir(this.uploadPath, { recursive: true });
      this.logger.log(`Created uploads directory at: ${this.uploadPath}`);
    }
  }

  async save(file: Express.Multer.File, folder: string): Promise<string> {
    const targetDir = path.join(this.uploadPath, folder);
    await fs.mkdir(targetDir, { recursive: true });

    // Create a unique filename: timestamp-original
    const filename = `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;
    const filePath = path.join(targetDir, filename);

    await fs.writeFile(filePath, file.buffer);

    // Return the relative path for database storage
    return path.join(folder, filename).replace(/\\/g, '/');
  }

  async delete(relativePath: string): Promise<void> {
    const fullPath = path.join(this.uploadPath, relativePath);
    try {
      await fs.unlink(fullPath);
    } catch (error) {
      this.logger.warn(
        `Could not delete file at ${fullPath}: ${error.message}`,
      );
    }
  }

  getUrl(relativePath: string): string {
    // Assumes the 'uploads' folder is served at '/uploads'
    return `${this.baseUrl}/uploads/${relativePath}`;
  }
}
