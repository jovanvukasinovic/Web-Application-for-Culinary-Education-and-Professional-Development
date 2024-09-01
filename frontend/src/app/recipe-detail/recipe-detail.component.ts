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
  recipeAuthor: boolean = false;
  showDeleteRecipeModal = false;

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

  // Nova metoda za formatiranje opisa
  formatDescription(description: string): string {
    return description.replace(/\n/g, '<br/>');
  }

  ngOnInit(): void {
    const currentUserData = localStorage.getItem('currentUser');
    this.currentUser = currentUserData ? JSON.parse(currentUserData) : null;

    const recipeId = JSON.parse(localStorage.getItem('currentRecipe')!)._id;
    const authorId = JSON.parse(
      localStorage.getItem('currentRecipe')!
    ).createdBy;

    this.recipeService.getRecipeById(recipeId).subscribe(
      (data) => {
        this.recipe = data;
        if (this.currentUser) {
          this.isFavourite =
            this.currentUser.favouriteRecepies.includes(recipeId);
          this.showComments = true;
        } else {
          this.isFavourite = false; // Ako nema korisnika, postavi srce kao crveno
        }

        // Calculate the average rating
        const totalRating = this.recipe.ratings.reduce(
          (sum: number, rating: any) => sum + rating.rating,
          0
        );
        this.recipe.averageRating =
          this.recipe.ratings.length > 0
            ? totalRating / this.recipe.ratings.length
            : 0; // ili 0, ako nema ocena

        if (this.recipe.createdBy === this.currentUser._id) {
          this.recipeAuthor = true;
        }
      },
      (error) => {
        console.error('Error fetching recipe:', error);
      }
    );

    if (authorId) {
      // TODO: Vratiti sa get metodom, a ne post!
      this.userService.getUserByIdPost(authorId).subscribe(
        (data) => {
          this.author = data;
        },
        (error) => {
          console.error('Error fetching user:', error);
        }
      );
    }
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
    if (this.editing) {
      this.getUserCommentAndRating();
    } else {
      this.newComment = '';
      this.newRating = 0;
    }
  }

  showDeleteButton(): boolean {
    return !this.editing && this.hasUserComment();
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
    if (!this.newComment || !this.newRating) {
      alert('Please provide both a comment and a rating.');
      return;
    }

    const data = {
      recipeId: this.recipe._id,
      userId: this.currentUser._id,
      username: this.currentUser.username,
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

  deleteComment() {
    this.toggleEdit();
    if (confirm('Are you sure you want to delete your comment?')) {
      const data = {
        recipeId: this.recipe._id,
        username: this.currentUser.username,
      };
      this.recipeService.deleteComment(data).subscribe(
        (response) => {
          // Ukloni obrisani komentar iz lokalne kopije recepta
          // this.recipe.comments = this.recipe.comments.filter(
          //   (comment: any) => comment._id !== commentId
          // );

          // Ponovo izračunaj prosečnu ocenu ako je potrebno
          const totalRating = this.recipe.ratings.reduce(
            (sum: number, rating: any) => sum + rating.rating,
            0
          );
          this.recipe.averageRating =
            this.recipe.ratings.length > 0
              ? totalRating / this.recipe.ratings.length
              : 'N/A';

          // Prikaži komentare nakon dodavanja/azuriranja
          this.showComments = true;
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
      const data = {
        recipeId: this.recipe._id,
        username: this.currentUser.username,
      };

      // console.log('Podaci koje šaljem:', data);

      this.recipeService.deleteComment(data).subscribe(
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

  getUserCommentAndRating(): void {
    const userComment = this.recipe.comments.find(
      (comment: any) => comment.username === this.currentUser.username
    );
    const userRating = this.recipe.ratings.find(
      (rating: any) => rating.username === this.currentUser.username
    );

    if (userComment) {
      this.newComment = userComment.comment;
    }
    if (userRating) {
      this.newRating = userRating.rating;
    }
  }

  // Metoda za otvaranje modala za brisanje recepta
  openDeleteRecipeModal() {
    this.showDeleteRecipeModal = true;
  }

  // Metoda za zatvaranje modala za brisanje recepta
  closeDeleteRecipeModal() {
    this.showDeleteRecipeModal = false;
  }

  // Metoda za potvrdu brisanja recepta
  confirmDeleteRecipe() {
    this.recipeService.deleteRecipeById(this.recipe._id).subscribe(
      (response) => {
        alert('Recipe successfully deleted.');
        this.closeDeleteRecipeModal();
        this.router.navigate(['/']); // Preusmerava na početnu stranicu nakon brisanja recepta
      },
      (error) => {
        console.error('Error deleting recipe:', error);
        alert('An error occurred while deleting the recipe. Please try again.');
      }
    );
  }
}
