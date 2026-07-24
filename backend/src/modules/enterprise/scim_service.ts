export interface ScimUserResource {
  schemas: string[];
  id: string;
  userName: string;
  active: boolean;
  name: {
    givenName: string;
    familyName: string;
  };
  emails: Array<{ value: string; primary: boolean }>;
}

export class ScimProvisioningService {
  private users: Map<string, ScimUserResource> = new Map();

  public createUser(resource: Partial<ScimUserResource>): ScimUserResource {
    const id = `scim-${Date.now()}`;
    const user: ScimUserResource = {
      schemas: ['urn:ietf:params:scim:schemas:core:2.0:User'],
      id,
      userName: resource.userName || 'scim.user@company.com',
      active: resource.active ?? true,
      name: resource.name || { givenName: 'Scim', familyName: 'User' },
      emails: resource.emails || [{ value: resource.userName || 'scim.user@company.com', primary: true }],
    };

    this.users.set(id, user);
    return user;
  }

  public deprovisionUser(id: string): boolean {
    const user = this.users.get(id);
    if (!user) return false;

    user.active = false;
    this.users.set(id, user);
    return true;
  }

  public getUser(id: string): ScimUserResource | undefined {
    return this.users.get(id);
  }
}
