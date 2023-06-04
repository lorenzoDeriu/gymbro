import { endOfWeek } from "date-fns";

export class Utils {

	getSessionExerciseFor(exerciseName: string, workoutsDate: string[], workouts: any) {
		let sortedWorkout = this.sortByDate(workouts)
		let sessionExercise: any[] = [];

		for (let date of workoutsDate) {
			for (let workout of sortedWorkout) {
				if (workout.date == date) {
					for (let exercise of workout.exercises) {
						if (exercise.name == exerciseName) sessionExercise.push({exercise: exercise, date: workout.date})
					}
				}
			}
		}

		return sessionExercise;
	}

	getWeigthsFor(exerciseName: string, workoutsDate: string[], workouts: any) {
		let sortedWorkout = this.sortByDate(workouts)
		let weigths: string[] = [];

		for (let date of workoutsDate) {
			for (let workout of sortedWorkout) {
				if (workout.date == date) {
					for (let exercise of workout.exercises) {
						if (exercise.name == exerciseName) weigths.push(exercise.load)
					}
				}
			}
		}

		return weigths;
	}

	sortByDate(workouts: any) {
		return workouts.sort((a: any, b: any) => {
			let [day, month, year] = String(a.date).split("/");
			const dateA = +new Date(+year, +month - 1, +day);

			[day, month, year] = String(b.date).split("/");
			const dateB = +new Date(+year, +month - 1, +day);

			return dateB - dateA;
		});
	}

	getDatesFor(exerciseName: string, workouts: any) {
		let sortedWorkout = this.sortByDate(workouts);
		let dates: string[] = [];

		for (let workout of sortedWorkout) {
			for (let exercise of workout.exercises) {
				if (exercise.name == exerciseName) {
					dates.push(workout.date);
				}
			}
		}

		return dates.reverse();
	}

	createWeeksArray() {
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

	pastWeekWourkoutCounter(workouts: any[]) {
		let sortedWorkouts = this.sortByDate(workouts)

		let workoutsDate: any[] = [];
		for (let workout of sortedWorkouts) {
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
	}
}
