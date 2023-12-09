export interface AvailableExercise {
	id: string;
	name: string;
	bodyPart: BodyPart;
}

export type BodyPart = "Biceps" | "Triceps" | "Chest" | "Back" | "Quads" | "Hamstrings" | "Delts" | "Glutes" | "Calves" | "Abs";
