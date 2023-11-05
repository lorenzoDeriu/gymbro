import { EffectiveExercise } from "./Exercise.model";

export type Workout = {
	name: string;
	date: string;
	exercises: EffectiveExercise[];
}
