declare interface Window {
  ipcRenderer: IpcRenderer;
  isElectron: boolean;
}

declare interface SuccessRes {
  code: number;
  msg: string;
  data?: any;
}

declare interface blogDetail {
  category: number;
  complete: boolean;
  createTime: number;
  public: boolean;
  tags: string[];
  title: string;
  updateTime: number;
  uuid: string;
}
