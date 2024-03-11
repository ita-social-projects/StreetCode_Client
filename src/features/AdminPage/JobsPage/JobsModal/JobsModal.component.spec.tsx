import { render, screen, waitFor, within } from "@testing-library/react";
import user from "@testing-library/user-event";
import JobApi from "@/app/api/job/Job.api";
import JobsModalComponent from "./JobsModal.component";

const mockJob: Job = {
  description: "descriptionMock",
  id: 1,
  title: "titleMock",
  salary: "salaryMock",
  status: false,
};

// needed to render component without errors
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: (query: any) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

jest.mock("@/app/common/components/Editor/QEditor.component", () => {
  return {
    __esModule: true,
    default: jest.fn((props) => {
      const { value, onChange, maxChars } = props;
      const handleOnChange = (newValue: string) => {
        onChange(newValue.slice(0, 3000));
      };
      return (
        <div>
          <textarea
            value={value}
            onChange={(e) => handleOnChange(e.target.value)}
            maxLength={maxChars}
          />
        </div>
      );
    }),
  };
});

jest.mock("@/app/api/job/Job.api", () => ({
  getById: jest.fn(() => mockJob),
  create: jest.fn(() => {}),
  update: jest.fn(() => {}),
  getAllShort: jest.fn(() => {
    return [mockJob];
  }),
}));

// needs act warning fix
describe("JobsModal test", () => {
  it("should be rendered", async () => {
    const open = true;
    const setOpen = () => {};
    const currentId = 0;
    await waitFor(() => {
      render(
        <JobsModalComponent
          open={open}
          setOpen={setOpen}
          currentId={currentId}
        />
      );
    });

    // test input in title field
    const inputTitle = screen.getByRole("textbox", {
      name: /назва вакансії/i,
    });
    const selectStatus = screen.getByRole("combobox", {
      name: /статус вакансії/i,
    });

    const inputDesctription = screen.getByTestId("description");

    const inputSalary = screen.getByRole("textbox", {
      name: /заробітня плата/i,
    });
    const buttonSave = screen.getByRole("button", { name: /зберегти/i });

    expect(inputTitle).toBeInTheDocument;
    expect(selectStatus).toBeInTheDocument;
    expect(inputDesctription).toBeInTheDocument;
    expect(inputSalary).toBeInTheDocument;
    expect(buttonSave).toBeInTheDocument;
  });

  it("should create job with required fields only", async () => {
    // Arrange
    const open = true;
    const setOpen = () => {};
    const currentId = 0;
    await waitFor(() => {
      render(
        <JobsModalComponent
          open={open}
          setOpen={setOpen}
          currentId={currentId}
        />
      );
    });

    const inputTitle = screen.getByRole("textbox", {
      name: /назва вакансії/i,
    });

    const inputSalary = screen.getByRole("textbox", {
      name: /заробітня плата/i,
    });

    const buttonSave = screen.getByRole("button", { name: /зберегти/i });

    const createJobWithRequiredOnly: Job = {
      description: "",
      id: 0,
      title: "title",
      salary: "salary",
      status: false,
    };

    //Act
    await waitFor(() => {
      user.type(inputTitle, "title");
      user.type(inputSalary, "salary");
      user.click(buttonSave);
    });

    // Assert
    expect(JobApi.create).toHaveBeenCalled();
    expect(JobApi.create).toHaveBeenCalledWith(createJobWithRequiredOnly);
  }, 10000);

  it("should create job with all fields", async () => {
    // Arrange
    const open = true;
    const setOpen = () => {};
    const currentId = 0;
    await waitFor(() => {
      render(
        <JobsModalComponent
          open={open}
          setOpen={setOpen}
          currentId={currentId}
        />
      );
    });

    const inputTitle = screen.getByRole("textbox", {
      name: /назва вакансії/i,
    });

    const selectStatus = screen.getByRole("combobox", {
      name: /статус вакансії/i,
    });

    const inputDescription = within(
      screen.getByTestId("description")
    ).getByRole("textbox");

    const inputSalary = screen.getByRole("textbox", {
      name: /заробітня плата/i,
    });

    const buttonSave = screen.getByRole("button", { name: /зберегти/i });

    const createJobWithAllFields: Job = {
      description: "description",
      id: 0,
      title: "title",
      salary: "salary",
      status: true,
    };

    //Act
    await waitFor(() => {
      user.type(inputTitle, createJobWithAllFields.title);
      user.type(inputDescription, createJobWithAllFields.description);
      user.type(inputSalary, createJobWithAllFields.salary);
      user.click(selectStatus);
      user.click(screen.getByText("Активна"));
      user.click(buttonSave);
    });

    // Assert
    expect(JobApi.create).toHaveBeenCalled();
    expect(JobApi.create).toHaveBeenCalledWith(createJobWithAllFields);
  }, 10000);

  it("should edit vacancy data", async () => {
    // Arrange
    const open = true;
    const setOpen = () => {};
    const currentId = 1;
    await waitFor(() => {
      render(
        <JobsModalComponent
          open={open}
          setOpen={setOpen}
          currentId={currentId}
        />
      );
    });

    const inputTitle = screen.getByRole("textbox", {
      name: /назва вакансії/i,
    });

    const selectStatus = screen.getByRole("combobox", {
      name: /статус вакансії/i,
    });

    const inputDescription = within(
      screen.getByTestId("description")
    ).getByRole("textbox");

    const inputSalary = screen.getByRole("textbox", {
      name: /заробітня плата/i,
    });

    const buttonSave = screen.getByRole("button", { name: /зберегти/i });

    const editedJob: Job = {
      description: "edited description",
      id: 1,
      title: "edited title",
      salary: "edited salary",
      status: true,
    };

    // Act
    // discard text fields
    await waitFor(() => {
      user.clear(inputTitle);
      user.clear(inputDescription);
      user.clear(inputSalary);
    });

    await waitFor(() => {
      user.type(inputTitle, editedJob.title);
      user.type(inputDescription, editedJob.description);
      user.type(inputSalary, editedJob.salary);
      user.click(selectStatus);
      user.click(screen.getByText("Активна"));
      user.click(buttonSave);
    });

    expect(JobApi.update).toHaveBeenCalled();
    expect(JobApi.update).toHaveBeenCalledWith(editedJob);
  });

  it("should check functionality when required fields are the same", async () => {
    // Arrange
    const open = true;
    const setOpen = () => {};
    const currentId = 0;
    await waitFor(() => {
      render(
        <JobsModalComponent
          open={open}
          setOpen={setOpen}
          currentId={currentId}
        />
      );
    });

    const inputTitle = screen.getByRole("textbox", {
      name: /назва вакансії/i,
    });

    const inputSalary = screen.getByRole("textbox", {
      name: /заробітня плата/i,
    });

    const buttonSave = screen.getByRole("button", { name: /зберегти/i });

    const sameRequiredFieldsJob: Job = {
      description: "",
      id: 0,
      title: "titleMock",
      salary: "salaryMock",
      status: false,
    };

    // Act
    await waitFor(() => {
      user.type(inputTitle, sameRequiredFieldsJob.title);
      user.type(inputSalary, sameRequiredFieldsJob.salary);
      user.click(buttonSave);
    });

    sameRequiredFieldsJob.id = mockJob.id;

    expect(JobApi.update).toHaveBeenCalled();
    expect(JobApi.update).toHaveBeenCalledWith(sameRequiredFieldsJob);
  });

  it.skip("should check text amount restrictions", async () => {
    // Arrange
    const open = true;
    const setOpen = () => {};
    const currentId = 0;
    await waitFor(() => {
      render(
        <JobsModalComponent
          open={open}
          setOpen={setOpen}
          currentId={currentId}
        />
      );
    });

    const inputTitle = screen.getByRole("textbox", {
      name: /назва вакансії/i,
    });

    const inputDescription = within(
      screen.getByTestId("description")
    ).getByRole("textbox");

    const inputSalary = screen.getByRole("textbox", {
      name: /заробітня плата/i,
    });

    const buttonSave = screen.getByRole("button", { name: /зберегти/i });

    // Act
    await waitFor(() => {
      user.type(inputTitle, 'a'.repeat(55));
      user.type(inputDescription, 'a'.repeat(2005));
      user.type(inputSalary, 'a'.repeat(20));
    });

    
    
  });
});
