import { UserService } from '../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { endOfWeek } from "date-fns"
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
	styleUrls: ['./your-progress.component.css']
})
export class YourProgressComponent implements OnInit {
	public loading: boolean;
	public workoutCounterChart: any;
	public chart: any;
	private workouts: any[];

	private utils: Utils = new Utils();

	constructor(private dialog: MatDialog, private firebase: FirebaseService, private router: Router) {}

	async ngOnInit() {
		this.loading = true;
		this.workouts = await this.firebase.getWorkouts();

		this.createWorkoutCounterChart();

		this.createChart("benchPressChart", "Bench Press");
		this.createChart("deadliftChart", "Deadlift");
		this.createChart("squatChart", "Squat");
		this.loading = false;
	}

	createWorkoutCounterChart() {
		this.workoutCounterChart = new Chart("workoutCounterChart", {
			type: 'bar',
			data: {
				labels: ["1","2","3","4","5","6","7","8"],
				datasets: [
					{
						label: "Number of Workouts per week",
						data: this.utils.pastWeekWourkoutCounter(this.workouts),
						backgroundColor: "#4545BC",
						barThickness: 40,
						borderRadius: 50,
					},
				]
			},
			options: {
				aspectRatio:2.5,
				plugins: {
					tooltip: {enabled: false}
				},
				hover: {mode:null},
				scales: {
					y: {
						ticks: {
							stepSize: 1
						}
					}
				}
			},
		});
	}

	createChart(chartID: string, exerciseName: string) {
		let dates = this.utils.getDatesFor(exerciseName, this.workouts);

		return new Chart(chartID, {
			type: "line",
			data: {
				labels: dates,
				datasets: [
					{
						label: "Progressione del peso: " + exerciseName,
						data: this.utils.getWeigthsFor(exerciseName, dates, this.workouts),
						backgroundColor: "#4545BC",
						tension: 0.3,
						borderColor: "#4545BC",
					}
				]
			},
			options: {
				aspectRatio:2.5,
				plugins: {
					tooltip: {enabled: false}
				},
				hover: {mode:null},
				scales: {
					y: {
						ticks: {
							stepSize: 5
						}
					}
				}
			},
		});
	}

	/* private getDatesFor(exerciseName: string) {
		let workouts = this.sortByDate(this.workouts)
		let dates: string[] = [];

		for (let workout of workouts) {
			for (let exercise of workout.exercises) {
				if (exercise.name == exerciseName) {
					dates.push(workout.date);
				}
			}
		}

		return dates.reverse();
	}

	private getWeigthsFor(exerciseName: string, workoutsDate: string[]) {
		let workouts = this.sortByDate(this.workouts)
		let weigths: string[] = [];

		for (let date of workoutsDate) {
			for (let workout of workouts) {
				if (workout.date == date) {
					for (let exercise of workout.exercises) {
						if (exercise.name == exerciseName) weigths.push(exercise.load)
					}
				}
			}
		}

		return weigths;
	}

	private sortByDate(workouts: any) {
		return workouts.sort((a: any, b: any) => {
			let [day, month, year] = String(a.date).split("/");
			const dateA = +new Date(+year, +month - 1, +day);

			[day, month, year] = String(b.date).split("/");
			const dateB = +new Date(+year, +month - 1, +day);

			return dateB - dateA;
		});
	}

	private createWeeksArray() {
		let today = new Date();
		let lastDayOfThisWeek = endOfWeek(today, {weekStartsOn: 1});

		let weeks: any[] = [];

		for (let i = 1; i <= 8; i++) {
			weeks[i-1] = [];
			if (i == 1) weeks.push(lastDayOfThisWeek);

			for (let j = 0; j < 7; j++) {
				let d =new Date(new Date().setDate(lastDayOfThisWeek.getDate() - (j+(7*(i-1)))))
				weeks[i-1].push(d.toLocaleDateString());
			}
		}

		return weeks;
	}

	private pastWeekWourkoutCounter() {
		let workouts = this.sortByDate(this.workouts)

		let workoutsDate: any[] = [];
		for (let workout of workouts) {
			workoutsDate.push(this.toDate(workout.date).toLocaleString().split(",")[0])
		}
		workoutsDate.reverse();

		let weeks = this.createWeeksArray();
		let counter = new Array(8).fill(0);

		for (let date of workoutsDate)
			for (let i = 0; i < weeks.length; i++)
				if (weeks[i].includes(date)) counter[i]++;

		counter.reverse()

		return counter;
	}

	private toDate(d: string): Date {
		let [day, month, year] = String(d).split("/");
		const date = new Date(+year, +month - 1, +day);

		return date;
	} */

	showStats() {
		this.dialog.open(ExerciseStatsComponent, {width: "100%", height: "85%"});
	}

	goToHome() {
		this.router.navigate(["/home"]);
	}
}
