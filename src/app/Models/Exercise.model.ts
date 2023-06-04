export class Exercise {
	public exerciseName: string;
	public series: number;
	public reps: number;
	public load: number;
	public restTime: string;
	public RPE: number;
	public note: string;

	constructor (exerciseName: string, series: number, reps: number, load: number, rpe: number, restTime: string, note: string) {
		this.exerciseName = exerciseName;
		this.series = series;
		this.reps = reps;
		this.load = load;
		this.RPE = rpe;
		this.restTime = restTime;
		this.note = note;
	}
}
