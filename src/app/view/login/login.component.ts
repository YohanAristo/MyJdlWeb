import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/service/account.service';
import { CryptoService } from 'src/app/service/crypto.service';
import { NotificationService } from 'src/app/service/notification.service';
import { GetLoginResp } from 'src/app/entity/account/get-login-resp';
import { PostLoginReq } from 'src/app/entity/account/post-login-req';
import { UserSession } from 'src/app/entity/common/user-session';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  getLoginResp = new GetLoginResp();
  postLoginReq = new PostLoginReq();
  userSession = new UserSession();

  constructor(
    private fb: FormBuilder,
    private router: Router, 
    private notificationService: NotificationService,
    private accountService: AccountService,
    private cryptoService: CryptoService) {
      localStorage.removeItem('user');
     }

  ngOnInit(): void {
    localStorage.removeItem('user');
    this.postLoginForm();
  }

  postLoginForm(){
    this.loginForm = this.fb.group({
      nip: ['', Validators.required],
      password: ['',  Validators.required]
    })
  } 

  onSubmit(){
    var nip_form = this.loginForm.get('nip').value;
    var password_form = this.loginForm.get('password').value;

    if(nip_form != "" && password_form != ""){
      var pass_encrypt = this.cryptoService.encryptMD5(password_form);

      this.postLoginReq.nip = nip_form;
      this.postLoginReq.password = pass_encrypt;

      this.accountService.postLoginWeb(this.postLoginReq)
        .subscribe(data => {
        this.getLoginResp = data;
        
        if(this.getLoginResp.error_code == '00'){
          var now = new Date().getTime();   

          this.userSession.nama = this.getLoginResp.nama;
          this.userSession.email = this.getLoginResp.email;
          this.userSession.nip = this.getLoginResp.nip;
          this.userSession.time_out = now;

          this.router.navigate(['']);
          var session = this.cryptoService.encryptAES(this.userSession); 
          this.accountService.setLoggedIn(session);
        }
        else{
          this.reset();
          this.notificationService.failed(this.getLoginResp.error_message);
        }
      });
    }
    else{
      console.log("reset")
      this.reset();
      this.notificationService.failed("Tidak Dapat Login!");
    }
  }
 
  reset(){
    this.loginForm.reset();
  }
}
