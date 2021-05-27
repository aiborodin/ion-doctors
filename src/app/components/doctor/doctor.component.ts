import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DataService, Doctor} from '../../service/data.service';

@Component({
  selector: 'app-doctor',
  templateUrl: './doctor.component.html',
  styleUrls: ['./doctor.component.scss'],
})
export class DoctorComponent implements OnInit {

  @Input() doctor: Doctor;
  @Input() isNew: boolean;
  @Output() addDoc = new EventEmitter();
  @Output() cancelAddingDoc = new EventEmitter();
  title: string;

  constructor(private dataService: DataService) { }

  ngOnInit() {
    if (this.isNew) {
      this.doctor = {
        code: null,
        surname: '',
        hospital_code: null,
        license_number: null,
        prescriptions_count: 0
      };
      this.title = 'New doctor';
    }
  }

  addNew() {
    if (this.isNew) {
      this.addDoc.emit(this.doctor);
    }
  }
  cancelAdding() {
    if (this.isNew) {
      this.cancelAddingDoc.emit();
    }
  }
  saveDoctor() {
    this.dataService.updateDoctor(this.doctor).subscribe(response => console.log('Saved doctor', response));
  }
}
