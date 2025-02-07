import { ConfigProvider } from "antd";
import "./NewEventPage.styles.scss";
import PageBar from "../../PageBar/PageBar.component";
import NewEventBlock from "./NewEventBlock/NewEventBlock.component";

const NewEventPage = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#E04031",
          colorPrimaryHover: "#ff4d4f",
        },
      }}
    >
      <div className='new-event-page'>
        <PageBar />
        <div className='adminContainer'>
          <NewEventBlock />
        </div>
      </div>
    </ConfigProvider>
  );
};

export default NewEventPage;
