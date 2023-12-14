import PageBar from '../PageBar/PageBar.component';
import JobsTable from './JobsTable/JobsTable.component';


const JobPage = () => {
    return (
        <div className = 'partners-page'>
            <PageBar />
            <JobsTable />
        </div>
    );
}
export default JobPage;