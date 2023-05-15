import './TeamSlider.styles.scss';

import TeamApi from '@/app/api/team/team.api';
import { useAsync } from '@/app/common/hooks/stateful/useAsync.hook';
import TeamMember from '@/models/team/team.model';
import TeamItemSlider from './TeamItemSlider/TeamItemSlider.component';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { useState, useEffect } from 'react';

const TeamSlider = () => {
	const [team, setTeam] = useState<TeamMember[]>([]);

	useEffect(() => {
		const fetchTeamMembers = async () => {
			try {
				const response = await TeamApi.getAll();
				setTeam(response);
				console.log(response);

			} catch (error) {
			}
		};

		fetchTeamMembers();
	}, []);

	if (team.length > 0) {
		return (
			<div id="mainBlock" className="mainBlock">
				<div className="mainContainer">
					<div className="blockCentering">
						<div className="mainContent">
							{team.map((member) =>
								member.isMain ? (
									<div key={member.id} className="slider-item">
										<TeamItemSlider team={member} />
									</div>
								) : null
							)}
						</div>
					</div>
				</div>
			</div>
		);
	}

	return null;
};

export default TeamSlider;
