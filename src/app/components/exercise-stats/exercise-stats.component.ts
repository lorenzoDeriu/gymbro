import { FirebaseService } from "src/app/services/firebase.service";
import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Chart } from "chart.js";
import { Workout } from "src/app/Models/Workout.model";
import { ThemeService } from "src/app/services/theme.service";

@Component({
	selector: "app-exercise-stats",
	templateUrl: "./exercise-stats.component.html",
	styleUrls: ["./exercise-stats.component.css"],
})
export class ExerciseStatsComponent implements OnInit {
	public theme: "light" | "dark";
	private workouts: Workout[];
	private chart: any;

	public options: string[];

	constructor(private firebase: FirebaseService, private themeService: ThemeService) {}

	async ngOnInit() {
		this.options = await this.firebase.getExercise();

		this.themeService.themeObs.subscribe((theme) => {
			this.theme = theme;
		});
	}

	async showStas(form: NgForm) {
		if (this.chart) this.chart.destroy();

		this.workouts = await this.firebase.getWorkouts();

		let exercise = form.value.exerciseName;
		let dates = await this.getDatesFor(exercise);

		this.chart = new Chart("chart", {
			type: "line",
			data: {
				labels: dates,
				datasets: [
					{
						label: "Carico utilizzato: " + exercise,
						data: this.getWeigthsFor(exercise, dates),
						fill: false,
						borderColor: "#4545BC",
						tension: 0.1,
						yAxisID: "y",
					},
					{
						label: "Volume totale: " + exercise,
						data: this.getVolumesFor(exercise, dates),
						fill: false,
						borderColor: "#FF0000",
						tension: 0.1,
						yAxisID: "y1",
					},
				],
			},
			options: {
				aspectRatio: window.innerWidth < 500 ? 1.5 : 2,
				responsive: true,
				maintainAspectRatio: true,
				plugins: {
					tooltip: { enabled: false },
				},
				hover: { mode: null },
				scales: {
					y: {
						ticks: {
							stepSize: 1,
							color: "#4545BC",
						},
					},
					y1: {
						ticks: {
							stepSize: 1,
							color: "#FF0000",
						},
						position: "right",
						grid: {
							drawOnChartArea: false,
						},
					},
				},
			},
		});
	}

	private getWeigthsFor(exerciseName: string, workoutsDate: string[]) {
		let workouts = this.sortByDate(this.workouts);
		let weigths: string[] = [];

		for (let date of workoutsDate) {
			for (let workout of workouts) {
				if (workout.date == date) {
					for (let exercise of workout.exercises) {
						if (exercise.name == exerciseName)
							weigths.push(exercise.load);
					}
				}
			}
		}

		return weigths;
	}

	getVolumesFor(exerciseName: string, workoutsDate: string[]) {
		let workouts = this.sortByDate(this.workouts);
		let volumes: string[] = [];

		for (let date of workoutsDate) {
			for (let workout of workouts) {
				if (workout.date == date) {
					for (let exercise of workout.exercises) {
						if (exercise.name == exerciseName)
							volumes.push(
								(
									exercise.load *
									exercise.reps *
									exercise.series
								).toString()
							);
					}
				}
			}
		}

		return volumes;
	}

	private async getDatesFor(exerciseName: string) {
		let workouts = this.sortByDate(this.workouts);
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

	private sortByDate(workouts: any) {
		return workouts.sort((a: any, b: any) => {
			let [day, month, year] = String(a.date).split("/");
			const dateA = +new Date(+year, +month - 1, +day);

			[day, month, year] = String(b.date).split("/");
			const dateB = +new Date(+year, +month - 1, +day);

			return dateB - dateA;
		});
	}
}
