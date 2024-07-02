import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    signupForm: FormGroup;
    isLogin: boolean = true;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router,
        @Inject(PLATFORM_ID) private platformId: any
    ) {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(7)]]
        });

        this.signupForm = this.fb.group({
            name: ['', [Validators.required, Validators.minLength(5)]],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(7)]],
            cpassword: ['', Validators.required]
        }, { validator: this.passwordMatchValidator });
    }

    ngOnInit(): void {}

    passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
        const password = group.get('password')?.value;
        const cpassword = group.get('cpassword')?.value;
        return password === cpassword ? null : { passwordMismatch: true };
    }

    toggleMode() {
        this.isLogin = !this.isLogin;
    }

    onSubmitLogin() {
        if (this.loginForm.valid) {
            const { email, password } = this.loginForm.value;
            this.authService.login({ email, password }).subscribe(
                response => {
                    console.log('Login successful:', response);
                    if (isPlatformBrowser(this.platformId)) {
                        localStorage.setItem('token', response.token);
                    }
                    this.router.navigate(['/home']);
                },
                error => {
                    console.error('Error logging in:', error);
                    alert('Invalid email or password.');
                }
            );
        } else {
            this.loginForm.markAllAsTouched();
        }
    }

    onSubmitSignup() {
        if (this.signupForm.valid) {
            const userData = this.signupForm.value;
            console.log(typeof(userData));
            console.log("Sending signup Data as:" + JSON.stringify(userData));

            this.authService.signup(userData).subscribe(
                response => {
                    console.log('Signup successful:', response);
                    alert('User registered successfully. Please login to continue.');
                    this.toggleMode();
                },
                error => {
                    console.error('Error signing up:', error);
                    if (error.status === 409) {
                        alert('The email address is already in use. Please try a different email address.');
                    } else {
                        alert('Unable to register user. Please try again later.');
                    }
                }
            );
        } else {
            this.signupForm.markAllAsTouched();
        }
    }
}
