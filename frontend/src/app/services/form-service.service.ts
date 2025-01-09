import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { formData } from '../models/fileData';
import * as CryptoJs from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class FormServiceService {

  constructor(private http: HttpClient) { }

  encryptData(data : string) : string {
    return CryptoJs.AES.encrypt(data, this.encryptionKey).toString();
  }

  private apiURL = 'http://localhost:8080';
  private encryptionKey = 'veerbhogyavasundhra';

  sendFormData(data: formData) {
    const encryptedData = {
      email : this.encryptData(data.email),
      password : this.encryptData(data.password),
      designation : data.designation
    }
    return this.http.post(`${this.apiURL}/sendformdata`, encryptedData)
  }
}
