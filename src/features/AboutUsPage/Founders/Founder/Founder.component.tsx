import FounderCard from "./FounderCard/FounderCard.component";
import FounderText from "./FounderText/FounderText.component";

const Founder = (founder: FounderProps) => (
    <div className='foundersContentBlock'>
        { founder.order
            ? <FounderText founderText = {founder.founderText}/> 
            : <FounderCard {...founder}/>}

        { founder.order
            ? <FounderCard {...founder}/> 
            : <FounderText founderText = {founder.founderText}/>}
            
    </div>
);

export default Founder;
