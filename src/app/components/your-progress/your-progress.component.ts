import { UserService } from '../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { endOfWeek } from 'date-fns';
import { Chart, registerables } from 'chart.js';
import { MatDialog } from '@angular/material/dialog';
import { ExerciseStatsComponent } from '../exercise-stats/exercise-stats.component';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Router } from '@angular/router';
import { Utils } from 'src/app/utils/utils';
Chart.register(...registerables);

@Component({
	selector: 'app-your-progress',
	templateUrl: './your-progress.component.html',
	styleUrls: ['./your-progress.component.css'],
})
export class YourProgressComponent implements OnInit {
	public loading: boolean;
	public workoutCounterChart: any;
	public chart: any;
	private workouts: any[];

	private utils: Utils = new Utils();

	constructor(
		private dialog: MatDialog,
		private firebase: FirebaseService,
		private router: Router
	) {}

	async ngOnInit() {
		this.loading = true;
		this.workouts = await this.firebase.getWorkouts();

		this.createWorkoutCounterChart();

		this.createChart('benchPressChart', 'Bench Press');
		this.createChart('deadliftChart', 'Deadlift');
		this.createChart('squatChart', 'Squat');
		this.loading = false;
	}

	createWorkoutCounterChart() {
		this.workoutCounterChart = new Chart('workoutCounterChart', {
			type: 'bar',
			data: {
				labels: ['1', '2', '3', '4', '5', '6', '7', '8'],
				datasets: [
					{
						label: 'Number of Workouts per week',
						data: this.utils.pastWeekWourkoutCounter(this.workouts),
						backgroundColor: '#4545BC',
						barThickness: 40,
						borderRadius: 50,
					},
				],
			},
			options: {
				aspectRatio: 2.5,
				plugins: {
					tooltip: { enabled: false },
				},
				hover: { mode: null },
				scales: {
					y: {
						ticks: {
							stepSize: 1,
						},
					},
				},
			},
		});
	}

	createChart(chartID: string, exerciseName: string) {
		let dates = this.utils.getDatesFor(exerciseName, this.workouts);

		return new Chart(chartID, {
			type: 'line',
			data: {
				labels: dates,
				datasets: [
					{
						label: 'Progressione del peso: ' + exerciseName,
						data: this.utils.getWeightsFor(
							exerciseName,
							dates,
							this.workouts
						),
						backgroundColor: '#4545BC',
						tension: 0.3,
						borderColor: '#4545BC',
					},
				],
			},
			options: {
				aspectRatio: 2.5,
				plugins: {
					tooltip: { enabled: false },
				},
				hover: { mode: null },
				scales: {
					y: {
						ticks: {
							stepSize: 5,
						},
					},
				},
			},
		});
	}

	showStats() {
		this.dialog.open(ExerciseStatsComponent, {
			width: '100%',
			height: '85%',
		});
	}

	goToHome() {
		this.router.navigate(['/home']);
	}
}
