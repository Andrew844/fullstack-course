import { Injectable } from '@angular/core';
import { UserInterface } from '../types/user.interface';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { UserResponseInterface } from '../types/userResponse.interface';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _token: string | null = null;

  constructor(private http: HttpClient) {}

  register(user: UserInterface): Observable<UserResponseInterface> {
    return this.http.post<UserResponseInterface>('/api/auth/register', user);
  }

  login(user: UserInterface): Observable<UserResponseInterface> {
    return this.http.post<UserResponseInterface>('/api/auth/login', user).pipe(
      tap((response: UserResponseInterface) => {
        localStorage.setItem('auth-token', response.token);
        this.token = response.token;
      })
    );
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  logout(): void {
    this.token = null;
    localStorage.clear();
  }

  get token() {
    return this._token;
  }

  set token(value: string | null) {
    this._token = value;
  }
}
