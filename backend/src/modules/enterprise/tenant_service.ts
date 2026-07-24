export interface OrganizationNode {
  id: string;
  name: string;
  parentOrgId?: string;
  teams: string[];
}

export class MultiTenantService {
  private orgs: Map<string, OrganizationNode> = new Map();

  public createOrganization(name: string, parentOrgId?: string): OrganizationNode {
    const id = `org-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const org: OrganizationNode = {
      id,
      name,
      parentOrgId,
      teams: [],
    };
    this.orgs.set(id, org);
    return org;
  }

  public addTeamToOrg(orgId: string, teamName: string): boolean {
    const org = this.orgs.get(orgId);
    if (!org) return false;

    org.teams.push(teamName);
    return true;
  }

  public validateTenantIsolation(requestorOrgId: string, resourceOrgId: string): boolean {
    if (requestorOrgId === resourceOrgId) return true;

    // Check parent-child organizational hierarchy
    let current = this.orgs.get(resourceOrgId);
    while (current && current.parentOrgId) {
      if (current.parentOrgId === requestorOrgId) {
        return true;
      }
      current = this.orgs.get(current.parentOrgId);
    }

    return false;
  }
}
