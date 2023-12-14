import './FounderText.styles.scss'

const FounderText = ({ founderText }: { founderText: String }) => (
    <div className='foundersTextBlock borderRadiusBig'>
        <div className='foundersTextContainer'>
            {founderText}
        </div>
    </div>
)
export default FounderText;