import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  constructor(private http: HttpClient) {}

  falafel: any;

  getData(pid: string) {
    this.falafel = this.http.get<any>(
      "https://new.scoresaber.com/api/player/" + pid + "/basic"
    );

    return this.falafel;
    
  }



  getBestScores(pid: string) {
    this.falafel = this.http.get<any>(
      "https://new.scoresaber.com/api/player/" + pid + "/scores/top/1" 
    );
    return this.falafel;
  }

  getRecentScores(pid: string) {
    this.falafel = this.http.get<any>(
      "https://new.scoresaber.com/api/player/" + pid + "/scores/recent/1"
    );
    return this.falafel;
  }

  
}
