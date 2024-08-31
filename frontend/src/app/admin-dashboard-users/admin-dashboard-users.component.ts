import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard-users',
  templateUrl: './admin-dashboard-users.component.html',
  styleUrls: ['./admin-dashboard-users.component.css'],
})
export class AdminDashboardUsersComponent implements OnInit {
  users: any[] = [];
  filteredUsers: any[] = [];
  selectedUser: any | null = null;
  isLoading = true;
  error: string | null = null;
  showDeleteModal = false;
  userToDelete: string | null = null;

  constructor(private router: Router, private userService: UserService) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.isLoading = true;
    this.userService.getAllUsers().subscribe(
      (data: any) => {
        this.users = data;
        this.filteredUsers = data;
        this.isLoading = false;
      },
      (error: any) => {
        this.error = 'Failed to load users.';
        this.isLoading = false;
      }
    );
  }

  onSearch(event: any): void {
    const query = event.target.value.trim().toLowerCase(); // trim() dodato da ukloni praznine
    if (query) {
      this.userService.adminSearchUsers(query).subscribe(
        (data: any) => {
          this.filteredUsers = data;
        },
        (error: any) => {
          this.error = 'Failed to search users.';
        }
      );
    } else {
      this.filteredUsers = this.users; // Ako nema query-ja, prikaži sve korisnike
    }
  }

  activateUser(username: string): void {
    this.userService.activateUser(username).subscribe(
      () => {
        const user = this.users.find((u) => u.username === username);
        if (user) {
          user.status = 'active';
        }
      },
      (error) => {
        this.error = 'Failed to activate user.';
      }
    );
  }

  deactivateUser(username: string): void {
    this.userService.deactivateUser(username).subscribe(
      () => {
        const user = this.users.find((u) => u.username === username);
        if (user) {
          user.status = 'inactive';
        }
      },
      (error) => {
        this.error = 'Failed to deactivate user.';
      }
    );
  }

  openDeleteModal(username: string): void {
    this.showDeleteModal = true;
    this.userToDelete = username;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.userToDelete = null;
  }

  confirmDeleteUser(): void {
    if (this.userToDelete) {
      this.userService.deleteUser(this.userToDelete).subscribe(
        () => {
          this.users = this.users.filter(
            (user) => user.username !== this.userToDelete
          );
          this.filteredUsers = this.filteredUsers.filter(
            (user) => user.username !== this.userToDelete
          );
          this.closeDeleteModal();
        },
        (error) => {
          this.error = 'Failed to delete user.';
          this.closeDeleteModal();
        }
      );
    }
  }

  clearSelection(): void {
    this.selectedUser = null;
  }

  navigateToRegister(): void {
    this.router.navigate(['/register']);
  }
}
