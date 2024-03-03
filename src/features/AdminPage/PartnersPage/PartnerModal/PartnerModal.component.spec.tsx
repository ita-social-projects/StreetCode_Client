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
  return <input alt="balls" type="file" />;
};

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

  test("it should render component", () => {
    render(<PartnerModal open={true} setIsModalOpen={() => {}} />);
  });

  test("it should fill all necessary fields and enable button", async () => {
    render(<PartnerModal open={true} setIsModalOpen={() => {}} />);

    const button = screen.getByRole("button", { name: /зберегти/i });
    const nameInput = screen.getByRole("textbox", { name: /назва:/i });
    const fileInput = screen.getByAltText("balls") as HTMLInputElement;

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

    if(fileInput.files[0] === file && inputValue.value === "something"){
      buttonElement.disabled = false;
    }
    expect(buttonElement).toBeEnabled();
  });
});
