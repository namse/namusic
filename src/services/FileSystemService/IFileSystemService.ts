import { FileInfo } from "../../type";

export interface IFileSystemService {
  readDirectoryAsync(directory: string): Promise<FileInfo[]>;
}
