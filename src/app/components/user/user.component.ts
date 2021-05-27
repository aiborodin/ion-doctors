import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DataService} from "../../service/data.service";
import {AlertController} from "@ionic/angular";
import {User} from "../../service/auth.service";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {

  @Input() user: User;
  @Input() isNew: boolean;
  @Output() addUser = new EventEmitter();
  @Output() cancelAdding = new EventEmitter();
  @Output() saveUser = new EventEmitter();
  title: string;
  password: string;

  constructor(
    private dataService: DataService,
    private alertController: AlertController
  ) {
  }

  ngOnInit() {
    if (this.isNew) {
      this.user = {
        id: null,
        username: null,
        role: null,
        email: null,
        access_token: null
      };
      this.title = 'New user';
    }
  }

  addNew() {
    if (this.isNew) {
      let user: any = this.user;
      user.password = this.password;
      this.addUser.emit(user);
    }
  }
  cancel() {
    if (this.isNew) {
      this.cancelAdding.emit();
    }
  }
  save() {
    this.dataService.updateUser(this.user).subscribe(updated => {
      console.log(updated);
      this.saveUser.emit();
    }, error => {
      this.showError(error.error.message);
    });
  }
  async showError(message: string) {
    const alert = await this.alertController.create({
      header: 'Server error!',
      message: message,
      buttons: ['Ok']
    });
    await alert.present();
  }

}
