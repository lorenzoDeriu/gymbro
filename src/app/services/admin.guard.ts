import { Injectable } from "@angular/core";
import {
	ActivatedRouteSnapshot,
	CanActivate,
	Router,
	RouterStateSnapshot,
} from "@angular/router";
import { FirebaseService } from "./firebase.service";
import { MatDialog } from "@angular/material/dialog";
import { AdminDialogComponent } from "../components/admin-dialog/admin-dialog.component";

@Injectable({
	providedIn: "root",
})
export class AdminGuard implements CanActivate {
	constructor(
		private firebase: FirebaseService,
		private router: Router,
		private dialog: MatDialog
	) {}

	async canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	) {
		const isAdmin: boolean = await this.firebase.userIsAdmin();

		if (!isAdmin) {
			this.dialog.open(AdminDialogComponent, {
				disableClose: false,
			});

			this.router.navigate(["/home/dashboard"]);

			return false;
		}

		return true;
	}
}
