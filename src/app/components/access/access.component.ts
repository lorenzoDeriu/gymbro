import { PasswordRecoverDialogComponent } from "../password-recover-dialog/password-recover-dialog.component";
import { Component, OnInit } from "@angular/core";
import {
	FormControl,
	FormGroupDirective,
	NgForm,
	Validators,
} from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { AuthService } from "src/app/services/auth.service";

export class MyErrorStateMatcher implements ErrorStateMatcher {
	isErrorState(
		control: FormControl | null,
		form: FormGroupDirective | NgForm | null
	): boolean {
		const isSubmitted = form && form.submitted;
		return !!(
			control &&
			control.invalid &&
			(control.dirty || control.touched || isSubmitted)
		);
	}
}

@Component({
	selector: "app-access",
	templateUrl: "./access.component.html",
	styleUrls: ["./access.component.css"],
})
export class AccessComponent implements OnInit {
	public matcher = new MyErrorStateMatcher();
	public hide: boolean = true;

	constructor(
		private authService: AuthService,
		public dialog: MatDialog,
		private router: Router
	) {}

	async ngOnInit() {
		if (this.authService.isAuthenticated())
			this.router.navigate(["/home/dashboard"]);
	}

	onLoginSubmit(form: NgForm) {
		this.authService.signin(form.value.email, form.value.password);
	}

	onRegisterSubmit(form: NgForm) {
		this.authService.signup(form.value.email, form.value.password);
	}

	accessWithGoogle() {
		this.authService.accessWithGoogle();
	}

	forgotPassword() {
		this.dialog.open(PasswordRecoverDialogComponent, {
			width: "300px",
			height: "130px",
		});
	}
}
