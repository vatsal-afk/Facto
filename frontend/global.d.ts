interface Window {
    ethereum?: import('@metamask/sdk').MetaMaskInpageProvider;
  }

declare module "crypto-js" {
    const content: any;
    export default content;
}
  
declare module 'google-trends-api';
