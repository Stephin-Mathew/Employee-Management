import { Component, inject } from '@angular/core';

import { PageHeaderComponent } from '../ui components/page-header/page-header.component';
import { SidebarComponent } from '../ui components/sidebar/sidebar.component';
import { CustomCheckboxComponent } from '../ui components/custom-checkbox/custom-checkbox.component';
import { PermissionName, AuthService } from '../../services/auth.service';
import { SignupDetails } from '../../interfaces/signup.interface';

@Component({
  selector: 'app-access-management',
  standalone: true,
  imports: [PageHeaderComponent, SidebarComponent, CustomCheckboxComponent],
  templateUrl: './access-management.component.html',
  styleUrl: './access-management.component.css',
})
export class AccessManagementComponent {
  private readonly authService = inject(AuthService);

  public readonly permissions: { key: PermissionName; label: string }[] = [
    { key: 'add', label: 'Add' },
    { key: 'edit', label: 'Edit' },
    { key: 'delete', label: 'Delete' },
  ];

  public users: SignupDetails[] = this.authService.getManageableUsers();
  public savedMessage = '';

  public isAllowed(user: SignupDetails, permission: PermissionName): boolean {
    return user.permissions?.[permission] === true;
  }

  public onToggle(
    user: SignupDetails,
    permission: PermissionName,
    allowed: boolean
  ): void {
    this.authService.updatePermissions(user.username, permission, allowed);
    this.users = this.authService.getManageableUsers();
    this.savedMessage = `Saved changes for ${user.username}.`;
  }
}
