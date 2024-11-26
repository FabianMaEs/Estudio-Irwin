import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isLoggedIn: boolean = false;

  login(username: string, password: string): boolean {
    // Usuario y contraseña de prueba
    
    if (username === 'admin' && password === '1234') {
      this.isLoggedIn = true;
      localStorage.setItem('isLoggedIn', 'true');
      return true;
    }
    return false;
  }

  logout(): void {
    this.isLoggedIn = false;
    localStorage.removeItem('isLoggedIn');
  }

  isAuthenticated(): boolean {
    const storedStatus = localStorage.getItem('isLoggedIn');
    return storedStatus === 'true';
  }
}
