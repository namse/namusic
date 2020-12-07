import { FileInfo } from "../../type";
import { IFileSystemService } from "./IFileSystemService";
import * as path from 'path';
import * as url from 'url';


export class MockFileSystemService implements IFileSystemService {
  constructor(
    private readonly mockFilePaths: string[],
  ) {
  }
  async readDirectoryAsync(directory: string): Promise<FileInfo[]> {
    return this.mockFilePaths
    .filter(mockFilePath => {
      return path.dirname(mockFilePath) === directory;
    })
    .map(mockFilePath  => {
      return {
        url: url.pathToFileURL(mockFilePath).href,
      };
    });
  }
}