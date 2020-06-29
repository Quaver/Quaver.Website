import Usergroups from "../enums/Usergroups";
import Privileges from "../enums/Privileges";

export default class UserHelper {

    /**
     * Checks if a user has a specific user group.
     * @param user
     * @param group
     * @constructor
     */
    public static HasGroup(user: any, group: Usergroups): boolean {
        return (group & user.usergroups) != 0;
    }

    /**
     * Checks if a user has a specific privilege.
     * @param user
     * @param privilege
     * @constructor
     */
    public static HasPrivilege(user: any, privilege: Privileges): boolean {
        return (privilege & user.privileges) != 0;
    }

    /**
     * Checks if a user can access dashboard
     * @constructor
     * @param userGroups
     */
    public static CanAccessDashboard(userGroups: any): boolean {
        if ((userGroups & Usergroups.Developer) != 0)
            return true;
        else if ((userGroups & Usergroups.Admin) != 0)
            return true;
        else if ((userGroups & Usergroups.Moderator) != 0)
            return true;
        else if ((userGroups & Usergroups.RankingSupervisor) != 0)
            return true;

        return false;
    }

    /**
     * Checks if a user is donator
     * @constructor
     * @param userGroups
     */
    public static IsDonator(userGroups: any): boolean {
        return (userGroups & Usergroups.Donator) != 0;


    }
}