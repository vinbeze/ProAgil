import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/_models/User';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  registerForm!: FormGroup;
  user!: User;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private authService: AuthService,
    private router: Router
    
  ) { }

  ngOnInit() {
    this.validation();
  }

  validation(){
    this.registerForm = this.fb.group({
      fullName: ['',Validators.required],
      email: ['',[Validators.required,Validators.email]],
      userName: ['',Validators.required],
      passwords: this.fb.group({
        password: ['',[Validators.required,Validators.minLength(4)]],
        confirmPassword: ['',[Validators.required,Validators.minLength(4)]]
      }, 
      { validator: this.compararSenhas })
    });
  }

  compararSenhas(fb: FormGroup){
    const confirmeSenhaCtrl = fb.get('confirmPassword');
    if(confirmeSenhaCtrl?.errors == null || 'mismatch' in confirmeSenhaCtrl.errors){
      if(fb.get('password')?.value !== confirmeSenhaCtrl?.value){
        confirmeSenhaCtrl?.setErrors({ mismatch: true});
      }else{
        confirmeSenhaCtrl?.setErrors(null)
      }
    }
  }

  cadastrarUsuario(){
    if (this.registerForm.valid) {
      this.user = Object.assign(
        {password: this.registerForm.get('passwords.password')?.value}
        ,this.registerForm.value);
      this.authService.register(this.user).subscribe(
        () => {
          this.router.navigate(['/user/login']);
          this.toastr.success('Cadastro Realizado');
        },

        error => {
          const erro = error.error;
          erro.forEach ((element: { code: any;}) => {
            switch(element.code){
              case 'DuplicateUserName':
                this.toastr.error('Cadastro Duplicado!');
                break;
              default:
                this.toastr.error(`Erro no Cadastro! CODE: ${element.code}` );
                break;
            }
          })
          
          
        }
      )
    }
  }

}
