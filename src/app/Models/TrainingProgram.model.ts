import { Exercise } from "./Exercise.model";

export type TrainingProgram = {
	name: string;
	session: Session[];
};

export type Session = {
	name: string;
	exercises: Exercise[];
};

export type Set = {
	minimumReps: number;
	maximumReps: number;
	load?: number;
}
