import {Injectable, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import { Storage } from '@ionic/storage-angular';
import {filter, map} from 'rxjs/operators';
import {Router} from '@angular/router';

export interface User {
  id: number;
  username: string;
  email: string;
  access_token: string;
  role: Role;
}

export enum Role {
  VIEWER = 'Viewer',
  EDITOR = 'Editor',
  ADMIN = 'Admin'
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public readonly baseUrl = 'http://mssql-api.loc/';

  public readonly STORAGE_TOKEN_KEY = 'user-token';

  public user: Observable<User>;
  private authState = new BehaviorSubject<User>(null);

  constructor(
    private http: HttpClient,
    private storage: Storage,
    private router: Router
  ) {
    this.init();
    this.user = this.authState.asObservable().pipe(
      filter(user => user !== null)
    );
    this.loadUser();
  }

  async init(): Promise<void> {
    await this.storage.create();
  }

  loadUser(): void {
    this.storage.get(this.STORAGE_TOKEN_KEY).then(user => {
      if (user) {
        this.authState.next(user);
        console.log('Loaded', user);
      } else {
        this.authState.next(new class implements User {
          access_token: string;
          email: string;
          id: number;
          role: Role;
          username: string;
        });
      }
    });
  }

  login(user: any): Observable<User> {
    return this.http.post<User>(this.baseUrl + 'login', user);
  }

  setUser(user: User) {
    this.storage.set(this.STORAGE_TOKEN_KEY, user);
    this.authState.next(user);
  }

  async signOut() {
    await this.storage.set(this.STORAGE_TOKEN_KEY, null);
    this.authState.next(null);
    this.router.navigateByUrl('/login');
  }
}
