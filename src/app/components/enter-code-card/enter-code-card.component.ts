import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-enter-code-card',
  templateUrl: './enter-code-card.component.html',
  styleUrls: ['./enter-code-card.component.scss'],
})
export class EnterCodeCardComponent  implements OnInit {
  enteredCode: string = '';
  errorMessage: string = '';

  constructor() { }

  ngOnInit() {}



  viewLocation() {
    this.errorMessage = ''; // Reset error message

    if (!this.enteredCode) {
      this.errorMessage = 'Please enter a code.';
      return;
    }

    if (!this.validateCode(this.enteredCode)) {
      this.errorMessage = 'Invalid code. Please enter a valid code.';
      return;
    }

    console.log('Navigating to view location with code:', this.enteredCode);
    // Add logic to navigate to the location view or display the location
  }

  validateCode(code: string): boolean {
    // Example validation: Check if code is exactly 7 characters long and only contains alphanumeric characters
    const codePattern = /^[A-Za-z0-9]{7}$/;
    return codePattern.test(code);
  }

}
