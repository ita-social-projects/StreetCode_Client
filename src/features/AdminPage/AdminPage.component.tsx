 import './AdminPage.styles.scss';
 import StreetcodesTable from './StreetcodesTable/StreetcodesTable.component';
 import PageBar from './PageBar/PageBar.component';

 const AdminPage = () => (
     <div className="adminPageContainer">
         <StreetcodesTable/>
         <PageBar/>
     </div>
 );

export default AdminPage;