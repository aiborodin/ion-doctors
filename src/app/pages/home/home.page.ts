import {Component, OnInit} from '@angular/core';
import {DataService, Doctor} from '../../service/data.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService, User, Role} from '../../service/auth.service';
import {AlertController} from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  doctors: Doctor[];
  showNew = false;
  showEdit = -1;
  extraData: string;
  user: User;
  role = Role;

  constructor(
    private dataService: DataService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    public alertController: AlertController
  ) {
    route.params.subscribe(params => this.extraData = params.data);
    this.authService.user.subscribe(user => this.user = user);
  }
  ngOnInit() {
    this.dataService.getDoctors().subscribe(
      doctors => this.doctors = doctors
    );
  }
  delete(id: number) {
    this.dataService.deleteDoctor(id).subscribe(
      response => {
        console.log('Deleted doctor with id: ' + id);
        this.dataService.getDoctors().subscribe(doctors => this.doctors = doctors);
      }, error => this.showMessage(error.error.message)
    );
  }
  addDoctor(doctor: Doctor) {
    this.dataService.addDoctor(doctor).subscribe(
      doc => {
        console.log('Added doctor', doc);
        this.dataService.getDoctors().subscribe(doctors => this.doctors = doctors);
      }, error => this.showMessage(error.error.message)
    );
    this.showNew = false;
  }
  logOut() {
    this.authService.signOut();
  }
  goodTransaction() {
    this.dataService.runGoodTransaction().subscribe(resp => this.showMessage(resp));
  }
  badTransaction() {
    this.dataService.runBadTransaction().subscribe(resp => this.showMessage(resp));
  }
  async showMessage(message) {
    const alert = await this.alertController.create({
      header: 'Attention!',
      message: message,
      buttons: ['Ok']
    });
    await alert.present();
  }
}
