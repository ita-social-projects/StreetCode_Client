import React, { ReactNode } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import NewsModal from "./NewsModal.component";
import userEvent from "@testing-library/user-event";

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
        onChange(newValue);
      };

      return (
        <div>
          <textarea
            data-testid="mockEditor"
            value={value}
            onChange={(e) => handleOnChange(e.target.value)}
            maxLength={maxChars}
          />
          <div>
            Character Count: {value.length}/{maxChars}
          </div>
        </div>
      );
    }),
  };
});

describe("NewsModal", () => {
  test("it should render component", () => {
    render(<NewsModal open setIsModalOpen={() => {}} />);
    screen.logTestingPlaygroundURL();
  });

  test("it should be filled with required values and submited", async () => {
    render(<NewsModal open setIsModalOpen={() => {}} />);

    const titleInput = screen.getByLabelText("Заголовок:");
    const urlInput = screen.getByLabelText("Посилання:");
    const textInput = screen.getByTestId("mockEditor") as HTMLTextAreaElement;
    // const creationDateInput = screen.getByLabelText("Дата створення:");
    const fileUpload = screen.getByTestId("file-input") as HTMLInputElement;

    const file = new File(["test"], "test.png", { type: "image/png" });

    await waitFor(() => {
      userEvent.upload(fileUpload, file);
      userEvent.type(titleInput, "Test Title");
      userEvent.type(urlInput, "Test Url");
      userEvent.type(textInput, "This is a test text");
    });

    expect(titleInput).toHaveValue("Test Title");
    expect(urlInput).toHaveValue("Test Url");
    expect(textInput).toHaveValue("This is a test text");
    if (fileUpload.files) expect(fileUpload.files[0]).toStrictEqual(file);
  });
});
