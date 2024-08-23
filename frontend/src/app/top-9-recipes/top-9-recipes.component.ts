import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-top-9-recipes',
  templateUrl: './top-9-recipes.component.html',
  styleUrl: './top-9-recipes.component.css',
})
export class Top9RecipesComponent implements OnInit {
  author: any;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    const userId = JSON.parse(localStorage.getItem('currentUser')!)?._id;
    console.log(userId);
    if (userId) {
      this.userService.getUserByIdPost(userId).subscribe(
        (data) => {
          this.author = data;
        },
        (error) => {
          console.error('Error fetching user:', error);
        }
      );
    } else {
      console.error('User ID not found in localStorage');
    }
    console.log(this.author);
  }
}
