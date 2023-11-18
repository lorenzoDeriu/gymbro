export interface Exercise {
	name: string;
	intensity: IntensityType;
	rest: RestTime;
	note: string;
	groupId: string;
}

export type IntensityType = "failure" | "hard" | "light";

export interface TrainingProgramExercise extends Exercise {
	set: Set[];
}

export interface EffectiveExercise extends Exercise {
	template?: Set[];
	set: EffectiveSet[];
}

export type RestTime = {
	minutes: string;
	seconds: string;
};

export type Set = {
	minimumReps: number;
	maximumReps: number;
};

export type EffectiveSet = {
	reps: number;
	load: number;
};
