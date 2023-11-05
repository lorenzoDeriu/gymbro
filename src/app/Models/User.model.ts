import { TrainingProgram } from "./TrainingProgram.model";
import { Workout } from "./Workout.model";

export type User = {
	admin?: boolean;
	username: string;
	customExercises: string[];
	follow: string[];
	visibility: boolean;
	trainingPrograms: TrainingProgram[];
	workout: Workout[];
}
