declare module 'googleapis' {
  export namespace google {
    export namespace drive {
      export interface drive_v3 {
        files: {
          create: (params: any) => Promise<any>;
          get: (params: any) => Promise<any>;
          delete: (params: any) => Promise<any>;
        };
        permissions: {
          create: (params: any) => Promise<any>;
        };
      }
    }
  }
}