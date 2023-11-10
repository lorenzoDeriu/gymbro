import { TrainingProgram } from "./TrainingProgram.model";
import { Workout } from "./Workout.model";

export type User = {
	username: string;
	playlistUrl?: string;
	customExercises: string[];
	follow: string[];
	visibility: boolean;
	trainingPrograms: TrainingProgram[];
	workout: Workout[];
	admin?: boolean;
};
