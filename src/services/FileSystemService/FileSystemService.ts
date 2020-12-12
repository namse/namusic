import { FileInfo } from "../../type";
import { IFileSystemService } from "./IFileSystemService";
import * as fs from 'fs';
import * as url from 'url';

export class FileSystemService implements IFileSystemService {
  constructor(
  ) {
  }
  async readDirectoryRecursivelyAsync(directory: string): Promise<FileInfo[]> {
    const result: FileInfo[] = [];
    const dirents = await fs.promises.readdir(directory, {
      withFileTypes: true,
    });
    for (const dirent of dirents) {
      if (dirent.isFile()) {
        result.push({
          url: url.pathToFileURL(dirent.name).href,
        });
      } else if (dirent.isDirectory()) {
        const subResult = await this.readDirectoryRecursivelyAsync(dirent.name);
        result.push(
          ...subResult,
        );
      }
    }
    return result;
  }
}
