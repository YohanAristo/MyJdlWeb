import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-side-bar-menu',
  templateUrl: './side-bar-menu.component.html',
  styleUrls: ['./side-bar-menu.component.css']
})
export class SideBarMenuComponent implements OnInit {

  constructor(
    private route: ActivatedRoute, 
    private router: Router) { }

  ngOnInit(): void {
  }

  showDashboard(){
    this.router.navigate(['']);
  }

  showReimburseManagement(){
    this.router.navigate(['']);
  }

  // showReimburseManagement(){
  //   this.router.navigate(['reimburse']);
  // }

  showReimburseSummary(){
    this.router.navigate(['reimburse-summary']);
  }

  showInventory(){
    this.router.navigate(['inventory']);
  }

  // showReimburse(){
  //   this.router.navigate(['reimburse'], { relativeTo: this.route });
  // }
}
