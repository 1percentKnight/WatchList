import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { dbConnectionService } from '../../services/dbConnection.service';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {
    loginForm: FormGroup;
    signupForm: FormGroup;
    isLogin: boolean = true;
    userId = null;
    formValid = false;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private dbConnectionService: dbConnectionService,
        private authService: AuthService
    ) {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(7)]]
        });

        this.signupForm = this.fb.group({
            name: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(7)]],
            cpassword: ['', [Validators.required, Validators.minLength(7)]]
        }, { validator: this.checkPasswords });
    }


    checkPasswords(group: FormGroup) {
        const pass = group.get('password')?.value;
        const confirmPass = group.get('cpassword')?.value;
        if (pass !== confirmPass) {
            group.get('cpassword')?.setErrors({ passwordMismatch: true });
        } else {
            group.get('cpassword')?.setErrors(null);
        }
        return null;
    }

    toggleMode() {
        this.isLogin = !this.isLogin;
    }

    onSubmitLogin() {
        if (this.loginForm.valid) {
            console.log(this.loginForm.value);

            this.authService.login(this.loginForm.value).subscribe(
                result => {
                    console.log(result);
                    console.log("Login is successful");
                    localStorage.setItem('authToken', result.token);
                    this.userId = result.userId;
                    this.router.navigateByUrl('/home');
                },
                error => {
                    console.log(error);
                    console.log("Login failed");
                }
            )

        } else {
            this.loginForm.markAllAsTouched();
        }
    }

    onSubmitSignup() {
        if (this.signupForm.valid) {
            const userData = this.signupForm.value;
            console.log(typeof (userData));
            console.log("Sending signup Data as:" + JSON.stringify(userData));

            this.dbConnectionService.addUser(userData).subscribe(
                result => {
                    alert("Signup successful, redirecting back to login");
                    this.toggleMode();
                }
            );
        } else {
            this.signupForm.markAllAsTouched();
        }
    }
}
