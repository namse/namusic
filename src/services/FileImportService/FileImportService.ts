import { FileInfo } from "../../type";
import { IFileSystemService } from "../FileSystemService/IFileSystemService";
import { IFileImportService } from "./IFileImportService";
import * as path from 'path';

export class FileImportService implements IFileImportService {
  constructor(
    private readonly fileSystemService: IFileSystemService,
  ) {

  }

  async importAsync(directoryPath: string, extensions: string[]): Promise<FileInfo[]> {
    const files = await this.fileSystemService.readDirectoryRecursivelyAsync(directoryPath);

    return files.filter(file => {
      return extensions.includes(path.extname(file.url));
    });
  }
}
