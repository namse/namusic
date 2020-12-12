import * as path from 'path';
import * as os from 'os';
import { MockFileSystemService } from '../services/FileSystemService/MockFileSystemService';
import { FileImportService } from '../services/FileImportService/FileImportService';

const tmpDirPath = os.tmpdir();

test('import nothing on empty directory', async () => {
  const mockFileSystemService = new MockFileSystemService([]);
  const fileImportService = new FileImportService(mockFileSystemService);

  const result = await fileImportService.importAsync(tmpDirPath, ['.mp3']);
  expect(result).toHaveLength(0);
})

test('import mp3 files on directory', async () => {
  const files: string[] = [];
  for (let i = 1; i <= 10; i += 1) {
    const mp3FilePath = path.resolve(`${os.tmpdir}/${i}.mp3`);
    files.push(mp3FilePath);

    const mockFileSystemService = new MockFileSystemService(files);
    const fileImportService = new FileImportService(mockFileSystemService);

    const result = await fileImportService.importAsync(tmpDirPath, ['.mp3']);
    expect(result).toHaveLength(i);
  }
})

test('import mp3 files on nested directory', async () => {
  const files: string[] = [
    path.resolve(`${os.tmpdir}/1.mp3`),
    path.resolve(`${os.tmpdir}/2.mp3`),
    path.resolve(`${os.tmpdir}/hello/3.mp3`),
    path.resolve(`${os.tmpdir}/hello/4.mp3`),
    path.resolve(`${os.tmpdir}/hello/abc/5.mp3`),
    path.resolve(`${os.tmpdir}/hello/abc/6.mp3`),
    path.resolve(`${os.tmpdir}/world/7.mp3`),
    path.resolve(`${os.tmpdir}/world/n/a/m/u/s/i/c/8.mp3`),
  ];

  const mockFileSystemService = new MockFileSystemService(files);
  const fileImportService = new FileImportService(mockFileSystemService);

  const result = await fileImportService.importAsync(tmpDirPath, ['.mp3']);
  expect(result).toHaveLength(8);

  const fileNames = result.map(fileInfo => path.basename(fileInfo.url));

  for (let i = 1; i <= 8; i += 1) {
    expect(fileNames).toContain(`${i}.mp3`);
  }
})

test('import files of extensions on nested directory', async () => {
  const extensions = ['.mp3', '.wav', '.ogg', '.flac'];
  const fileNames: string[] = [];
  for (let i = 0; i < 8; i += 1) {
    const extension = extensions[i % extensions.length];
    fileNames[i] = `${i + 1}${extension}`;
  }
  const files: string[] = [
    path.resolve(`${os.tmpdir}/${fileNames[0]}`),
    path.resolve(`${os.tmpdir}/${fileNames[1]}`),
    path.resolve(`${os.tmpdir}/hello/${fileNames[2]}`),
    path.resolve(`${os.tmpdir}/hello/${fileNames[3]}`),
    path.resolve(`${os.tmpdir}/hello/abc/${fileNames[4]}`),
    path.resolve(`${os.tmpdir}/hello/abc/${fileNames[5]}`),
    path.resolve(`${os.tmpdir}/world/${fileNames[6]}`),
    path.resolve(`${os.tmpdir}/world/n/a/m/u/s/i/c/${fileNames[7]}`),
  ];

  const mockFileSystemService = new MockFileSystemService(files);
  const fileImportService = new FileImportService(mockFileSystemService);

  const result = await fileImportService.importAsync(tmpDirPath, extensions);
  expect(result).toHaveLength(8);

  const importedFileNames = result.map(fileInfo => path.basename(fileInfo.url));

  fileNames.forEach(fileName => {
    expect(importedFileNames).toContain(fileName)
  });
})

test('import specific files only without other extension file', async () => {
  const extensions = ['.mp3', '.wav', '.ogg', '.flac'];
  const fileNames: string[] = [];
  for (let i = 0; i < 8; i += 1) {
    const extension = extensions[i % extensions.length];
    fileNames[i] = `${i + 1}${extension}`;
  }
  const files: string[] = [
    path.resolve(`${os.tmpdir}/${fileNames[0]}`),
    path.resolve(`${os.tmpdir}/${fileNames[1]}`),
    path.resolve(`${os.tmpdir}/hello/${fileNames[2]}`),
    path.resolve(`${os.tmpdir}/hello/${fileNames[3]}`),
    path.resolve(`${os.tmpdir}/hello/abc/${fileNames[4]}`),
    path.resolve(`${os.tmpdir}/hello/abc/${fileNames[5]}`),
    path.resolve(`${os.tmpdir}/world/${fileNames[6]}`),
    path.resolve(`${os.tmpdir}/world/n/a/m/u/s/i/c/${fileNames[7]}`),
  ];

  const extensionsToImport = ['.mp3', '.flac'];
  const fileNamesToImport = ['1.mp3', '4.flac', '5.mp3', '8.flac'];

  const mockFileSystemService = new MockFileSystemService(files);
  const fileImportService = new FileImportService(mockFileSystemService);

  const result = await fileImportService.importAsync(tmpDirPath, extensionsToImport);
  expect(result).toHaveLength(fileNamesToImport.length);

  const importedFileNames = result.map(fileInfo => path.basename(fileInfo.url));

  fileNamesToImport.forEach(fileName => {
    expect(importedFileNames).toContain(fileName)
  });
})
