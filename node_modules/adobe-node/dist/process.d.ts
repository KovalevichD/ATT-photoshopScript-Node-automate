import { AdobeProcessOptions, AdobeAppProcess } from "./api";
declare const newAdobeAppProcess: (appPath: string, closeCallback: Function, options?: AdobeProcessOptions) => AdobeAppProcess;
export default newAdobeAppProcess;
