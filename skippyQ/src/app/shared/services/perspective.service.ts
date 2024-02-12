import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PerspectiveService {
  private apiKey = 'AIzaSyByCeQ-F97u1eMsDSDNt3bPFx-aJV-DGTk'; // Replace with your API key
  private apiUrl = 'https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze';

  constructor(private http: HttpClient) {}

  analyzeComment(comment: string): Observable<any> {
    const body = {
      comment: {
        text: comment
      },
      languages: ["en"],
      requestedAttributes: {
        TOXICITY: {}
      }
    };

    return this.http.post(`${this.apiUrl}?key=${this.apiKey}`, body);
  }
}
