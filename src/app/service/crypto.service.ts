import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {

  keys: string = "myjdl";

  constructor() { }

  encryptMD5(data){
    return CryptoJS.MD5(data).toString();
  }

  encryptAES(data){
    try {
      return CryptoJS.AES.encrypt(JSON.stringify(data), this.keys).toString();
    } catch (e) {
      console.log(e);
    }    
  }

  decryptAES(data){
    try {
      const bytes = CryptoJS.AES.decrypt(data, this.keys);
      if (bytes.toString()) {
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      }
      return data;
    } 
    catch (e) {
      console.log(e);
    }

  }
}
