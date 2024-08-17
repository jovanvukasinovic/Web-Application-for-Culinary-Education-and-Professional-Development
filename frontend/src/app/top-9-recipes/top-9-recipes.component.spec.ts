import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Top9RecipesComponent } from './top-9-recipes.component';

describe('Top9RecipesComponent', () => {
  let component: Top9RecipesComponent;
  let fixture: ComponentFixture<Top9RecipesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Top9RecipesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Top9RecipesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
