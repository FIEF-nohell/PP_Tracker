import { Component, OnInit, ViewChild } from "@angular/core";
import { ApiService } from "../service/api.service";
import { ChartDataSets } from "chart.js";
import { Color, Label } from "ng2-charts";
import { AngularFireDatabase } from "@angular/fire/database";
import { AngularFireAuth } from "@angular/fire/auth";
import { first, map } from "rxjs/operators";
import { IonSlides } from "@ionic/angular";
import { Router } from "@angular/router";
import { environment } from "../../environments/environment";
import { FirebaseApp } from "node_modules/@angular/fire";
import firebase from "firebase/app";
import { AnyBuildOptions } from "@ionic/cli";

interface Task {
  Name: any;
  ID: any;
  Rx: any;
}

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage implements OnInit {
  //PLAYER INFOS
  playerInfo: any;
  scoresInfo: any;
  boolInfos = false;
  pid: string;
  temp_id: string;
  currentid: string = "";
  favid: string = "";
  cusername: any;
  favs: any;
  //GRAPH STUFF
  history: any[];
  historyph: string;
  counter: any;
  counter2: any;
  entries: any;
  myentries: any[] = [];
  //OTHERS
  bool: boolean;
  version: any = "4.3.0";

  @ViewChild("slides") slides: IonSlides;

  async ngOnInit() {
    this.afAuth.authState.subscribe(async (user) => {
      if (user) {
        this.cusername = user.email;
      }
    });

    await this.getEntries();

    for (let i = 0; i < this.entries.length; i++) {
      //FILTER USER ENTRIES
      if (this.entries[i].Rx == this.cusername) {
        this.myentries.push(this.entries[i]);
      }
    }

    await this.getFav();

  }

  chartData: ChartDataSets[] = [{ data: [], label: "Rank" }];
  chartLabels: Label[];

  constructor( private api: ApiService, public afAuth: AngularFireAuth, public afDB: AngularFireDatabase, public router: Router){

  }

  chartOptions = {
    showLines: true,
    responsive: true,     
    
    scales: {
      xAxes: [{
        gridLines: {
            display:false
        }
    }],
      yAxes: [
        {
          gridLines: {
            display:false
        },
          ticks: {
            reverse: true,
          },
        },
      ],
    },
    zoom: {
      enabled: false
    },
  };

  chartColors: Color[] = [
    {
      borderColor: "#DA7373",
      pointHoverBorderColor: "#43CAA8",
      pointBorderColor: "#DA7373",
      backgroundColor: "transparent",
    },
  ]; 

  chartType = "line";
  showLegend = false;

  async penisklatsche(pid: any) {
    if (!!this.pid) {
      this.playerInfo = "";
      this.boolInfos = true;

      this.api.getData(pid).subscribe(async (res) => {
        if (res.playerInfo.playerId != pid) {
          this.boolInfos = false;
          this.api.getData(this.currentid).subscribe((res) => {
            this.playerInfo = res.playerInfo;
            this.boolInfos = true;
          });
          this.scoresInfo = [];

        } else {
          //Api Call Alright
          this.playerInfo = res.playerInfo;
          this.currentid = this.pid;

          this.chartData[0].data = [];
          this.chartLabels = [];
          this.historyph = res.playerInfo.history;
          this.counter = 49;
          this.counter2 = 0;

          this.history = this.historyph.split(",", 50);
          this.history.push(res.playerInfo.rank);
          //console.log(this.history);

          this.fillChart(this.history);
          this.bool = false;
          await this.getEntries();
          for (let i = 0; i < this.entries.length; i++) {
            //console.log(i);
            if (this.entries[i].Rx == this.cusername) {
              if (this.currentid == this.entries[i].ID) {
                //console.log("bool = true");
                this.bool = true;
                i = this.entries.length;
              }
            }
          }

          if (this.bool != true) {
            this.addEntryToFirebase(this.playerInfo); //Senden an Firebase

            this.entries = [];
            this.myentries = [];
            await this.getEntries();

            for (let i = 0; i < this.entries.length; i++) {
              if (this.entries[i].Rx == this.cusername) {
                this.myentries.push(this.entries[i]);
              }
            }
          } else {
            this.bool = false;
          }

          this.api.getBestScores(pid).subscribe((res) => {
            this.scoresInfo = res.scores;
            console.log(this.scoresInfo);
          });

          this.boolInfos = true;
        }
      });
    } else {
      //EINGABEFELD LEER
      this.boolInfos = false;
      this.api.getData(this.currentid).subscribe((res) => {
        this.playerInfo = res.playerInfo;
        this.chartData[0].data = [];
        this.chartLabels = [];
        this.historyph = res.playerInfo.history;
        this.counter = 49;
        this.counter2 = 0;

        this.history = this.historyph.split(",", 50);
        this.history.push(res.playerInfo.rank);

        this.fillChart(this.history);
        this.boolInfos = true;   
      });
    }
  }

  async fillChart(history){
    //FILL CHART
    for (let entry of history) {
      if (this.counter == 1) {
        this.chartLabels.push("yest");
        this.chartData[0].data.push(this.history[this.counter2]);
      } else if (this.counter == 0) {
        this.chartLabels.push("now");
        this.chartData[0].data.push(this.history[this.counter2]);
      } else {
        this.chartLabels.push(this.counter + " days");
        this.chartData[0].data.push(this.history[this.counter2]);
      }
      this.counter = this.counter - 1;
      this.counter2 = this.counter2 + 1;
    } 
  }

  async apiGetData(pid: any) {
    this.playerInfo = "";
    this.boolInfos = true;
    this.api.getData(pid).subscribe(async (res) => {
      this.boolInfos = false;
      this.playerInfo = res.playerInfo;
      this.boolInfos = true;

      this.currentid = pid;

      this.playerInfo = res.playerInfo;
      this.chartData[0].data = [];
      this.chartLabels = [];
      this.historyph = res.playerInfo.history;
      this.counter = 49;
      this.counter2 = 0;

      this.history = this.historyph.split(",", 50);
      this.history.push(res.playerInfo.rank);
      
      await this.fillChart(this.history);

      this.pid = pid;
    });
  }
 
  addEntryToFirebase(obj: any) {
    this.afDB.list("Players/").push({
      Name: obj.playerName,
      ID: obj.playerId,
      Rx: this.cusername,
    });
  }

  async addFavToFirebase() {
    await this.getFavForUpdate();
    this.afDB.list("Favs/").push({
      Name: this.playerInfo.playerName,
      ID: this.pid,
      Rx: this.cusername,
    });
  }

  async firebaseGeneralizedGetOnceWithId<type>(path: string): Promise<type[]> {
    //Firebase Auslesen
    return this.afDB
      .list<type>(path)
      .snapshotChanges()
      .pipe(
        map((changes) =>
          changes.map((c) => ({ key: c.payload.key, ...c.payload.val() }))
        ),
        first()
      )
      .toPromise();
  }

  async getEntries(): Promise<void> {
    //Firebase Auslesen Aufrufen
    this.entries = await this.firebaseGeneralizedGetOnceWithId<Task>("Players");
  }

  async getFavForUpdate(): Promise<void> {
    //Firebase Auslesen Aufrufen
    this.favs = await this.firebaseGeneralizedGetOnceWithId<Task>("Favs");

    for (let i = 0; i < this.favs.length; i++) {
      //FILTER FAVS
      if (this.favs[i].Rx == this.cusername) {
        await this.deleteFav(this.favs[i]);
        break;
      }      
    }
  }

  async getFav(): Promise<void> {
    //Firebase Auslesen Aufrufen
    this.favs = await this.firebaseGeneralizedGetOnceWithId<Task>("Favs");

    for (let i = 0; i < this.favs.length; i++) {
      //FILTER FAVS
      if (this.favs[i].Rx == this.cusername) {
        this.favid = null;
        this.favid = this.favs[i].ID;
        break;
      }
      else this.favid = "76561198280372610";
    }

    await this.apiGetData(this.favid);

    this.bestScores(this.favid);

  }

  async logout() {
    await this.afAuth.signOut();
    this.router.navigateByUrl("/");
  }

  async loadEntry(pid: any) {
    //LOAD PLAYER AS CURRENTLY CHOSEN
    await this.apiGetData(pid);
    this.api.getBestScores(pid).subscribe((res) => {
      this.scoresInfo = res.scores;
    });
  }

  swipe() {this.slides.slidePrev();}
 
  async deleteItem(itemName) {
    //DELETE CERTAIN PLAYER FROM PLAYER LIST
    await this.afDB.list("Players/").remove(itemName.key);
    this.entries = [];
    this.myentries = [];
    await this.getEntries();

    for (let i = 0; i < this.entries.length; i++) {
      if (this.entries[i].Rx == this.cusername) {
        this.myentries.push(this.entries[i]);
      }
    }
  }

  async deleteFav(itemName) {
    //DELETE CERTAIN PLAYER FROM PLAYER LIST
    await this.afDB.list("Favs/").remove(itemName.key);
  }

  recentScores(pid) {
    //SORT FOR RECENT SCORES
    this.api.getRecentScores(pid).subscribe((res) => {
      this.scoresInfo = res.scores;
    });
  }

  bestScores(pid) {
    //SORT FOR BEST SCORES
    this.api.getBestScores(pid).subscribe((res) => {
      this.scoresInfo = res.scores;
    });
  }
}
