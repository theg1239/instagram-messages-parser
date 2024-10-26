declare module 'adm-zip' {
    export interface IZipEntry {
      entryName: string;
      isDirectory: boolean;
      getData(): Buffer;
      getDataAsText(encoding?: string): string;
    }
  
    export default class AdmZip {
      constructor(buffer?: Buffer | string);
      getEntries(): IZipEntry[];
      readFile(entry: IZipEntry): Buffer | null;
      readAsText(entry: IZipEntry, encoding?: string): string | null;
    }
  }