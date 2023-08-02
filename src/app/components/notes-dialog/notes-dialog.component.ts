import { Component, Inject, Input, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";

@Component({
	selector: "app-notes-dialog",
	templateUrl: "./notes-dialog.component.html",
	styleUrls: ["./notes-dialog.component.css"],
})
export class NotesDialogComponent implements OnInit {
	notes: string;
	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		public dialogRef: MatDialogRef<NotesDialogComponent>
	) {}

	ngOnInit() {
		this.notes = this.data.notes;
	}
}
