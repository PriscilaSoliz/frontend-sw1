import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private key = 'design';

  saveDesign(design: { html: string, css: string }) {
    localStorage.setItem(this.key, JSON.stringify(design));
  }

  loadDesign(): { html: string, css: string } | null {
    const saved = localStorage.getItem(this.key);
    return saved ? JSON.parse(saved) : null;
  }

  deleteDesign() {
    localStorage.removeItem(this.key);
  }
}
