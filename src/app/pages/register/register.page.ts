import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { AlertController, ToastController, IonicModule } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { lastValueFrom } from 'rxjs';

@Component({
    selector: 'app-register',
    templateUrl: './register.page.html',
    styleUrls: ['./register.page.scss'],
    standalone: true,
    imports: [
        IonicModule,
        FormsModule,
        ReactiveFormsModule,
        RouterLink,
    ],
})
export class RegisterPage implements OnInit {
  registerForm!: FormGroup;
  constructor(
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phone: ['', Validators.required],
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
  async register(): Promise<void> {
    if (this.registerForm.valid) {
      const customer = this.registerForm.value;
      console.log(customer);
      try {
        const response = await lastValueFrom(this.authService.register(customer))
        const alert = await this.alertController.create({
          header: 'Success',
          message: 'Registration successful!',
          buttons: ['OK'],
        });
        await alert.present();

        console.log('Registration successful:', response);
        this.router.navigate(['/login']);
      } catch (error) {
        console.error('Registration failed:', error);
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'Registration failed. Please try again.',
          buttons: ['OK'],
        });
        await alert.present();
      }
    } else {
      this.presentToast('Invalid form. Please check your inputs', 'danger');
    }
  }


}
