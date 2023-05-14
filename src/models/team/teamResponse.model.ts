import TeamMember from './team.model';

export default interface TeamResponse {
    keyPartners: TeamMember[];
    otherPartners: TeamMember[];
}
