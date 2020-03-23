import { AdobeEventListener } from './api';
declare const newAdobeAppListener: (host: string, port: number, callback: (commandName: string) => void) => AdobeEventListener;
export default newAdobeAppListener;
