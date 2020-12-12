import { FileInfo } from "../../type";

export interface IFileSystemService {
  readDirectoryRecursivelyAsync(directory: string): Promise<FileInfo[]>;
}
