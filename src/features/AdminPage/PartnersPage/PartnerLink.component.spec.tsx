import { MemoryRouter } from 'react-router-dom';
import PartnerLink from './PartnerLink.component';
import { render } from '@testing-library/react';

const mockTargetURL = 'mockTargetURL';

const mockLinkProp = {
    id: 1,
    logoType: 0,
    targetUrl: mockTargetURL,
}

const svgNameCollection = ['SvgTwitterNew', 'SvgInstagram', 'SvgFacebook', 'SvgYoutube'];
// provided svg icons names will be genereate by jest-transformer-svg 
// based on svg file name with scheme -> Svg[fileName]

describe('PartnerLink', () => {
    it('should render component and its elements', () => {
        const { container } = render(
            <MemoryRouter>
                <PartnerLink link={mockLinkProp} />
            </MemoryRouter>,
        );

        const { logoType } = mockLinkProp;

        const link = container.getElementsByTagName('a');
        expect(link).toHaveLength(1);
        expect(link[0].href).toContain(mockTargetURL);

        const svgIcon = container.getElementsByTagName('svg');
        expect(svgIcon).toHaveLength(1);
        expect(svgIcon[0].getAttribute('data-file-name')).toContain(svgNameCollection[logoType]);
        // 'data-file-name' attribute ^^ will be avaliable only in test
    });

    it('should render Instagram logo', () => {
        const newMockLinkProp = {
            ...mockLinkProp,
            logoType: 1,
        }

        const { container } = render(
            <MemoryRouter>
                <PartnerLink link={newMockLinkProp} />
            </MemoryRouter>,
        );

        const { logoType } = newMockLinkProp;

        const svgIcon = container.getElementsByTagName('svg');
        expect(svgIcon).toHaveLength(1);
        expect(svgIcon[0].getAttribute('data-file-name')).toContain(svgNameCollection[logoType]);
        // 'data-file-name' attribute ^^ will be avaliable only in test
    });

    it('should render Facebook logo', () => {
        const newMockLinkProp = {
            ...mockLinkProp,
            logoType: 2,
        }

        const { container } = render(
            <MemoryRouter>
                <PartnerLink link={newMockLinkProp} />
            </MemoryRouter>,
        );

        const { logoType } = newMockLinkProp;

        const svgIcon = container.getElementsByTagName('svg');
        expect(svgIcon).toHaveLength(1);
        expect(svgIcon[0].getAttribute('data-file-name')).toContain(svgNameCollection[logoType]);
        // 'data-file-name' attribute ^^ will be avaliable only in test
    });

    it('should render Youtube logo', () => {
        const newMockLinkProp = {
            ...mockLinkProp,
            logoType: 3,
        }

        const { container } = render(
            <MemoryRouter>
                <PartnerLink link={newMockLinkProp} />
            </MemoryRouter>,
        );

        const { logoType } = newMockLinkProp;

        const svgIcon = container.getElementsByTagName('svg');
        expect(svgIcon).toHaveLength(1);
        expect(svgIcon[0].getAttribute('data-file-name')).toContain(svgNameCollection[logoType]);
        // 'data-file-name' attribute ^^ will be avaliable only in test
    });
});
