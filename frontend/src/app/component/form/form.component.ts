import { Component } from '@angular/core';
import { formData, userEmail } from 'src/app/models/fileData';
import { FormServiceService } from 'src/app/services/form-service.service';


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent {

  constructor( private formService : FormServiceService ) {}

  formData : formData = { email : '', password : '', designation : '' };
  userEmail : userEmail = {email : ''};

  onSubmitForm() {
    console.log(this.formData);
    this.formService.sendFormData(this.formData).subscribe(result => {
      console.log(result)
    })
  }

  onUserSubmitForm() {
    console.log(this.userEmail.email)
    this.formService.getFormDataByEmail(this.userEmail.email).subscribe(response => {
      console.log(response)
    })
  }

}
