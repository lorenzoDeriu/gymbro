export class Exercise {
	public exerciseName: string;
	public series: number;
	public reps: number;
	public load: number;
	public restTime?: string;
	public RPE: number;
	public note?: string;
	public range?: [number, number];

	// constructor (exerciseName: string, series: number, reps: number, load: number, rpe: number, restTime: string, note: string, range?: [number, number]) {
	// 	this.exerciseName = exerciseName;
	// 	this.series = series;
	// 	this.reps = reps;
	// 	this.load = load;
	// 	this.RPE = rpe;
	// 	this.restTime = restTime;
	// 	this.note = note;
	// }

	constructor() {
		this.exerciseName = "";
		this.series = 0;
		this.reps = 0;
		this.load = 0;
		this.RPE = 0;
		this.restTime = "";
		this.note = "";
		this.range = [1, 1];
	}
}
