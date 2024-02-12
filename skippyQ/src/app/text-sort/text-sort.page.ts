import { Component, OnInit } from '@angular/core';
import { RecycleService } from '../shared/services/recycle.service';
import { RecycleInfo } from '../shared/services/models/recycleInfo';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-text-sort',
  templateUrl: './text-sort.page.html',
  styleUrls: ['./text-sort.page.scss'],
})
export class TextSortPage implements OnInit {
recycleInfo: RecycleInfo[]= [];
isAdmin: boolean = false;

  constructor(private sorter: RecycleService, private authService: AuthService) { }

  async ngOnInit() {
    this.sorter.getAllRecycleInfo().subscribe(data => {
      this.recycleInfo = data;
      console.log(this.recycleInfo);
    });
  
    const user = await this.authService.observeAuthState(user => {
      if (user) {
        console.log('User is authenticated', user.email);
        this.authService.getUserRoleByEmail(user.email).then(currentUserRole => {
          console.log('Current user role:', currentUserRole);
          this.isAdmin = currentUserRole;
        });
      } else {
        console.log('User is not authenticated');
      }
    });
  }
  

  search(event) {
    const query = event.target.value.toLowerCase();

    // Update recycleInfo based on the search query
    this.recycleInfo = this.recycleInfo.filter((info) =>
      info.category.toLowerCase().includes(query) ||
      info.types.some((item) => item.toLowerCase().includes(query))
    );
  }
}
