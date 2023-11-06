import { EffectiveExercise } from "./Exercise.model";

export type Workout = {
	name: string;
	date: Date;
	trainingTime: number;
	exercises: EffectiveExercise[];
};
