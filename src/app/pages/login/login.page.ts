import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AlertController, ToastController, IonicModule } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
    standalone: true,
    imports: [
        IonicModule,
        FormsModule,
        ReactiveFormsModule,
        RouterLink,
    ],
})
export class LoginPage implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController,
    private fb: FormBuilder,
  ) { }
  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }
  async presentToast(message: string, status: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: status
    });
    toast.present();
  }
  async login(): Promise<void> {
    if (this.loginForm.valid) {
      try {
        const { email, password } = this.loginForm.value;
        const response = await firstValueFrom(this.authService.login({ email, password }))
        if (response.status === 'success') {
          console.log(response.data)
          this.presentToast('Login successful!', 'success');
          console.log('Login successful:', response);
          localStorage.setItem('islogin', '1');
          localStorage.setItem('name', response.data.name);
          localStorage.setItem('email', response.data.email);
          localStorage.setItem('customerId', response.data.id);
          localStorage.setItem('org_id', response.data.org_id);
          // localStorage.setItem('apparea', 'savingapp');
          localStorage.setItem('phone', response.data.phone);
          this.router.navigate(['/account']);
        } else {
          this.presentToast('Login failed. Please check your credentials and try again', 'danger');
          console.log('Login failed. Please check your credentials and try again', response);
        }
      } catch (error: any) {
        console.error('Login failed:', error);
        this.presentToast('Login failed.', 'danger');

      }
    } else {
      this.presentToast('Invalid form. Please check your inputs', 'danger');
    }
  }
}
