
declare interface Window {
  ipcRenderer: IpcRenderer;
  isElectron: boolean;
}

declare interface SuccessRes {
  code: number;
  msg: string;
  data?: any;
}