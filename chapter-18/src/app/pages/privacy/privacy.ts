import { Component } from '@angular/core';
@Component({
  selector: 'app-privacy',
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>Privacy Policy</h1>
        <p>How we collect, use, and protect your information.</p>
      </div>

      <section aria-label="Privacy policy details" class="legal-content">
        <p>
          Packt Bookstore collects only the information necessary to process your account. We do not
          sell or share your personal data with third parties. All communication between your
          browser and our servers is encrypted using TLS.
        </p>
        <p>
          You may request deletion of your account and associated data at any time by contacting our
          support team.
        </p>
      </section>
    </div>
  `,
})
export class Privacy {}
