import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AlertController} from '@ionic/angular';
import {AuthService, Role} from '../../service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  username: string;
  password: string;

  constructor(
    private router: Router,
    private authService: AuthService,
    public alertController: AlertController
  ) { }

  ngOnInit() {
    // console.log('works');
    // this.router.navigate(['/home']).catch(err => console.log(err));
  }

  login() {
    this.authService.login({
      username: this.username,
      password: this.password
    }).subscribe(user => {
      this.authService.setUser(user);
      if (user.role === Role.ADMIN) {
        this.router.navigate(['/admin-dashboard/users']);
      } else {
        this.router.navigate(['/home']);
      }
    }, error => {
      console.log(error);
      this.showError(error.error.message);
    });
  }

  async showError(message: string) {
    const alert = await this.alertController.create({
      header: 'Attention!',
      subHeader: 'Authentication error',
      message,
      buttons: ['Ok']
    });
    await alert.present();
  }
}
