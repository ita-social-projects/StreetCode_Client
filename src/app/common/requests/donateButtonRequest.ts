import DonationApi from '@api/donates/donation.api';
import { PositiveNumber } from '@constants/custom-types.constants';
import Donation from '@models/feedback/donation.model';
import { donateEvent } from '@utils/googleAnalytics.unility';

export default function donateButtonRequest(donateAmount: PositiveNumber) {
    const donation: Donation = {
        amount: donateAmount,
        pageUrl: window.location.href,
    };

    const windowReference = window.open() as Window;
    DonationApi.create(donation).then(({ pageUrl }) => {
        donateEvent('support_us_page_donation_block');
        windowReference.location = pageUrl;
    }).catch(() => {
        windowReference.close();
    });
}
