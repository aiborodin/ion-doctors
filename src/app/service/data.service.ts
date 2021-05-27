import { Injectable } from '@angular/core';
import {Observable, of, pipe, Subject} from 'rxjs';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {AuthService, User} from './auth.service';

export interface Doctor {
  code: number;
  surname: string;
  license_number: number;
  hospital_code: number;
  prescriptions_count: number;
}

// export interface Employee {
//   id: number;
//   name: string;
//   age: number;
//   gender: string;
//   department_id: number;
// }

@Injectable({
  providedIn: 'root'
})
export class DataService {

  public readonly baseUrl = 'http://mssql-api.loc/';
  public readonly baseVersioned = this.baseUrl + 'v1/';

  private accessToken: string;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    authService.user.subscribe(user => this.accessToken = user.access_token);
  }
  getDoctors(): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(`${this.baseVersioned}doctors?access-token=${this.accessToken}`);
  }
  addDoctor(doctor: Doctor): Observable<Doctor> {
    return this.http.post<Doctor>(`${this.baseVersioned}doctors?access-token=${this.accessToken}`, doctor);
  }
  updateDoctor(doctor: Doctor): Observable<Doctor> {
    return this.http.put<Doctor>(this.baseVersioned + 'doctors/' + doctor.code + '?access-token=' + this.accessToken, doctor);
  }
  deleteDoctor(id: number): Observable<Doctor> {
    return this.http.delete<Doctor>(this.baseVersioned + 'doctors/' + id + '?access-token=' + this.accessToken);
  }
  runGoodTransaction() {
    return this.http.post(this.baseVersioned + 'doctor/good-transaction' +  '?access-token=' + this.accessToken, '');
  }
  runBadTransaction() {
    return this.http.post(this.baseVersioned + 'doctor/bad-transaction' +  '?access-token=' + this.accessToken, '');
  }
  getUsers(page: number = 1): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseVersioned}users?access-token=${this.accessToken}&page=${page}`);
  }
  getUsersResponse(depId: number, page: number = 1): Observable<HttpResponse<User[]>> {
    return this.http.get<User[]>(`${this.baseVersioned}users?access-token=${this.accessToken}&page=${page}`,
      { observe: 'response' });
  }
  addUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}signup`, user);
  }
  updateUser(user: User): Observable<User> {
    return this.http.put<User>(this.baseVersioned + 'users/' + user.id + '?access-token=' + this.accessToken, user);
  }
  deleteUser(id: number): Observable<User> {
    return this.http.delete<User>(this.baseVersioned + 'users/' + id + '?access-token=' + this.accessToken);
  }
}
