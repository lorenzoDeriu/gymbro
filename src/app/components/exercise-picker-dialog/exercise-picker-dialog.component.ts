import { UserService } from '../../services/user.service';
import { NgForm } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-exercise-picker-dialog',
  templateUrl: './exercise-picker-dialog.component.html',
  styleUrls: ['./exercise-picker-dialog.component.css']
})
export class ExercisePickerDialogComponent implements OnInit {
	options: any[];

	constructor(private firebase: FirebaseService, private userService: UserService) {}

	async ngOnInit() {
		let uid = JSON.parse(localStorage.getItem("user"))["uid"];

		this.options = (await this.firebase.getExercise(uid)).sort((a:string, b:string) => a.localeCompare(b));
	}

	addNewExercise(form: NgForm) {
		localStorage.setItem("exercise", JSON.stringify({exercise: form.value.exerciseName}))
	}

}