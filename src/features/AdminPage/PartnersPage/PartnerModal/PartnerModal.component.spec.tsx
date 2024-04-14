import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PartnerModal from "./PartnerModal.component";
import PartnersApi from "@/app/api/partners/partners.api";
import "@testing-library/jest-dom";
import 'jest-canvas-mock';
import Image, { ImageCreate } from "@/models/media/image.model";
import Partner, { PartnerCreateUpdate } from "@/models/partners/partners.model";
import { act } from "react-dom/test-utils";

global.URL.createObjectURL = jest.fn();

jest.mock("@/app/api/partners/partners.api", () => ({
  create: jest.fn(() => { }),
  update: jest.fn(() => { }),
}));

jest.mock("@/app/api/media/images.api", () => ({
  create: (image: ImageCreate) => (
    Promise.resolve({
      id: 999,
      base64: image.baseFormat,
      blobName: image.title,
      mimeType: image.mimeType,
    } as Image)
    ),
}));

jest.mock("@stores/root-store", () => ({
  __esModule: true, // This property is needed when mocking modules that have a default export
  default: () => ({
    partnersStore: {
      fetchPartnersAll: jest.fn().mockResolvedValue([]),
      PartnerMap: new Map(),
      getPartnerArray: [{
          id: 0,
          isKeyPartner: false,
          isVisibleEverywhere: false,
          title: 'something',
          logoId: 999,
          partnerSourceLinks: [],
          streetcodes: [],
        } as Partner] as Partner[],
      setInternalMap: jest.fn(),
      createPartner: (partner: PartnerCreateUpdate) => { PartnersApi.create(partner) },
      updatePartner: (partner: PartnerCreateUpdate) => { PartnersApi.update(partner) },
    },
    streetcodeShortStore: {
      fetchStreetcodesAll: jest.fn().mockResolvedValue([]), // Mock the fetch function
      streetcodes: [
        { id: "1", title: "Streetcode 1" },
        { id: "2", title: "Streetcode 2" },
      ],
    },
  })
}));

jest.mock("antd/es/input/TextArea", () => {
  return function DummyTextArea() {
    return <textarea maxLength={450} data-testid="text-area-description" />;
  };
});

// needed to render component without errors
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: () => ({
    matches: false,
    onchange: null,
    addListener: () => { },
    removeListener: () => { },
    addEventListener: () => { },
    removeEventListener: () => { },
    dispatchEvent: () => { },
  }),
});

describe("PartnerModal", () => {
  let file: File;

  beforeEach(() => {
    file = new File(["(⌐□_□)"], "chucknorris.png", { type: "image/png" });
  });

  test("rendering component", () => {
    render(<PartnerModal open={true} setIsModalOpen={() => { }} />);
  });

  test("creating partner only with required fields", async () => {
    render(<PartnerModal open={true} setIsModalOpen={() => { }} />);

    const button = screen.getByRole("button", { name: /зберегти/i });
    const nameInput = screen.getByRole("textbox", { name: /назва:/i });

    const fileInput = screen.getByTestId("fileuploader");
    const inputElement = fileInput as HTMLInputElement;

    await waitFor(() => {
      userEvent.type(nameInput, "something");
      userEvent.upload(fileInput, file);
    });

    expect(nameInput).toHaveValue("something");
    if (inputElement.files) {
      expect(inputElement.files[0]).toStrictEqual(file);
    } else {
      throw new Error("File input does not contain any files");
    }
    
    expect(button).toBeEnabled();
  });

  test("creating partner with all possible fields", async () => {
    render(<PartnerModal open={true} setIsModalOpen={() => { }} />);

    const button = screen.getByRole("button", { name: /зберегти/i });
    const nameInput = screen.getByRole("textbox", { name: /назва:/i });
    const linkInput = screen.getByRole("textbox", { name: /Посилання:/ });
    const description = screen.getByTestId("text-area-description");
    const htmlLinkInput = linkInput as HTMLInputElement;
    const linkNameInput = screen.getByRole("textbox", {
      name: /Назва посилання:/,
    });
    const htmlLinkNameInput = linkNameInput as HTMLInputElement;

    const fileInput = screen.getByTestId("fileuploader");
    const inputElement = fileInput as HTMLInputElement;

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
    if (inputElement.files) {
      expect(inputElement.files[0]).toStrictEqual(file);
    } else {
      throw new Error("File input does not contain any files");
    }
    
    expect(button).toBeEnabled();
    //it triggers an error "Введіть правильне посилання для збереження назви посилання."
  });

  test("check text amount restrictions in inputs", async () => {
    render(<PartnerModal open={true} setIsModalOpen={() => { }} />);

    const nameInput = screen.getByRole("textbox", { name: /назва:/i });
    const linkInput = screen.getByRole("textbox", { name: /Посилання:/ });
    const linkNameInput = screen.getByRole("textbox", {
      name: /Назва посилання:/,
    });
    const description = screen.getByTestId("text-area-description");

    const str = "string for 20symbols";
    const linkstr = "https://www.example.com/path?query=123&test=abcfff"; // 50symbols

    const htmlLinkInput = linkInput as HTMLInputElement;
    const htmlLinkNameInput = linkNameInput as HTMLInputElement;

    const fileInput = screen.getByTestId("fileuploader");
    const inputElement = fileInput as HTMLInputElement;

    await waitFor(() => {
      userEvent.type(nameInput, str.repeat(6));
      userEvent.type(linkInput, linkstr.repeat(5));
      if (htmlLinkInput.value !== "") {
        htmlLinkNameInput.disabled = false;
      }
      userEvent.type(linkNameInput, str.repeat(6));
      userEvent.type(description, linkstr.repeat(10));
      userEvent.upload(fileInput, file);
      userEvent.upload(fileInput, file);
    });

    expect(nameInput).toHaveValue(str.repeat(5));
    expect(linkInput).toHaveValue(linkstr.repeat(4));
    expect(linkNameInput).toHaveValue(str.repeat(5));
    expect(description).toHaveValue(linkstr.repeat(9));
    if (inputElement.files) {
      expect(inputElement.files[0]).toStrictEqual(file);
    }
  });

  test("check when required fields are the same then existing partner should be updated instead of created", async () => {
    render(<PartnerModal open={true} setIsModalOpen={() => { }} />);

    const button = screen.getByRole("button", { name: /зберегти/i });
    const buttonElement = button as HTMLButtonElement;

    const nameInput = screen.getByRole("textbox", { name: /назва:/i });

    const fileInput = screen.getByTestId("fileuploader");
    const inputElement = fileInput as HTMLInputElement;

    await act(async () => {
      userEvent.upload(fileInput, file);
      userEvent.type(nameInput, "something");
    });

    expect(nameInput).toHaveValue("something");

    if (inputElement.files) {
      expect(inputElement.files[0]).toStrictEqual(file);
    } else {
      throw new Error("File input does not contain any files");
    }

    expect(buttonElement).toBeEnabled();

    //Should wrap this in act because new Promise shifts to another framestack(?) 
    //and causes async changing of state of previous multiple components
    //outside of act() framestack (which causes warnings, unexpected behaviour etc.)
    await act(async () => { await new Promise((r) => setTimeout(r, 2000)) });
    

    await act(async () => {
      userEvent.click(button);
    })

    await waitFor(() => {
      expect(PartnersApi.update).toHaveBeenCalled();
      expect(PartnersApi.create).not.toHaveBeenCalled();
    });
  }, 10000);

});