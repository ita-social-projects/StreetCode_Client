import { render, screen, waitFor } from "@testing-library/react";
import user from "@testing-library/user-event";
import JobApi from "@/app/api/job/Job.api";
import JobsModalComponent from "./JobsModal.component";

const mockJob: Job = {
  description: "description",
  id: 1,
  title: "title",
  salary: "salary",
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

jest.mock("@/app/api/job/Job.api", () => ({
  getById: jest.fn(() => mockJob),
  create: jest.fn((newJob: Job) => {
    newJob;
  }),
  update: jest.fn(() => {}),
  getAllShort: jest.fn(() => {
    [];
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
});
