import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class AuthEncryptionService {
  private secretKey = 'ÁcidoDesoxirribonucleico'; // Se puede cambiar la clave

  // Encriptar datos
  encrypt(data: string): string {
    return CryptoJS.AES.encrypt(data, this.secretKey).toString();
  }

  // Desencriptar datos
  decrypt(data: string): string {
    const bytes = CryptoJS.AES.decrypt(data, this.secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
}
