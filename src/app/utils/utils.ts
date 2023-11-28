import { Workout } from "../Models/Workout.model";
import { EffectiveExercise, EffectiveSet, Set } from "../Models/Exercise.model";

export interface ExerciseLog {
	exercise: EffectiveExercise;
	date: number;
}

export const formatSets = (sets: Set[]): string[] => {
	const formattedSets: string[] = [];
	const setCountMap: Map<string, number> = new Map();

	for (const set of sets) {
		const key = `${set.minimumReps} - ${set.maximumReps}`;

		setCountMap.set(key, (setCountMap.get(key) || 0) + 1);
	}

	setCountMap.forEach((count, key) => {
		const [minReps, maxReps] = key.split(" - ").map(Number);

		if (minReps === maxReps) {
			formattedSets.push(`${count} x ${minReps}`);
		} else {
			formattedSets.push(`${count} x ${minReps} - ${maxReps}`);
		}
	});

	return formattedSets;
};

export const formatEffectiveSets = (sets: EffectiveSet[]): string[] => {
	const formattedSets: string[] = [];
	const setCountMap: Map<string, number> = new Map();

	for (const set of sets) {
		const key = `${set.reps}@${set.load}Kg`;

		setCountMap.set(key, (setCountMap.get(key) || 0) + 1);
	}

	setCountMap.forEach((count, key) => {
		formattedSets.push(`${count} x ${key}`);
	});

	return formattedSets;
};

export const generateId = (): string => {
	return "group-id-" + Math.random().toString(16).slice(2);
};

export const getDatesFor = (exerciseName: string, workouts: Workout[]) => {
	let sortedWorkout = sortByDate(workouts);
	let dates: Date[] = [];

	for (let workout of sortedWorkout) {
		for (let exercise of workout.exercises) {
			if (exercise.name == exerciseName) {
				dates.push(new Date(workout.date));
			}
		}
	}

	return dates.reverse().slice(Math.max(dates.length - 20, 0));
};

export const sortByDate = (workouts: Workout[]) => {
	if (workouts) {
		return workouts.sort((a: Workout, b: Workout) => {
			return b.date - a.date;
		});
	}

	return [];
};

export const getSessionExerciseFor = (
	exerciseName: string,
	workoutsDate: Date[],
	workouts: Workout[]
): ExerciseLog[] => {
	const sortedWorkouts = sortByDate(workouts);
	const sessionExercises: ExerciseLog[] = [];

	// Get unique dates list
	let workoutsDateSet: Date[] = workoutsDate
		.map(date => {
			return date.getTime();
		}) // Convert to timestamp
		.filter((date, i, array) => {
			return array.indexOf(date) === i; // Remove duplicates
		})
		.map(time => {
			return new Date(time);
		}); // Convert back to date

	for (const date of new Set(workoutsDateSet)) {
		const matchingWorkouts = sortedWorkouts.filter(
			workout => new Date(workout.date).getTime() === date.getTime()
		);

		for (const matchingWorkout of matchingWorkouts) {
			const matchingExercises = matchingWorkout.exercises.filter(
				exercise => exercise.name === exerciseName
			);

			for (const matchingExercise of matchingExercises) {
				sessionExercises.push({
					exercise: matchingExercise,
					date: matchingWorkout.date,
				});
			}
		}
	}

	return sessionExercises;
};

export const convertTimediffToTime = (timeDiff: number): string => {
	return new Date(timeDiff).toISOString().slice(11, 19);
};
