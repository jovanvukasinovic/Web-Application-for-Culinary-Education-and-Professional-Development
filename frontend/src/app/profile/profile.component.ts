import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  user: any = null;
  photoUrl: string | null = null;
  isEditing: { [key: string]: boolean } = {}; // Track editing state for each field
  editValues: { [key: string]: any } = {}; // Store edited values

  isEditingPassword: boolean = false; // Prati stanje uređivanja lozinke
  oldPassword: string = '';
  newPassword: string = '';
  confirmNewPassword: string = '';
  passwordForSave: string = ''; // Password required to confirm any save action

  passwordError: string | null = null; // Error message for password issues

  constructor(private router: Router, private userService: UserService) {}

  ngOnInit(): void {
    const userData = localStorage.getItem('currentUser');

    if (userData) {
      this.user = JSON.parse(userData);
    }

    if (this.user && this.user.photo && this.user.photo.data) {
      this.photoUrl = `data:${this.user.photo.contentType};base64,${this.user.photo.data}`;
    }
  }

  // getProfilePictureUrl() {
  //   if (this.user && this.user._id) {
  //     return `http://localhost:4000/api/users/profile-picture/${this.user._id}`;
  //   }
  //   return '';
  // }

  startEdit(field: string): void {
    this.isEditing[field] = true;
    this.editValues[field] = this.user[field];
  }

  cancelEdit(field: string): void {
    this.isEditing[field] = false;
    this.editValues[field] = this.user[field];
  }

  startPasswordChange(): void {
    this.isEditingPassword = true;
  }

  cancelPasswordChange(): void {
    this.isEditingPassword = false;
    this.oldPassword = '';
    this.newPassword = '';
    this.confirmNewPassword = '';
    this.passwordError = null;
  }

  validateNewPassword(): boolean {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!regex.test(this.newPassword)) {
      this.passwordError =
        'Password must contain at least 8 characters, including uppercase, lowercase, numbers, and special characters.';
      return false;
    }
    if (this.newPassword !== this.confirmNewPassword) {
      this.passwordError = 'New passwords do not match.';
      return false;
    }
    this.passwordError = null;
    return true;
  }

  saveEdit(field: string): void {
    if (!this.passwordForSave) {
      alert('Please enter your current password to confirm changes.');
      return;
    }

    this.userService
      .verifyPassword(this.user.username, this.passwordForSave)
      .subscribe(
        (isVerified) => {
          if (isVerified) {
            this.user[field] = this.editValues[field];
            this.isEditing[field] = false;
            alert('Profile updated successfully.');
          } else {
            alert('Incorrect current password.');
          }
        },
        (error) => {
          console.error('Password verification failed:', error);
          alert('An error occurred while verifying your password.');
        }
      );
  }

  savePasswordChange(): void {
    if (!this.oldPassword) {
      alert('Please enter your current password.');
      return;
    }

    if (!this.validateNewPassword()) {
      return;
    }

    this.userService
      .changePassword(this.user.username, this.oldPassword, this.newPassword)
      .subscribe(
        () => {
          alert('Password changed successfully.');
          this.cancelPasswordChange();
        },
        (error) => {
          console.error('Password change failed:', error);
          alert('Failed to change password. Please try again.');
        }
      );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.router.navigate(['/']);
  }
}
