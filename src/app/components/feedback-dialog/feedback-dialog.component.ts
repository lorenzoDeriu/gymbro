import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
	selector: 'app-feedback-dialog',
	templateUrl: './feedback-dialog.component.html',
	styleUrls: ['./feedback-dialog.component.css'],
})
export class FeedbackDialogComponent {
	constructor(
		private firebase: FirebaseService,
		private snackBar: MatSnackBar
	) {}

	sendFeedback(form: NgForm) {
		let feedback = form.value.feedback;

		this.firebase.addFeedback(feedback);
		this.snackBar.open('Grazie per il tuo Feedback', 'Ok!', {
			duration: 3000,
		});
	}
}
