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
}