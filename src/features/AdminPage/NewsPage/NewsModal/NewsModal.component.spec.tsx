import React, { ReactNode } from "react";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
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
      const { value, onChange } = props;
      const handleOnChange = (newValue: string) => {
        onChange(newValue.slice(0, 15000));
      };
      const maxChars = 15000;
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
  test.skip("it should render component", () => {
    render(<NewsModal open setIsModalOpen={() => {}} />);
    screen.logTestingPlaygroundURL();
  });

  test.skip("it should be filled with required values and submited", async () => {
    render(<NewsModal open setIsModalOpen={() => {}} />);

    const titleInput = screen.getByLabelText("Заголовок:");
    const urlInput = screen.getByLabelText("Посилання:");
    const textInput = screen.getByTestId("mockEditor") as HTMLTextAreaElement;
    // const creationDateInput = screen.getByLabelText("Дата створення:");
    const fileUpload = screen.getByTestId("file-input") as HTMLInputElement;

    const file = new File(["test"], "test.png", { type: "image/png" });

    await waitFor(() => {
      userEvent.type(titleInput, "Test Title");
      userEvent.type(urlInput, "Test Url");
      userEvent.type(textInput, "This is a test text");
      userEvent.upload(fileUpload, file);
    });

    expect(titleInput).toHaveValue("Test Title");
    expect(urlInput).toHaveValue("Test Url");
    expect(textInput).toHaveValue("This is a test text");
    if (fileUpload.files) expect(fileUpload.files[0]).toStrictEqual(file);
  });

  test("it should truncate inputs when exceeding maximum characters/files", async () => {
    render(<NewsModal open setIsModalOpen={() => {}} />);

    const titleInput = screen.getByLabelText("Заголовок:") as HTMLInputElement;
    const urlInput = screen.getByLabelText("Посилання:") as HTMLInputElement;
    const textInput = screen.getByTestId("mockEditor") as HTMLTextAreaElement;
    const fileUpload = screen.getByTestId("file-input") as HTMLInputElement;

    const a = 'uxlprrbyrugcjgplxivhpsducilsafcnheueosipnqutahqdgss';
    const tooLongTitle = a.repeat(2);
    const tooLongUrl = a.repeat(4);
    const tooLongText = a.repeat(300);
    const fileArray = [
      new File(["test1"], "test1.png", { type: "image/png" }),
      new File(["test2"], "test2.png", { type: "image/png" })
    ]

    userEvent.type(titleInput, tooLongTitle);
    userEvent.type(urlInput, tooLongUrl);
    //userEvent.type() with that long input exceeds maximum call stack size
    fireEvent.change(textInput, { target: { value: tooLongText } });
    userEvent.upload(fileUpload,fileArray);

    await waitFor(() => {
      expect(titleInput.value).toHaveLength(100);
      expect(urlInput.value).toHaveLength(200);
      expect(textInput.value).toHaveLength(15000);
      expect(fileUpload.files).toHaveLength(1);
    });
  });
});