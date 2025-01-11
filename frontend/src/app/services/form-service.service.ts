import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { formData } from '../models/fileData';
import * as CryptoJs from 'crypto-js';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FormServiceService {

  constructor(private http: HttpClient) { }

  encryptData(data : string) : string {
    return CryptoJs.AES.encrypt(data, this.encryptionKey).toString();
  }

  decryptData(encrypted : string) : string {
    const bytes = CryptoJs.AES.decrypt(encrypted, this.encryptionKey);
    return bytes.toString(CryptoJs.enc.Utf8);
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

  getFormDataByEmail(email : string) {
    const encryptedEmail = this.encryptData(email);
    return this.http.get(`${this.apiURL}/getUserData/${encodeURIComponent(encryptedEmail)}`)
  }

  getFormData() {
    return this.http.get<formData>(`${this.apiURL}/getformdata`).pipe(map((data : formData) => {
      data.email = this.decryptData(data.email);
      data.password = this.decryptData(data.password);
      data.designation = data.designation;
      return data;
    }))
  }
}
