import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';

export interface TrainingProgram {
	name: string;
	session: any[];
}

@Component({
	selector: 'app-training-program-builder',
	templateUrl: './training-program-builder.component.html',
	styleUrls: ['./training-program-builder.component.css'],
})
export class TrainingProgramBuilderComponent implements OnInit {
	trainingProgramName: string = '';
	trainingProgram: TrainingProgram = {
		name: '',
		session: [],
	};

	displayedColumns: string[] = [
		'Esercizio',
		'Serie x Ripetizioni',
		'Recupero',
		'RPE',
	];

	constructor(
		private router: Router,
		private userService: UserService,
		private firebase: FirebaseService
	) {}

	async ngOnInit() {
		this.trainingProgram.session =
			await this.userService.getTrainingProgram();
	}

	onCancel() {
		this.router.navigate(['/home/training-programs']);
	}

	onNewSessionBuild() {
		this.router.navigate(['/home/session-builder']);
	}

	async removeElement(index: number) {
		this.userService.removeSessionFromTrianingProgram(index);
		this.trainingProgram.session =
			await this.userService.getTrainingProgram();
	}

	async onSaveTrainingProgram() {
		this.trainingProgram.name = this.trainingProgramName;

		await this.firebase.addTrainingProgram(this.trainingProgram);
		this.router.navigate(['/home/training-programs']);
	}
}
