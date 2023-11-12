import { EffectiveExercise } from "./Exercise.model";

export type Workout = {
	name: string;
	date: any;
	trainingTime: number;
	exercises: EffectiveExercise[];
};
