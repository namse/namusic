import { FileInfo } from "../../type";

export interface IFileImportService {
  importAsync(directoryPath: string, extensions: string[]): Promise<FileInfo[]>;
}