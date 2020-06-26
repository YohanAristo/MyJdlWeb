import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/service/account.service';
import { CryptoService } from 'src/app/service/crypto.service';
import { UserSession } from 'src/app/entity/common/user-session';
declare  var jQuery:  any;

@Component({
  selector: 'app-top-bar-menu',
  templateUrl: './top-bar-menu.component.html',
  styleUrls: ['./top-bar-menu.component.css']
})
export class TopBarMenuComponent implements OnInit {

  nama: string;
  email: string;
  nip: string;
  time_out: number

  userSession = new UserSession();
  
  constructor(
    private accountService: AccountService,
    private cryptoService: CryptoService
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(){
    var session = this.accountService.getLoggedIn()
    this.userSession = this.cryptoService.decryptAES(session);
    try{
      this.nama = this.userSession.nama;
      this.email = this.userSession.email;
      this.nip = this.userSession.nip;
      this.time_out = this.userSession.time_out;
    }
    catch (e) {
      this.accountService.logout();
    }
  }

  onLogout(){
    this.accountService.logout();
  }

  onProfile(){
    
  }

  onMenu(){
    (function sideBar($) {
        "use strict";
        $("body").toggleClass("sb-sidenav-toggled");
    })(jQuery);
  }
}
