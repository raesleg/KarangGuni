import { Component, ViewChild } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { AdminService } from '../shared/services/admin.service';
import { ActionSheetController, IonSearchbar } from '@ionic/angular';
import { Router } from '@angular/router';
import { Trans } from '../shared/services/models/trans';

@Component({
  selector: 'app-tab6',
  templateUrl: 'tab6.page.html',
  styleUrls: ['tab6.page.scss']
})
export class Tab6Page {

  trans: Trans[] = [];
  transtoday: Trans[] = [];
  sum: number;
  sumtoday: number;

  @ViewChild('searchBar', {static: false}) searchBar: IonSearchbar;

  constructor(
    private adminService : AdminService,
    private actionSheetCtrl: ActionSheetController,
    private authService: AuthService,
    private router: Router

  ) {}

  canDismiss = async () => {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Are you sure to Log Out?',
      buttons: [
        {
          text: 'Yes',
          role: 'confirm',
        },
        {
          text: 'No',
          role: 'cancel',
        },
      ],
    });

    actionSheet.present();

    const { role } = await actionSheet.onWillDismiss();

    return role === 'confirm';
  };


  logout() {
    this.canDismiss().then((confirmed) => {
      if (confirmed) {
        // this.authService.clearUserData()
        console.log('cleared')
        this.authService.logout();
        this.router.navigate(['login']);
          }
    });
  }

  isWithinToday(createTime: string): boolean {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0); // Set to the beginning of the day
    console.log(todayStart)
  
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999); // Set to the end of the day
    console.log(todayEnd)
  
    const createTimeDate = new Date(createTime);
    console.log(createTimeDate)
    
    return createTimeDate >= todayStart && createTimeDate <= todayEnd;
  }

  getSum(){
    const sum = this.sum
    return sum
  }

  getSumToday(){
    const sumtoday = this.sumtoday
    return sumtoday
  }

  search(event){
    const text = event.target.value;
    this.adminService.getAllTrans().subscribe((allTrans: Trans[]) => {
      if (text && text.trim() !== '') {
        this.trans = this.trans.filter(
          item => item.id.toLowerCase().includes(text.toLowerCase())
        );
      } else {
        this.trans = allTrans
      }
    });  
    
  }

  refresh($event){
    this.searchBar.value = '';
    $event.target.complete();
    this.adminService.getAllTrans().subscribe((allTrans: Trans[]) => {
        this.trans = allTrans
      })
    }


  async ngOnInit() {

    this.adminService.getAllTrans()
    .subscribe(data => {
      // this.profile = data.filter(item => item.isAdmin !== true);
      // this.filteredusers = this.profile
      this.trans = data
      console.log(this.trans)

      this.sum = this.trans.reduce((accumulator, item) => accumulator + (item.amount * 0.1), 0);
      console.log(this.sum)
  
    })

    this.adminService.getAllTrans()
    .subscribe(data => {
      this.transtoday = data.filter(item => this.isWithinToday(item.create_time));
      console.log('today',this.transtoday);

      this.sumtoday = this.transtoday.reduce((accumulator, item) => accumulator + (item.amount * 0.1), 0);
      console.log(this.sumtoday)

    });

    

  }
  
}
