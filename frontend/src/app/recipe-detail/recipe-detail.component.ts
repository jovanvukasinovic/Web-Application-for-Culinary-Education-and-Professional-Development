import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../services/recipe.service';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css'],
})
export class RecipeDetailComponent implements OnInit {
  recipe: any;
  author: any;
  showComments = false;
  editing = false;
  updating = false;
  newComment: string = '';
  newRating: number = 0;
  currentUser = JSON.parse(localStorage.getItem('currentUser')!);
  isFavourite: boolean = false;

  constructor(
    private recipeService: RecipeService,
    private userService: UserService,
    private router: Router
  ) {}

  getLocalTime(utcTime: string): string {
    const localDate = new Date(utcTime);
    return localDate.toLocaleString(); // Ovo prikazuje lokalno vreme
  }

  getUserRating(username: string): number | null {
    const rating = this.recipe.ratings.find(
      (r: any) => r.username === username
    );
    return rating ? rating.rating : null;
  }

  getStarArray(rating: number | null): number[] {
    return Array(5)
      .fill(1)
      .map((_, i) => i + 1); // Niz od 1 do 5
  }

  getStarFillPercentage(): number {
    return (this.recipe.averageRating / 5) * 100;
  }

  loadRecipe(): void {
    const recipeId = JSON.parse(localStorage.getItem('currentRecipe')!)._id;

    this.recipeService.getRecipeById(recipeId).subscribe(
      (data) => {
        this.recipe = data;

        // Provera da li je recept omiljen
        this.isFavourite =
          this.currentUser.favouriteRecepies.includes(recipeId);

        // Dalje logike za komentar i ocenu...
      },
      (error) => {
        console.error('Error fetching recipe:', error);
      }
    );
  }

  ngOnInit(): void {
    if (localStorage.getItem('currentUser')) {
      this.loadRecipe();
      this.showComments = true;
    } else {
      this.showComments = false;
    }

    const recipeId = JSON.parse(localStorage.getItem('currentRecipe')!)._id;

    const userId = JSON.parse(localStorage.getItem('currentRecipe')!).createdBy;
    if (userId) {
      this.userService.getUserById(userId).subscribe(
        (data) => {
          this.author = data;
        },
        (error) => {
          console.error('Error fetching user:', error);
        }
      );
    }

    this.recipeService.getRecipeById(recipeId).subscribe(
      (data) => {
        this.recipe = data;
        this.isFavourite =
          this.currentUser.favouriteRecepies.includes(recipeId);

        // Provera da li korisnik već ima komentar
        const userComment = this.recipe.comments.find(
          (comment: any) => comment.username === this.currentUser.username
        );

        const userRating = this.recipe.ratings.find(
          (rating: any) => rating.username === this.currentUser.username
        );

        if (userComment) {
          this.newComment = userComment.comment; // Proveriti...
        }

        if (userRating) {
          this.newRating = userRating.rating; // Proveriti...
        }

        // Calculate the average rating
        const totalRating = this.recipe.ratings.reduce(
          (sum: number, rating: any) => sum + rating.rating,
          0
        );
        this.recipe.averageRating =
          totalRating / this.recipe.ratings.length || 0;
      },
      (error) => {
        console.error('Error fetching recipe:', error);
      }
    );
  }

  toggleFavourite(): void {
    const userId = this.currentUser._id;
    const recipeId = this.recipe._id;

    this.userService.toggleFavouriteRecipe(userId, recipeId).subscribe(
      (response: any) => {
        this.isFavourite = response.isFavourite;
        this.recipe.favourites = response.favouritesCount;

        // Ažuriraj `currentUser` u localStorage nakon promene omiljenog recepta
        if (this.isFavourite) {
          this.currentUser.favouriteRecepies.push(recipeId);
        } else {
          this.currentUser.favouriteRecepies =
            this.currentUser.favouriteRecepies.filter(
              (id: string) => id !== recipeId
            );
        }
        localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
      },
      (error) => {
        console.error('Error toggling favourite:', error);
      }
    );
  }

  toggleComments() {
    if (localStorage.getItem('currentUser')) {
      this.showComments = !this.showComments;
    } else {
      this.router.navigate(['/login']).then(() => {
        location.reload(); // Automatski osvežava stranicu
      });
    }
  }

  toggleEdit() {
    this.editing = !this.editing;
  }

  hasUserComment(): boolean {
    return this.recipe.comments.some(
      (comment: any) => comment.username === this.currentUser.username
    );
  }

  hasUserRating(): boolean {
    return this.recipe.ratings.some(
      (rating: any) => rating.username === this.currentUser.username
    );
  }

  saveCommentAndRating(isUpdate: boolean) {
    if (!this.newComment && !this.newRating) {
      alert('Please provide a comment or rating.');
      return;
    }

    const data = {
      recipeId: this.recipe._id,
      userId: this.currentUser._id,
      username: this.currentUser.username, // Dodaj `username` ovde
      commentText: this.newComment,
      ratingValue: this.newRating,
    };

    this.recipeService.updateCommentAndRating(data).subscribe(
      (response) => {
        const index = this.recipe.comments.findIndex(
          (comment: any) => comment.userId === this.currentUser._id
        );
        if (index !== -1) {
          this.recipe.comments[index] = {
            ...this.recipe.comments[index],
            commentText: this.newComment,
            ratingValue: this.newRating,
          };
        }
        this.newComment = '';
        this.newRating = 0;

        // Recalculate average rating
        const totalRating = this.recipe.comments.reduce(
          (sum: number, comment: any) => sum + comment.ratingValue,
          0
        );
        this.recipe.averageRating =
          this.recipe.comments.length > 0
            ? totalRating / this.recipe.comments.length
            : 'N/A';

        // Ponovo učitaj stranicu ako je urađeno ažuriranje komentara/ocene
        // Prikaži komentare nakon dodavanja/azuriranja
        const recipeId = JSON.parse(localStorage.getItem('currentRecipe')!)._id;
        this.router.navigate([`/recipe/${recipeId}`]).then(() => {
          location.reload(); // Automatski osvežava stranicu
        });

        if (isUpdate) {
          // TODO: ovde treba nekako da azuriram updatedAt polje komentara, odnosno ocene.. kako bih to mogao?
        }
      },
      (error) => {
        console.error('Error updating comment and rating:', error);
      }
    );
  }

  deleteComment(commentId: string) {
    this.toggleEdit();
    if (confirm('Are you sure you want to delete your comment?')) {
      this.recipeService.deleteComment(this.recipe._id, commentId).subscribe(
        (response) => {
          // Ukloni obrisani komentar iz lokalne kopije recepta
          this.recipe.comments = this.recipe.comments.filter(
            (comment: any) => comment._id !== commentId
          );

          // Ponovo izračunaj prosečnu ocenu ako je potrebno
          const totalRating = this.recipe.ratings.reduce(
            (sum: number, rating: any) => sum + rating.rating,
            0
          );
          this.recipe.averageRating =
            this.recipe.ratings.length > 0
              ? totalRating / this.recipe.ratings.length
              : 'N/A';

          this.showComments = true;
          // Prikaži komentare nakon dodavanja/azuriranja
          const recipeId = JSON.parse(
            localStorage.getItem('currentRecipe')!
          )._id;
          this.router.navigate([`/recipe/${recipeId}`]).then(() => {
            location.reload(); // Automatski osvežava stranicu
          });
        },
        (error) => {
          console.error('Error deleting comment:', error);
        }
      );
    }
  }

  showDeleteModal = false;
  commentToDelete: string | null = null;

  // Metoda za otvaranje modala
  openDeleteModal(commentId: string) {
    this.showDeleteModal = true;
    this.commentToDelete = commentId;
  }

  // Metoda za zatvaranje modala
  closeDeleteModal() {
    this.showDeleteModal = false;
    this.commentToDelete = null;
  }

  // Potvrda brisanja
  confirmDeleteComment() {
    if (this.commentToDelete) {
      this.recipeService
        .deleteComment(this.recipe._id, this.commentToDelete)
        .subscribe(
          (response) => {
            this.recipe.comments = this.recipe.comments.filter(
              (comment: any) => comment._id !== this.commentToDelete
            );
            this.closeDeleteModal();
            const recipeId = JSON.parse(
              localStorage.getItem('currentRecipe')!
            )._id;
            this.router.navigate([`/recipe/${recipeId}`]).then(() => {
              location.reload(); // Automatski osvežava stranicu
            });
          },
          (error) => {
            console.error('Error deleting comment:', error);
            this.closeDeleteModal();
          }
        );
    }
  }
}
