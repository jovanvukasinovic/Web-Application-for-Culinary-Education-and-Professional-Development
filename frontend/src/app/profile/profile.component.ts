import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  user: any;
  selectedFile: File | null = null;

  constructor(private router: Router, private userService: UserService) {}

  ngOnInit() {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      this.user = JSON.parse(currentUser);
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFile = input.files[0];
    }
  }

  onSubmit() {
    if (!this.selectedFile) {
      return;
    }

    const formData = new FormData();
    formData.append('photo', this.selectedFile);
    formData.append('userId', this.user._id); // Pretpostavljam da koristite _id za identifikaciju korisnika

    this.userService.uploadProfilePicture(formData).subscribe((response) => {
      console.log(response);
      localStorage.setItem('currentUser', JSON.stringify(response));
      this.user = response;
    });
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

  getProfilePictureUrl() {
    if (this.user && this.user._id) {
      return `http://localhost:4000/api/users/profile-picture/${this.user._id}`;
    }
    return '';
  }
}
