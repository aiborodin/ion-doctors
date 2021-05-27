import { Component, OnInit } from '@angular/core';
import {AuthService, User} from "../../service/auth.service";
import {DataService} from "../../service/data.service";
import {AlertController} from "@ionic/angular";

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit {

  users: User[];
  currPage: number;
  totalPages: number;
  showNew: boolean = false;
  showEdit: number = -1;
  user: User;

  constructor(
    private dataService: DataService,
    private authService: AuthService,
    private alertController: AlertController
  ) {
    this.authService.user.subscribe(user => this.user = user);
  }
  ngOnInit() {
    this.refreshData();
  }
  refreshData(refresher?: any) {
    this.users = [];
    this.currPage = 1;
    this.totalPages = 0;
    this.addData(refresher);
  }
  addData(refresher: any) {
    if (this.totalPages === 0) {
      this.dataService.getUsersResponse(this.currPage).subscribe(resp => {
        this.totalPages = +resp.headers.get('x-pagination-page-count')[0];
        this.users = resp.body;
        this.currPage++;
      });
    } else if (this.currPage <= this.totalPages){
      this.dataService.getUsers(this.currPage).subscribe(users => {
        this.users = this.users.concat(users);
        this.currPage++;
      });
    }
    if (refresher) {
      refresher.target.complete();
    }
  }
  addUser(user: User) {
    this.dataService.addUser(user).subscribe(resp => {
        console.log('Added user');
        console.log(resp);
        this.refreshData();
      }, error => this.showError(error.error)
    );
    this.showNew = false;
  }
  deleteUser(id: number) {
    this.dataService.deleteUser(id).subscribe(
      response => {
        console.log('Deleted user with id: ' + id);
        this.refreshData();
      }
    );
  }
  logOut() {
    this.authService.signOut();
  }
  async showError(message: string) {
    const alert = await this.alertController.create({
      header: 'Attention!',
      subHeader: 'Error while saving data',
      message: message,
      buttons: ['Ok']
    });
    await alert.present();
  }
}
