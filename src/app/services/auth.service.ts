import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { SnackBarService } from './snackbar.service';
import { AccountModel } from '../models/account.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _isLoggedIn$ = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this._isLoggedIn$.asObservable();

  private _permissions$ = new BehaviorSubject<string[]>([]);
  permissions$ = this._permissions$.asObservable();

  private _account$ = new BehaviorSubject<AccountModel | null>(null);
  account$ = this._account$.asObservable();

  constructor(private apiService: ApiService, private snackBarService: SnackBarService) {
    const token = localStorage.getItem('access_token');
    const account = localStorage.getItem('userAccount');
    this._isLoggedIn$.next(!!token);
    this._account$.next(account ? JSON.parse(account) : null);
  }

  setPermissions(permissions: string[]) {
    // this.permissions = permissions;
    this._permissions$.next(permissions);
  }

  getPermissions() {
    return this._permissions$.value;
  }

  getAccount() {
    return this._account$.value;
  }

  isAllowed(permission: string) {
    return this._permissions$.value.includes(permission);
  }

  public get isLoggedIn(): boolean {
    return this._isLoggedIn$.value;
  }

  login(username: string, password: string) {
    if (this.isLoggedIn) {
      throw 'Already logged in';
    }
    return this.apiService.login(username, password).pipe(
      catchError((error) => {
        switch (error.status) {
          case 400:
            this.snackBarService.openSnackBar('Invalid username or password');
            break;
          case 500:
            this.snackBarService.openSnackBar('Internal server error');
            break;
          default:
            this.snackBarService.openSnackBar('Unknown error');
            break;
        }
        throw error;
      }),
      tap((response: any) => {
        this._isLoggedIn$.next(true);
        localStorage.setItem('access_token', response.body.access_token);

        this.apiService.getUserAccount().subscribe((account: AccountModel) => {
          this._account$.next(account);
          localStorage.setItem('userAccount', JSON.stringify(account));
        });
      })
    );
  }

  logout() {
    if (!this.isLoggedIn) {
      throw 'Not logged in';
    }
    this._isLoggedIn$.next(false);
    localStorage.removeItem('access_token');
  }
}
