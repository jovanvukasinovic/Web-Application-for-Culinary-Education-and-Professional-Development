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

  isEditingPassword: boolean = false; // Track password edit state
  oldPassword: string = '';
  newPassword: string = '';
  confirmNewPassword: string = '';
  passwordForSave: string = ''; // Password required to confirm any save action

  passwordError: string | null = null; // Error message for password issues

  modalVisible: boolean = false; // Modal visibility
  modalTitle: string = '';
  modalMessage: string = '';

  isImageModalVisible: boolean = false; // Enlarged image modal visibility
  selectedImage: File | null = null; // Selected image file for upload

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

  startEdit(field: string): void {
    this.cancelAllEdits(); // Cancel all other edits
    this.isEditing[field] = true;
    this.editValues[field] = this.user[field];
  }

  cancelEdit(field: string): void {
    this.isEditing[field] = false;
    this.editValues[field] = this.user[field];
  }

  startPasswordChange(): void {
    this.cancelAllEdits(); // Cancel all other edits
    this.isEditingPassword = true;
  }

  cancelPasswordChange(): void {
    this.isEditingPassword = false;
    this.oldPassword = '';
    this.newPassword = '';
    this.confirmNewPassword = '';
    this.passwordError = null;
  }

  cancelAllEdits(): void {
    for (let key in this.isEditing) {
      this.isEditing[key] = false;
    }
    this.isEditingPassword = false;
    this.passwordForSave = '';
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
      this.showModal(
        'Error',
        'Please enter your current password to confirm changes.'
      );
      return;
    }

    this.userService
      .verifyPassword(this.user.username, this.passwordForSave)
      .subscribe(
        (isVerified) => {
          if (isVerified) {
            switch (field) {
              case 'username':
                this.userService
                  .updateUsername(this.user._id, this.editValues[field])
                  .subscribe(
                    () => {
                      this.user.username = this.editValues[field];
                      this.showModal(
                        'Success',
                        'Username updated successfully.'
                      );
                      this.isEditing[field] = false;
                      this.updateLocalStorage();
                    },
                    (error: any) => {
                      console.error('Error updating username:', error);
                      this.showModal('Error', 'Failed to update username.');
                    }
                  );
                break;

              case 'email':
                this.userService
                  .updateEmail(this.user._id, this.editValues[field])
                  .subscribe(
                    () => {
                      this.user.email = this.editValues[field];
                      this.showModal('Success', 'Email updated successfully.');
                      this.isEditing[field] = false;
                      this.updateLocalStorage();
                    },
                    (error: any) => {
                      console.error('Error updating email:', error);
                      this.showModal('Error', 'Failed to update email.');
                    }
                  );
                break;

              case 'firstname':
                this.userService
                  .updateFirstname(this.user._id, this.editValues[field])
                  .subscribe(
                    () => {
                      this.user.firstname = this.editValues[field];
                      this.showModal(
                        'Success',
                        'Firstname updated successfully.'
                      );
                      this.isEditing[field] = false;
                      this.updateLocalStorage();
                    },
                    (error: any) => {
                      console.error('Error updating firstname:', error);
                      this.showModal('Error', 'Failed to update firstname.');
                    }
                  );
                break;

              case 'lastname':
                this.userService
                  .updateLastname(this.user._id, this.editValues[field])
                  .subscribe(
                    () => {
                      this.user.lastname = this.editValues[field];
                      this.showModal(
                        'Success',
                        'Lastname updated successfully.'
                      );
                      this.isEditing[field] = false;
                      this.updateLocalStorage();
                    },
                    (error: any) => {
                      console.error('Error updating lastname:', error);
                      this.showModal('Error', 'Failed to update lastname.');
                    }
                  );
                break;

              case 'phone':
                this.userService
                  .updatePhone(this.user._id, this.editValues[field])
                  .subscribe(
                    () => {
                      this.user.phone = this.editValues[field];
                      this.showModal(
                        'Success',
                        'Phone number updated successfully.'
                      );
                      this.isEditing[field] = false;
                      this.updateLocalStorage();
                    },
                    (error: any) => {
                      console.error('Error updating phone number:', error);
                      this.showModal('Error', 'Failed to update phone number.');
                    }
                  );
                break;

              default:
                console.error('Unknown field:', field);
                break;
            }
          } else {
            this.showModal('Error', 'Incorrect current password.');
          }
        },
        (error) => {
          console.error('Password verification failed:', error);
          this.showModal(
            'Error',
            'An error occurred while verifying your password.'
          );
        }
      );
  }

  private updateLocalStorage(): void {
    localStorage.setItem('currentUser', JSON.stringify(this.user));
  }

  savePasswordChange(): void {
    if (!this.oldPassword) {
      this.showModal('Error', 'Please enter your current password.');
      return;
    }

    if (!this.validateNewPassword()) {
      return;
    }

    this.userService
      .changePassword(this.user.username, this.oldPassword, this.newPassword)
      .subscribe(
        () => {
          this.showModal('Success', 'Password changed successfully.');
          this.cancelPasswordChange();
          this.logout();
        },
        (error) => {
          console.error('Password change failed:', error);
          this.showModal(
            'Error',
            'Failed to change password. Please try again.'
          );
        }
      );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.router.navigate(['/']).then(() => {
      location.reload();
    });
  }

  showModal(title: string, message: string): void {
    this.modalTitle = title;
    this.modalMessage = message;
    this.modalVisible = true;
  }

  closeModal(): void {
    this.modalVisible = false;
  }

  enlargeImage(): void {
    this.isImageModalVisible = true;
  }

  closeImageModal(): void {
    this.isImageModalVisible = false;
    this.selectedImage = null;
    this.router.navigate(['/profile']).then(() => {
      location.reload();
    });
  }

  onImageSelected(event: any): void {
    if (event.target.files && event.target.files[0]) {
      this.selectedImage = event.target.files[0];

      // Create a preview of the selected image
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.photoUrl = e.target.result; // Set the preview URL
      };

      if (this.selectedImage) {
        reader.readAsDataURL(this.selectedImage as Blob);
      }
    }
  }

  saveProfilePicture(): void {
    if (!this.selectedImage) return;

    const formData = new FormData();
    formData.append('photo', this.selectedImage);

    this.userService.uploadProfilePicture(this.user._id, formData).subscribe(
      (response) => {
        this.user.photo = response.photo;
        this.photoUrl = `data:${response.photo.contentType};base64,${response.photo.data}`;
        this.closeImageModal();
        this.updateLocalStorage();
        this.showModal('Success', 'Profile picture updated successfully.');
      },
      (error) => {
        console.error('Error uploading profile picture:', error);
        this.showModal('Error', 'Failed to update profile picture.');
      }
    );
  }
}
