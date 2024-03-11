import "./JobsModal.styles.scss";

import { observer } from "mobx-react-lite";
import { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill";
import CancelBtn from "@assets/images/utils/Cancel_btn.svg";

import { Button, Form, Input, message, Modal, Popover, Select } from "antd";

import JobApi from "@/app/api/job/Job.api";
import {
  checkQuillEditorTextLength,
  setQuillEditorContent,
} from "@/app/common/components/Editor/EditorUtilities/quillUtils.utility";
import Editor from "@/app/common/components/Editor/QEditor.component";

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  currentId: number;
}

const JobsModal = ({ open, setOpen, currentId }: Props) => {
  const maxLengths = {
    maxLenghtVacancyName: 50,
    maxLenghtVacancyDesc: 2000,
    maxLenghtVacancySalary: 15,
  };

  const [form] = Form.useForm();

  const emptyJob: Job = {
    title: form.getFieldValue("title"),
    description: "",
    status: form.getFieldValue("status"),
    id: 0,
    salary: form.getFieldValue("salary"),
  };

  const textEditor = useRef<ReactQuill | null>(null);
  const [current, setCurrent] = useState<Job>(emptyJob);
  const [editorCharacterCount, setEditorCharacterCount] = useState<number>(0);

  const [storedJob, setStoredJob] = useState<Job>(emptyJob);

  useEffect(() => {
    const fetchJobData = async () => {
      if (open && currentId !== 0) {
        try {
          const currentJob = await JobApi.getById(currentId);
          setQuillEditorContent(textEditor.current, currentJob?.description);
          setCurrent(currentJob);
          form.setFieldsValue({
            title: currentJob.title,
            status: currentJob.status ? "setActive" : "setInactive",
            description: currentJob.description,
            salary: currentJob.salary,
          });
        } catch (error) {
          console.log(error);
        }
      } else if (currentId === 0) {
        setStoredJob(emptyJob);
        form.setFieldsValue({
          title: storedJob.title,
          status: storedJob.status ? "setActive" : "setInactive",
          description: storedJob.description,
          salary: storedJob.salary,
        });
      }
    };

    textEditor.current?.editor?.setText("");
    fetchJobData();
  }, [open, currentId]);

  const handleSave = async () => {
    try {
        const values = await form.getFieldsValue();
        checkQuillEditorTextLength(
          editorCharacterCount,
          maxLengths.maxLenghtVacancyDesc
        );
        const { title, status, salary } = values;
        const isActive = status === "setActive";

        const newJob: Job = {
          id: currentId,
          title,
          status: isActive,
          description: current.description,
          salary,
        };
        const allJobs = await JobApi.getAllShort();
        allJobs
          ?.map((t) => t)
          .forEach((t) => {
            if (values.title == t.title) newJob.id = t.id;
          });
        if (newJob.id === 0) {
          await JobApi.create(newJob);
        } else {
          await JobApi.update(newJob);
        }
        message.success("Вакансію успішно додано!", 2);
    } catch (e: any) {
      console.log(e);
      message.error("Будь ласка, перевірте введені дані", 2);
    }
  };

  const handelOk = () => {
    try{
      form.submit();
    } catch(e: any){
      console.log(e);
    }
  }

  const clearModal = () => {
    form.resetFields();
    setOpen(false);
  };

  const handleEditorChange = (content: string) => {
    setCurrent({
      ...current,
      description: content,
    });
  };

  return (
    <Modal
      className="modalContainer"
      open={open}
      onCancel={() => {
        setOpen(false);
      }}
      footer={null}
      maskClosable
      centered
      closeIcon={
        <Popover content="Внесені зміни не будуть збережені!" trigger="hover">
          <CancelBtn className="iconSize" onClick={clearModal} />
        </Popover>
      }
    >
      <div className="center">
        <h2>Вакансії</h2>
      </div>
      <Form layout="vertical" form={form} initialValues={{status: 'setActive' }} onFinish={handleSave}>
        <Form.Item
          label="Назва вакансії"
          name="title"
          rules={[{ required: true, message: "Введіть назву вакансії" }]}
        >
          <Input showCount maxLength={maxLengths.maxLenghtVacancyName} />
        </Form.Item>
        <Form.Item label="Статус вакансії" name="status">
          <Select
            key="statusSelectInput"
            className="status-select-input"
          >
            <Select.Option key="active" value="setActive">
              Активна
            </Select.Option>
            <Select.Option key="inactive" value="setInactive">
              Не активна
            </Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="Опис вакансії"
          name="description"
          data-testid="description"
        >
          <Editor
            qRef={textEditor}
            value={current.description}
            onChange={handleEditorChange}
            maxChars={maxLengths.maxLenghtVacancyDesc}
            onCharacterCountChange={setEditorCharacterCount}
          />

        </Form.Item>
        <Form.Item
          label="Заробітня плата"
          name="salary"
          rules={[{ required: true, message: "Введіть заробітню плату" }]}
        >
          <Input showCount maxLength={maxLengths.maxLenghtVacancySalary} />
        </Form.Item>
        <div className="center">
          <Button
            className="streetcode-custom-button"
            onClick={handelOk}
          >
            Зберегти
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default observer(JobsModal);
