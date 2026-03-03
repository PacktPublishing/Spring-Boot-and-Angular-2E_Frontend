import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbar } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink, MatToolbar, MatButtonModule, MatIcon],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {}
