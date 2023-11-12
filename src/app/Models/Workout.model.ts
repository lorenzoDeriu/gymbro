import { EffectiveExercise } from "./Exercise.model";

export type Workout = {
	name: string;
	date: number;
	trainingTime: number;
	exercises: EffectiveExercise[];
};
