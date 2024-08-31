import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDashboardRecipesComponent } from './admin-dashboard-recipes.component';

describe('AdminDashboardRecipesComponent', () => {
  let component: AdminDashboardRecipesComponent;
  let fixture: ComponentFixture<AdminDashboardRecipesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminDashboardRecipesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminDashboardRecipesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
