import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { CoachService } from 'src/app/services/coach/coach.service';
import { CoursService } from 'src/app/services/cours/cours.service';

@Component({
  selector: 'app-coach-profile',
  templateUrl: './coach-profile.page.html',
  styleUrls: ['./coach-profile.page.scss'],
})
export class CoachProfilePage implements OnInit {

  public coach: any;
  public courses: any[] = [];
  public validity:number = 7;

  public questionSlides = {
    initialSlide: 0,
    direction: 'horizontal',
    speed: 300,
    // spaceBetween: 8,
    // loop:true,
    slidesPerView: 1,
  };
  
  constructor(private route: ActivatedRoute, public navCtrl: NavController, 
    private coursService: CoursService, private coachService: CoachService) { 

  }
  public getListCoursExos(event = null, vider: boolean = false){
    let offset: number = event != null ? this.courses.length : 0

    this.coursService.getListCoachingFree("", this.coach.id, offset).then((data)=>{
      try {
        let j = data?.data ? data.data : data;
        const json = typeof(j) === "string" ? JSON.parse(j) : j;
        console.log({exo:json});
        
        if(json.status == "ok"){
          if(vider)
            this.courses = [];
          this.courses = [...this.courses,...json.data];
        }
      } catch (error) {
        console.error(error);
        console.log(data.data);
      }
    }, (error) => {
      console.log("error on loading courses...");
      console.error(error);
      
    }).finally(()=>{
      if(event != null)
      event.target.complete()

    });
  }
  ngOnInit() {
    this.route.queryParams.forEach((dat) => {
      this.coach = dat;
      this.getListCoursExos();
      this.coachService.getList(0, {id:this.coach.id}).then((d) => {
        let data = d.data || d;
        let json = typeof(data) == "string" ? JSON.parse(data) : data;
        
        this.coach = json.data[0];
        console.log(this.coach);
        
      })
    })
  }

}
