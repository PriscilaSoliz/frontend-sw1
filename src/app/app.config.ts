import { ApplicationConfig } from '@angular/core';
import { provideRouter, withHashLocation, withEnabledBlockingInitialNavigation } from '@angular/router';
import { provideHttpClient } from '@angular/common/http'; // 👈 IMPORTANTE
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withHashLocation(),
      withEnabledBlockingInitialNavigation()
    ),
    provideHttpClient()
  ]
};
