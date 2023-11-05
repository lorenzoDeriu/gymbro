export interface Exercise {
	name: string;
	intensity: IntensityType;
	rest: RestTime;
	note: string;
}

export type IntensityType = "failure" | "hard" | "light";

export interface TrainingProgramExercises extends Exercise {
	set: Set[];
}

export interface EffectiveExercise extends Exercise {
	set: EffectiveSet[];
}

export type RestTime = {
	minutes: number;
	seconds: number;
};

export type Set = {
	minimumReps: number;
	maximumReps: number;
};

export type EffectiveSet = {
	reps: number;
	load: number;
};

// ---- old class ---- //
// todo: remove //

export class ExerciseClass {
	public exerciseName: string;
	public series: number;
	public reps: number;
	public load: number;
	public restTime?: string;
	public RPE: number;
	public note?: string;
	public range?: [number, number];

	constructor() {
		this.exerciseName = "";
		this.series = 0;
		this.reps = 0;
		this.load = 0;
		this.RPE = 0;
		this.restTime = "";
		this.note = "";
		this.range = [1, 1];
	}
}
