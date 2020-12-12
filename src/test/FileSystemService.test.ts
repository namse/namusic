import { mocked } from 'ts-jest/utils';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { FileSystemService } from '../services/FileSystemService/FileSystemService';

const tmpDirPath = os.tmpdir();

jest.mock('fs', () => ({
  promises: {
    readdir: jest.fn(),
  },
}));

afterEach(() => {
  mocked(fs.promises.readdir).mockClear();
})

test('read nothing on empty directory', async () => {
  mocked(fs.promises.readdir).mockImplementation(async (path, options) => {
    const result: fs.Dirent[] = [];
    return result;
  });
  const fileSystemService = new FileSystemService();
  const result = await fileSystemService.readDirectoryRecursivelyAsync(tmpDirPath);
  expect(result).toHaveLength(0);
})

function mockReadDir(filePathes: string[]) {
  mocked(fs.promises.readdir).mockClear();
  mocked(fs.promises.readdir).mockImplementation(async (pathName, options) => {
    const result: fs.Dirent[] = [];
    const nextDirectoris: Set<string> = new Set();

    for (const filePath of filePathes) {
      const dirname = path.dirname(filePath);
      if (dirname === pathName.toString()) {
        result.push({
          isDirectory: () => false,
          isFile: () => true,
          name: filePath,
        } as fs.Dirent);
        continue;
      }

      const pathWithSeperator = `${pathName.toString()}${path.sep}`;
      if (dirname.startsWith(pathWithSeperator)) {
        const nextSeperatorIndex = dirname.indexOf(path.sep, pathWithSeperator.length);
        const nextDirectory = nextSeperatorIndex >= 0 ? dirname.substring(0, nextSeperatorIndex) : dirname;
        nextDirectoris.add(nextDirectory);
        continue;
      }
    }

    nextDirectoris.forEach((directory) => {
      result.push({
        isDirectory: () => true,
        isFile: () => false,
        name: directory,
      } as fs.Dirent);
    });

    return result;
  });
}

test('read files on directory', async () => {
  const filePathes: string[] = [];
  for (let i = 1; i <= 10; i += 1) {
    const filePath = path.resolve(`${os.tmpdir}/${i}.mp${i}`);
    filePathes.push(filePath);
    mockReadDir(filePathes);

    const fileSystemService = new FileSystemService();
    const result = await fileSystemService.readDirectoryRecursivelyAsync(tmpDirPath);
    expect(result).toHaveLength(i);
  }
})

test('read files on nested directory', async () => {
  const filePathes: string[] = [
    path.resolve(`${os.tmpdir}/1.mp3`),
    path.resolve(`${os.tmpdir}/2.mp3`),
    path.resolve(`${os.tmpdir}/hello/3.mp3`),
    path.resolve(`${os.tmpdir}/hello/4.mp3`),
    path.resolve(`${os.tmpdir}/hello/abc/5.mp3`),
    path.resolve(`${os.tmpdir}/hello/abc/6.mp3`),
    path.resolve(`${os.tmpdir}/world/7.mp3`),
    path.resolve(`${os.tmpdir}/world/n/a/m/u/s/i/c/8.mp3`),
  ];

  mockReadDir(filePathes);

  const fileSystemService = new FileSystemService();
  const result = await fileSystemService.readDirectoryRecursivelyAsync(tmpDirPath);
  expect(result).toHaveLength(filePathes.length);

  const fileNames = result.map(fileInfo => path.basename(fileInfo.url));

  filePathes.forEach(filePath => {
    expect(fileNames).toContain(path.basename(filePath));
  })
})
