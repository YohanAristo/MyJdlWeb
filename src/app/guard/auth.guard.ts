import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserSession } from '../entity/common/user-session';
import { CryptoService } from '../service/crypto.service';
import { NotificationService } from '../service/notification.service';
import { AccountService } from '../service/account.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  nama:string;
  email:string;
  nip:string;
  time_out:number;
  new_time_out:number;

  userSession = new UserSession();

  constructor(private accountService: AccountService, 
    private router: Router, 
    private cryptoService: CryptoService,
    private notificationService: NotificationService){}

  canActivate(): boolean{
    if(this.accountService.isLoggedIn()){
      var sessionData = this.accountService.getLoggedIn();
      var decryption = this.cryptoService.decryptAES(sessionData);
      this.userSession = decryption;

      try{
        this.nama = this.userSession.nama;
        this.nip = this.userSession.nip;
        this.email = this.userSession.email;
        this.time_out = this.userSession.time_out;

        var now = new Date().getTime();
        if((now - this.time_out) < 15*60*1000){//(1 jam * (60 menit 60 detik 1000 milidetik))(1 jam)
          this.userSession.time_out = now;
          var new_session = this.cryptoService.encryptAES(this.userSession);
          this.accountService.setLoggedIn(new_session); 
          return true; 
        }
        else
        {
          this.notificationService.failed("Session Time Out");
          this.accountService.logout();
          return false;
        }
      }
      catch (e) {
        this.accountService.logout();
        return false;
      }      
    }
    else{
      this.accountService.logout();
      return false;
    }
  }
  
}
