import { Component, OnInit, ViewChild } from "@angular/core";
import { ApiService } from "../service/api.service";
import { ChartDataSets } from "chart.js";
import { Color, Label } from "ng2-charts";
import { AngularFireDatabase } from "@angular/fire/database";
import { environment } from "../../environments/environment";
import { FirebaseApp } from "node_modules/@angular/fire";
import { AngularFireAuth } from "@angular/fire/auth";
import { first, map } from "rxjs/operators";
import firebase from "firebase/app";
import { AnyBuildOptions } from "@ionic/cli";
import { IonSlides } from "@ionic/angular";
import { Router } from "@angular/router";
import { Score } from "scoresaber-api-client";

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
  playerInfo: any;
  scoresInfo: any;
  boolInfos = false;
  pid: string;
  currentid: string = "";
  temp: any = null;
  temp2: string = "";
  error: any;
  cusername: any;
  history: any[];
  historyph: string;
  counter: any;
  counter2: any;
  defaultid: string;
  entries: any;
  myentries: any[] = [];
  bool: boolean;
  version: any = "4.2.0";

  @ViewChild("slides") slides: IonSlides;

  async ngOnInit() {
    this.afAuth.authState.subscribe(async (user) => {
      if (user) {
        this.cusername = user.email;
      }
    });

    await this.getEntries();

    for (let i = 0; i < this.entries.length; i++) {
      //Filter users Items
      if (this.entries[i].Rx == this.cusername) {
        this.myentries.push(this.entries[i]);
      }
    }
  }

  chartData: ChartDataSets[] = [{ data: [], label: "Rank" }];
  chartLabels: Label[];

  constructor(
    private api: ApiService,
    public afAuth: AngularFireAuth,
    public afDB: AngularFireDatabase,
    public router: Router
  ) {
    this.boolInfos = false;
    this.api.getData("76561198280372610").subscribe((res) => {
      this.pid = res.playerInfo.playerId;
      this.playerInfo = res.playerInfo;

      this.api.getBestScores("76561198280372610").subscribe((res) => {
        this.scoresInfo = res.scores;
      });

      this.chartData[0].data = [];
      this.chartLabels = [];
      this.historyph = res.playerInfo.history;
      this.counter = 49;
      this.counter2 = 0;

      this.history = this.historyph.split(",", 50);
      this.history.push(res.playerInfo.rank);
      //console.log(this.history);

      for (let entry of this.history) {
        if (this.counter == 1) {
          this.chartLabels.push("yesterday");
          this.chartData[0].data.push(this.history[this.counter2]);
        } else if (this.counter == 0) {
          this.chartLabels.push("now");
          this.chartData[0].data.push(this.history[this.counter2]);
        } else {
          this.chartLabels.push(this.counter + " days ago");
          this.chartData[0].data.push(this.history[this.counter2]);
        }
        this.counter = this.counter - 1;
        this.counter2 = this.counter2 + 1;
      }
      this.boolInfos = true;
    });
  }

  chartOptions = {
    showLines: true,
    responsive: true,

    scales: {
      yAxes: [
        {
          ticks: {
            reverse: true,
          },
        },
      ],
    },

    zoom: {
      enabled: true,
      mode: "y",
    },
  };

  chartColors: Color[] = [
    {
      borderColor: "#DA7373",
      pointHoverBorderColor: "#43CAA8",
      pointBorderColor: "#DA7373",
      backgroundColor: "",
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
          //console.log("Wrong");
          this.boolInfos = false;
          this.api.getData(this.currentid).subscribe((res) => {
            this.playerInfo = res.playerInfo;
            this.boolInfos = true;
            //console.log("if");
          });
          this.scoresInfo = [];
        } else {
          console.log("Good one");
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

          for (let entry of this.history) {
            if (this.counter == 1) {
              this.chartLabels.push("yesterday");
              this.chartData[0].data.push(this.history[this.counter2]);
            } else if (this.counter == 0) {
              this.chartLabels.push("now");
              this.chartData[0].data.push(this.history[this.counter2]);
            } else {
              this.chartLabels.push(this.counter + " days ago");
              this.chartData[0].data.push(this.history[this.counter2]);
            }
            this.counter = this.counter - 1;
            this.counter2 = this.counter2 + 1;
          }

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
      console.log("EINGABEFELD LEER");
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
        //console.log(this.history);

        for (let entry of this.history) {
          if (this.counter == 1) {
            this.chartLabels.push("yesterday");
            this.chartData[0].data.push(this.history[this.counter2]);
          } else if (this.counter == 0) {
            this.chartLabels.push("now");
            this.chartData[0].data.push(this.history[this.counter2]);
          } else {
            this.chartLabels.push(this.counter + " days ago");
            this.chartData[0].data.push(this.history[this.counter2]);
          }
          this.counter = this.counter - 1;
          this.counter2 = this.counter2 + 1;
        }
        this.boolInfos = true;
      });
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
      //console.log(this.history);

      for (let entry of this.history) {
        if (this.counter == 1) {
          this.chartLabels.push("yesterday");
          this.chartData[0].data.push(this.history[this.counter2]);
        } else if (this.counter == 0) {
          this.chartLabels.push("now");
          this.chartData[0].data.push(this.history[this.counter2]);
        } else {
          this.chartLabels.push(this.counter + " days ago");
          this.chartData[0].data.push(this.history[this.counter2]);
        }
        this.counter = this.counter - 1;
        this.counter2 = this.counter2 + 1;
      }

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

  async logout() {
    await this.afAuth.signOut();
    this.router.navigateByUrl("/");
  }

  async loadEntry(pid: any) {
    await this.apiGetData(pid);

    this.api.getBestScores(pid).subscribe((res) => {
      this.scoresInfo = res.scores;
    });
  }

  swipe() {
    this.slides.slidePrev();
  }

  async deleteItem(itemName) {
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

  recentScores(pid) {
    this.api.getRecentScores(pid).subscribe((res) => {
      this.scoresInfo = res.scores;
      //console.log(this.scoresInfo);
    });
  }

  bestScores(pid) {
    this.api.getBestScores(pid).subscribe((res) => {
      this.scoresInfo = res.scores;
      //console.log(this.scoresInfo);
    });
  }
}
