import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AuthGuard } from './guards/auth.guard';
import { EditorComponent } from './editor/editor.component';
import { CrearSalaComponent } from './components/crear-sala/crear-sala.component';
import { ChatGeminiComponent } from './components/chat-gemini/chat-gemini.component';
import { SqlGenerateComponent } from './components/sql-generate/sql-generate.component';
import { MiComponenteComponent } from './components/nuevo/mi-componente.component';

export const routes: Routes = [
    { path: 'nuevo', component: MiComponenteComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'crear-sala', component: CrearSalaComponent },
    { path: 'editor/:id', component: EditorComponent }, 
    { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
    { path: 'editor', component: EditorComponent, canActivate: [AuthGuard] },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'gemini', component: ChatGeminiComponent },
    { path: 'sql', component: SqlGenerateComponent },
];
