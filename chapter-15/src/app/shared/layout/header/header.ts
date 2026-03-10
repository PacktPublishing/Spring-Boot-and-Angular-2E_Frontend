import { Component, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbar } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { injectDispatch } from '@ngrx/signals/events';
import { authPageEvents } from '../../../features/auth/store/auth.events';
import { AuthStore } from '../../../features/auth/store/auth.store';

@Component({
  selector: 'app-header',
  imports: [RouterLink, MatToolbar, MatButtonModule, MatIcon],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  protected readonly store = inject(AuthStore);
  protected readonly dispatch = injectDispatch(authPageEvents);

  onLogout() {
    this.dispatch.logoutClicked();
  }
}

