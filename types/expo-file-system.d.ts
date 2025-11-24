declare module 'expo-file-system' {
  export interface FileSystem {
    documentDirectory: string | null;
    cacheDirectory: string | null;

    getInfoAsync: any;
    readAsStringAsync: any;
    writeAsStringAsync: any;
    deleteAsync: any;
    makeDirectoryAsync: any;
    copyAsync: any;

    EncodingType: {
      Base64: 'base64';
      UTF8: 'utf8';
    };
  }

  export const documentDirectory: string | null;
  export const cacheDirectory: string | null;

  export const getInfoAsync: any;
  export const readAsStringAsync: any;
  export const writeAsStringAsync: any;
  export const deleteAsync: any;
  export const makeDirectoryAsync: any;
  export const copyAsync: any;

  export const EncodingType: {
    Base64: 'base64';
    UTF8: 'utf8';
  };
}
