import { useState } from "react";
import { Button, Input, Select } from "antd/es";
import "./CalendarControlBar.styles.scss";
import MagnifyingGlass from "@images/header/Magnifying_glass.svg";

interface Props {
  handleChange: (value: string) => void;
}
const CalendarControlBar: React.FC<Props> = ({ handleChange }) => {
  const [modalAddOpened, setModalAddOpened] = useState<boolean>(false);

  return (
    <div className='calendarControlBar'>
      <div className='calendarControlBarElement'>
        <Button className='Button' onClick={() => {}}>
          Пошук події
        </Button>
      </div>
      <div className='calendarControlBarElement Input'>
        <Input
          prefix={<MagnifyingGlass />}
          // onChange={handleChangeTitle}
          placeholder='Назва або індекс події'
        />
      </div>
      <div className='calendarControlBarElement'>
        <Select
          className='calendarControlBarStatusSelected'  
          defaultValue='historical'
          onChange={handleChange}
          options={[
            { value: "historical", label: "Історичні події" },
            { value: "custom", label: "Кастомні події" },
          ]}
        />
      </div>
      <div className='calendarControlBarElement'>
        <Button className='Button' onClick={() => setModalAddOpened(true)}>
          Додати подію
        </Button>
      </div>
    </div>
  );
};

export default CalendarControlBar;
