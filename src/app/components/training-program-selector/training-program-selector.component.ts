import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
	selector: 'app-training-program-selector',
	templateUrl: './training-program-selector.component.html',
	styleUrls: ['./training-program-selector.component.css']
})
export class TrainingProgramSelectorComponent implements OnInit {
	public loading: boolean;

	public trainingPrograms: any[];
	public displayedColumns: string[] = ["Esercizio", "Serie x Ripetizioni", "Recupero", "RPE"]

	constructor(private userService: UserService, private router: Router, private firebase: FirebaseService) { }

	async ngOnInit() {
		this.loading = true;
		this.trainingPrograms = await this.firebase.getTrainingPrograms();
		this.loading = false;
	}

	public selectWorkout(programIndex: number, sessionIndex: number) {
		this.userService.setWorkoutSelected(this.trainingPrograms[programIndex].session[sessionIndex]);
		this.router.navigate(["/home/prebuild-workout"]);
	}

	cancel() {
		this.router.navigate(["/home"]);
	}

}

