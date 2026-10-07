import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  errorMessage = signal('');

  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  async onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    this.errorMessage.set('');

    const { email, password } = this.loginForm.getRawValue();

    try {
      await this.authService.login(email, password);

      console.log('Login successful');
      this.router.navigate(['/dashboard']);
    } catch (error) {
      console.error('Login failed', error);
      this.errorMessage.set('Invalid email or password.');
    }
  }
}
