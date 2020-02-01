enum Usergroups {
    Normal = 1 << 0,
    Admin = 1 << 1,
    Bot = 1 << 2,
    Developer = 1 << 3,
    Moderator = 1 << 4,
    RankingSupervisor = 1 << 5,
    Swan = 1 << 6,
    Contributor = 1 << 7,
    Donator = 1 << 8
}
export default Usergroups;