import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BecomeAChefComponent } from './become-a-chef.component';

describe('BecomeAChefComponent', () => {
  let component: BecomeAChefComponent;
  let fixture: ComponentFixture<BecomeAChefComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BecomeAChefComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BecomeAChefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
