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
	template?: Set[];
	set: EffectiveSet[];
	groupId?: string;
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
