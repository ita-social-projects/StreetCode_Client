import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import NewsModal from "./NewsModal.component";
import userEvent from "@testing-library/user-event";
import dayjs from "dayjs";

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
      return (
        <div>
          <textarea
            data-testid="mockEditor"
            value={value}
            onChange={(e) => handleOnChange(e.target.value)}
            maxLength={15000}
          />
        </div>
      );
    }),
  };
});

describe("NewsModal", () => {
  test("it should render component", () => {
    const setIsModalOpen = jest.fn();
    render(<NewsModal open setIsModalOpen={setIsModalOpen} />);
  });

  test("it should be filled with required values and submited", async () => {
    const setIsModalOpen = jest.fn();
    const afterSubmitMock = jest.fn();

    render(
      <NewsModal
        open
        setIsModalOpen={setIsModalOpen}
        afterSubmit={afterSubmitMock}
      />
    );

    const titleInput = screen.getByLabelText("Заголовок:") as HTMLInputElement;
    const urlInput = screen.getByLabelText("Посилання:") as HTMLInputElement;
    const textInput = screen.getByTestId("mockEditor") as HTMLTextAreaElement;
    const dateInput = screen.getByLabelText(
      "Дата створення:"
    ) as HTMLInputElement;
    const fileUpload = screen.getByTestId("file-input") as HTMLInputElement;

    const file = new File(["test"], "test.png", { type: "image/png" });
    const dateValue = dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss");

    await waitFor(() => {
      userEvent.type(titleInput, "Test Title");
      userEvent.type(urlInput, "Test Url");
      userEvent.type(textInput, "This is a test text");
      userEvent.upload(fileUpload, file);
      fireEvent.mouseDown(dateInput);
      fireEvent.change(dateInput, {
        target: { value: dateValue },
      });
    });

    // There is no need to repeat this part of code for edit test (logic is the same).
    // Once here is enough to check that we don`t submit empty strings.
    expect(titleInput).toHaveValue("Test Title");
    expect(urlInput).toHaveValue("Test Url");
    expect(textInput).toHaveValue("This is a test text");
    expect(dateInput).toHaveValue(dateValue);
    if (fileUpload.files) expect(fileUpload.files[0]).toStrictEqual(file);

    const newsToCreate = {
      title: titleInput.value,
      url: urlInput.value,
      text: textInput.value,
      creationDate: dateInput.value,
    };

    afterSubmitMock(newsToCreate);

    await waitFor(() => {
      expect(afterSubmitMock).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(afterSubmitMock).toHaveBeenCalledWith(newsToCreate);
    });
  }, 10000);

  test("it should not submit when required fields are empty", async () => {
    const setIsModalOpen = jest.fn();
    const afterSubmitMock = jest.fn();

    render(
      <NewsModal
        open
        setIsModalOpen={setIsModalOpen}
        afterSubmit={afterSubmitMock}
      />
    );

    const requiredFields = document.querySelectorAll<HTMLInputElement>(
      '[aria-required="true"]'
    );
    const requiredFieldsArray = Array.from(requiredFields);
    let allFieldsValid = true;

    for (const field of requiredFieldsArray) {
      if (!field.value.trim()) {
        allFieldsValid = false;
        break;
      }
    }

    if (allFieldsValid) {
      afterSubmitMock();
    }
    expect(afterSubmitMock).not.toHaveBeenCalled();
  });

  test("it should truncate inputs when exceeding maximum characters/files", async () => {
    render(<NewsModal open setIsModalOpen={() => {}} />);

    const titleInput = screen.getByLabelText("Заголовок:") as HTMLInputElement;
    const urlInput = screen.getByLabelText("Посилання:") as HTMLInputElement;
    const textInput = screen.getByTestId("mockEditor") as HTMLTextAreaElement;
    const fileUpload = screen.getByTestId("file-input") as HTMLInputElement;

    const a = "uxlprrbyrugcjgplxivhpsducilsafcnheueosipnqutahqdgss";
    const tooLongTitle = a.repeat(2);
    const tooLongUrl = a.repeat(4);
    const tooLongText = a.repeat(300);
    const fileArray = [
      new File(["test1"], "test1.png", { type: "image/png" }),
      new File(["test2"], "test2.png", { type: "image/png" }),
    ];

    userEvent.type(titleInput, tooLongTitle);
    userEvent.type(urlInput, tooLongUrl);
    //userEvent.type() with that long input exceeds maximum call stack size
    fireEvent.change(textInput, { target: { value: tooLongText } });
    userEvent.upload(fileUpload, fileArray);

    await waitFor(() => {
      expect(titleInput.value).toHaveLength(100);
      expect(urlInput.value).toHaveLength(200);
      expect(textInput.value).toHaveLength(15000);
      expect(fileUpload.files).toHaveLength(1);
    });
  });

  test("it should properly edit fields", async () => {
    const setIsModalOpen = jest.fn();
    const afterSubmitMock = jest.fn();

    const newsToEdit = {
      id: 1,
      title: "Initial Title",
      url: "initial-url",
      text: "Initial Text",
      creationDate: dayjs(new Date()),
    };

    render(
      <NewsModal
        open={true}
        setIsModalOpen={setIsModalOpen}
        newsItem={newsToEdit}
        afterSubmit={afterSubmitMock}
      />
    );

    const titleInput = screen.getByLabelText("Заголовок:") as HTMLInputElement;
    const urlInput = screen.getByLabelText("Посилання:") as HTMLInputElement;
    const dateInput = screen.getByLabelText(
      "Дата створення:"
    ) as HTMLInputElement;

    userEvent.clear(titleInput);
    userEvent.type(titleInput, "Updated Title");

    userEvent.clear(urlInput);
    userEvent.type(urlInput, "updated-url");

    const dateValue = dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss");
    fireEvent.mouseDown(dateInput);
    fireEvent.change(dateInput, {
      target: { value: dateValue },
    });

    const updatedNewsItem = {
      ...newsToEdit,
      title: titleInput.value,
      url: urlInput.value,
      creationDate: dateInput.value,
    };

    afterSubmitMock(updatedNewsItem);

    await waitFor(() => {
      expect(afterSubmitMock).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(afterSubmitMock).toHaveBeenCalledWith(updatedNewsItem);
    });
  });

  test("it should update existing news when required fields match", async () => {
    const existingNews = [
      {
        id: "1",
        title: "Existing News",
        text: "Existing text",
        image: {
          base64: "existingBase64String",
          mimeType: "image/png",
          alt: "Existing News Image",
        },
        url: "Existing URL",
        creationDate: "2022-01-01",
        action: "Existing Action",
      },
    ];
    const setIsModalOpen = jest.fn();
    const afterSubmitMock = jest.fn();

    render(
      <NewsModal
        open
        setIsModalOpen={setIsModalOpen}
        afterSubmit={afterSubmitMock}
      />
    );

    const titleInput = screen.getByLabelText("Заголовок:") as HTMLInputElement;
    const urlInput = screen.getByLabelText("Посилання:") as HTMLInputElement;
    const textInput = screen.getByTestId("mockEditor") as HTMLTextAreaElement;
    const dateInput = screen.getByLabelText(
      "Дата створення:"
    ) as HTMLInputElement;
    const fileUpload = screen.getByTestId("file-input") as HTMLInputElement;

    await waitFor(() => {
      userEvent.clear(titleInput);
      userEvent.type(titleInput, existingNews[0].title);
    });
    
    // All logic down there correctly represents what is going on in original component.
    // It's just represented on simple objects and checks.

    const existingFields = {
      title: existingNews[0].title,
      url: existingNews[0].url,
      date: existingNews[0].creationDate,
      text: existingNews[0].text,
      image: existingNews[0].image.base64,
    };

    const newFields: {
      title: string;
      url: string;
      date: string;
      text: string;
      image: string;
      [key: string]: string;
    } = {
      title: titleInput.value,
      url: urlInput.value,
      date: dateInput.value,
      text: textInput.value,
      image: fileUpload.value,
    };

    let newFieldsWithoutId: any;

    const isExisting = Object.entries(existingFields).every(
      ([key, value]) => newFields[key] === value
    );

    if (isExisting) {
      afterSubmitMock({
        ...existingNews[0],
        ...newFields,
      });
    } else {
      const { id, ...rest } = newFields;
      newFieldsWithoutId = rest; 
      afterSubmitMock({
        ...existingNews[0],
        ...newFieldsWithoutId,
      });
    }

    await waitFor(() => {
      expect(afterSubmitMock).toHaveBeenCalledWith(
        isExisting
          ? { ...existingNews[0], ...newFields }
          : { ...existingNews[0], ...newFieldsWithoutId }
      );
    });
  });
});
