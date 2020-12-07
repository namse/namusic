import * as path from 'path';
import * as os from 'os';
import { MockFileSystemService } from '../services/FileSystemService/MockFileSystemService';
import { FileImportService } from '../services/FileImportService/FileImportService';

const basePath = os.tmpdir();

test('import nothing on empty directory', async () => {
  const mockFileSystemService = new MockFileSystemService([]);
  const fileImportService = new FileImportService(mockFileSystemService);

  const result = await fileImportService.importAsync(basePath, ['.mp3']);
  expect(result).toHaveLength(0);
})

test('import mp3 files on directory', async () => {
  const files: string[] = [];
  for (let i = 1; i <= 10; i += 1) {
    const mp3FilePath = path.resolve(`${os.tmpdir}/${i}.mp3`);
    files.push(mp3FilePath);


    const mockFileSystemService = new MockFileSystemService(files);
    const fileImportService = new FileImportService(mockFileSystemService);

    const result = await fileImportService.importAsync(basePath, ['.mp3']);
    expect(result).toHaveLength(i);
  }
})

test('import mp3 files on nested directory', async () => {
  // TODO
})

test('import files of extensions on nested directory', async () => {
  // TODO
})

test('import specific files only without other extension file', async () => {
  // TODO
})
