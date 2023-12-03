import { Workout } from "../Models/Workout.model";
import { EffectiveExercise, EffectiveSet, Set } from "../Models/Exercise.model";

export interface ExerciseLog {
	exercise: EffectiveExercise;
	date: number;
}

export const formatSets = (sets: Set[]): string[] => {
	const formattedSets: string[] = [];

	let currentMinimumReps = sets[0].minimumReps;
	let currentMaximumReps = sets[0].maximumReps;
	let currentSetCount = 0;

	for (const set of sets) {
		if (
			set.minimumReps === currentMinimumReps &&
			set.maximumReps === currentMaximumReps
		) {
			currentSetCount++;
		} else {
			formattedSets.push(
				`${currentSetCount}x${currentMinimumReps}${
					currentMaximumReps !== currentMinimumReps
						? `-${currentMaximumReps}`
						: ""
				}`
			);

			currentMinimumReps = set.minimumReps;

			currentMaximumReps = set.maximumReps;

			currentSetCount = 1;
		}
	}

	formattedSets.push(
		`${currentSetCount}x${currentMinimumReps}${
			currentMaximumReps !== currentMinimumReps
				? `-${currentMaximumReps}`
				: ""
		}`
	);

	return formattedSets;
};

export const formatEffectiveSets = (sets: EffectiveSet[]): string[] => {
	const formattedSets: string[] = [];

	let currentReps = sets[0]?.reps ?? 0;
	let currentLoad = sets[0]?.load ?? 0;
	let currentSetCount = 0;

	for (const set of sets) {
		if (set.reps === currentReps && set.load === currentLoad) {
			currentSetCount++;
		} else {
			formattedSets.push(
				`${currentSetCount}x${currentReps}@${currentLoad}`
			);

			currentReps = set.reps;

			currentLoad = set.load;

			currentSetCount = 1;
		}
	}

	formattedSets.push(`${currentSetCount}x${currentReps}@${currentLoad}`);

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
