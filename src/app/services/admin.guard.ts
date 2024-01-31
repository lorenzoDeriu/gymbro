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
import { ThemeService } from "./theme.service";

@Injectable({
	providedIn: "root",
})
export class AdminGuard implements CanActivate {
	public theme: "light" | "dark";

	constructor(
		private firebase: FirebaseService,
		private router: Router,
		private dialog: MatDialog,
		private themeService: ThemeService
	) {}

	async canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	) {
		this.themeService.themeObs.subscribe({
			next: theme => {
				this.theme = theme;
			}
		});
		
		const isAdmin: boolean = await this.firebase.userIsAdmin();


		if (!isAdmin) {
			this.dialog.open(AdminDialogComponent, {
				disableClose: false,
				panelClass: [this.theme === "dark" ? "dark-dialog" : "light-dialog"]
			});

			this.router.navigate(["/home/dashboard"]);

			return false;
		}

		return true;
	}
}
