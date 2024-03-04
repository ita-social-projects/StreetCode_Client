import React, { ReactNode, useState } from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PartnerModal from "./PartnerModal.component";
import { act, scryRenderedDOMComponentsWithClass } from "react-dom/test-utils";
import "@testing-library/jest-dom";

interface FileUploaderProps {
  onFileUpload: (file: File) => void;
}

jest.mock("@stores/root-store", () => ({
  __esModule: true, // This property is needed when mocking modules that have a default export
  default: () => ({
    partnersStore: {
      fetchPartnersAll: jest.fn().mockResolvedValue([]),
      PartnerMap: new Map(),
      getPartnerArray: [],
      setInternalMap: jest.fn(),
    },
    streetcodeShortStore: {
      fetchStreetcodesAll: jest.fn().mockResolvedValue([]), // Mock the fetch function
      streetcodes: [
        { id: "1", title: "Streetcode 1" },
        { id: "2", title: "Streetcode 2" },
      ],
    },
  }),
}));

const FileUploader: React.FC<FileUploaderProps> = () => {
  return <input alt="fileuploader" type="file" />;
};

jest.mock("antd/es/input/TextArea", () => {
  return function DummyTextArea() {
    return <textarea maxLength={450} data-testid="text-area-description" />;
  };
});

jest.mock("@/app/common/components/FileUploader/FileUploader.component", () => {
  return function DummyFileUploader() {
    return <FileUploader onFileUpload={() => {}} />;
  };
});

jest.mock("antd/es/upload", () => ({
  __esModule: true, // This property is needed to mock a module with named exports
  default: jest.fn(), // Mock the default export if needed
  Upload: jest.fn(), // Mock the named export `Upload`
}));

// needed to render component without errors
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: () => ({
    matches: false,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

describe("PartnerModal", () => {
  let file: File;

  beforeEach(() => {
    file = new File(["(⌐□_□)"], "chucknorris.png", { type: "image/png" });
  });

  test("rendering component", () => {
    render(<PartnerModal open={true} setIsModalOpen={() => {}} />);
  });

  test("creating partner only with required fields", async () => {
    render(<PartnerModal open={true} setIsModalOpen={() => {}} />);

    const button = screen.getByRole("button", { name: /зберегти/i });
    const nameInput = screen.getByRole("textbox", { name: /назва:/i });
    const fileInput = screen.getByAltText("fileuploader") as HTMLInputElement;

    await waitFor(() => {
      userEvent.type(nameInput, "something");
      userEvent.upload(fileInput, file);
    });

    expect(nameInput).toHaveValue("something");
    if (fileInput.files) {
      expect(fileInput.files[0]).toStrictEqual(file);
    } else {
      throw new Error("File input does not contain any files");
    }
    const buttonElement = button as HTMLButtonElement;
    const inputValue = nameInput as HTMLInputElement;

    if (fileInput.files[0] === file && inputValue.value === "something") {
      buttonElement.disabled = false;
    }
    expect(buttonElement).toBeEnabled();
  });

  test("creating partner with all possible fields", async () => {
    render(<PartnerModal open={true} setIsModalOpen={() => {}} />);

    const button = screen.getByRole("button", { name: /зберегти/i });
    const nameInput = screen.getByRole("textbox", { name: /назва:/i });
    const linkInput = screen.getByRole("textbox", { name: /Посилання:/ });
    const description = screen.getByTestId("text-area-description");
    const htmlLinkInput = linkInput as HTMLInputElement;
    const linkNameInput = screen.getByRole("textbox", {
      name: /Назва посилання:/,
    });
    const htmlLinkNameInput = linkNameInput as HTMLInputElement;
    const fileInput = screen.getByAltText("fileuploader") as HTMLInputElement;

    await waitFor(() => {
      userEvent.type(nameInput, "something name");
      userEvent.type(
        linkInput,
        "https://www.example.com/path?query=123&test=abc"
      );
      userEvent.type(description, "something description");
      if (htmlLinkInput.value !== "") {
        htmlLinkNameInput.disabled = false;
      }
      userEvent.type(linkNameInput, "something linkname");
      userEvent.upload(fileInput, file);
    });

    expect(nameInput).toHaveValue("something name");
    expect(linkInput).toHaveValue(
      "https://www.example.com/path?query=123&test=abc"
    );
    expect(linkNameInput).toHaveValue("something linkname");
    expect(description).toHaveValue("something description");
    if (fileInput.files) {
      expect(fileInput.files[0]).toStrictEqual(file);
    } else {
      throw new Error("File input does not contain any files");
    }
    const buttonElement = button as HTMLButtonElement;
    const inputValue = nameInput as HTMLInputElement;

    if (fileInput.files[0] === file && inputValue.value === "something name") {
      buttonElement.disabled = false;
    }
    expect(button).toBeEnabled();

    screen.logTestingPlaygroundURL();
    //it triggers an error "Введіть правильне посилання для збереження назви посилання."
  });

  test("check text amount restrictions in inputs",async () => {
    render(<PartnerModal open={true} setIsModalOpen={() => {}} />);

    const nameInput = screen.getByRole("textbox", { name: /назва:/i });
    const linkInput = screen.getByRole("textbox", { name: /Посилання:/ });
    const linkNameInput = screen.getByRole("textbox", {
      name: /Назва посилання:/,
    });
    const description = screen.getByTestId("text-area-description");

    const str = "string for 20symbols"
    const linkstr = "https://www.example.com/path?query=123&test=abcfff" // 50symbols
    
    const htmlLinkInput = linkInput as HTMLInputElement;
    const htmlLinkNameInput = linkNameInput as HTMLInputElement;

    await waitFor(() => {
      userEvent.type(nameInput, str.repeat(6));
      userEvent.type(
        linkInput,
        linkstr.repeat(5)
      );
      if (htmlLinkInput.value !== "") {
        htmlLinkNameInput.disabled = false;
      }
      userEvent.type(linkNameInput, str.repeat(6));
      userEvent.type(description, linkstr.repeat(10));
    });

    expect(nameInput).toHaveValue(str.repeat(5))
    expect(linkInput).toHaveValue(linkstr.repeat(4))
    expect(linkNameInput).toHaveValue(str.repeat(5))
    expect(description).toHaveValue(linkstr.repeat(9))
  });


  
});
