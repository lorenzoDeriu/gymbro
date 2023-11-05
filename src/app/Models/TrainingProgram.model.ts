import { TrainingProgramExercises } from "./Exercise.model";

export type TrainingProgram = {
	name: string;
	session: Session[];
};

export type Session = {
	name: string;
	exercises: TrainingProgramExercises[];
};
