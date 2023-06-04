  import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-new-workout',
	templateUrl: './new-workout.component.html',
	styleUrls: ['./new-workout.component.css']
})
export class NewWorkoutComponent implements OnInit {

	constructor (private router: Router) {}

	ngOnInit() {}

	navigate(path: string) {
		this.router.navigate([path])
	}
}
