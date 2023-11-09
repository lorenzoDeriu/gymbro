import { EffectiveExercise } from "./Exercise.model";

export type Workout = {
	name: string;
	date: string;
	trainingTime: number;
	exercises: EffectiveExercise[];
};
