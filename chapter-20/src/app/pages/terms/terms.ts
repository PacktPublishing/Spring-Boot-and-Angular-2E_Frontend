import { Component } from '@angular/core';
@Component({
  selector: 'app-terms',
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Terms of Service</h1>
        <p>The rules for using Packt Bookstore.</p>
      </div>

      <section aria-label="Terms details" class="legal-content">
        <p>
          By using Packt Bookstore, you agree to these terms. Accounts are for personal use only.
          You are responsible for maintaining the confidentiality of your login credentials.
        </p>
        <p>
          All book listings, descriptions, and prices are provided for demonstration purposes. Packt
          Publishing reserves the right to modify these terms at any time.
        </p>
      </section>
    </div>
  `,
})
export class Terms {}
