import { cleanup, render, renderHook, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TagAdminModal from "./TagAdminModal";
import "@testing-library/jest-dom";
import { act } from "react-dom/test-utils";
import Tag, { TagCreate } from "@/models/additional-content/tag.model";
import TagsApi from "@/app/api/additional-content/tags.api";
import { message } from "antd";

jest.mock("antd", () => {
    const antd = jest.requireActual("antd");
    const { message } = antd;

    return {
        ...antd,
        message: {
            ...message,
            success: jest.fn(),
            config: jest.fn(),
            error: jest.fn(),
        }
    }
})

jest.mock("@/app/api/additional-content/tags.api", () => ({
    create: jest.fn(() => { }),
    update: jest.fn(() => { }),
}));

jest.mock("@stores/root-store", () => ({
    __esModule: true, // This property is needed when mocking modules that have a default export
    default: () => ({
        tagsStore: {
            getTagArray: [{id: 999, title: "existing tag"}] as Tag[],
            fetchTags: jest.fn().mockResolvedValue([]),
            createTag: (tag: TagCreate) => { TagsApi.create(tag) },
            updateTag: (tag: Tag) => { TagsApi.update(tag) },
        },
    })
}));

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

    beforeEach(() => {
        jest.resetAllMocks();
    })

    test("rendering component", () => {
        render(<TagAdminModal isModalVisible={true} setIsModalOpen={() => { }} />);
        cleanup();
    });

    test("check text amount restrictions in inputs", async () => {
        render(<TagAdminModal isModalVisible={true} setIsModalOpen={() => { }} />);

        const nameInput = screen.getByRole("textbox", { name: /назва:/i });

        const str = "test string 25 symbols 25";

        act(() => {
            userEvent.type(nameInput, str.repeat(6));
        });

        await waitFor(() => {
            expect(nameInput).toHaveValue(str.repeat(2));
        })

        cleanup();
    });

    test("create new tag", async () => {
        render(<TagAdminModal isModalVisible={true} setIsModalOpen={() => { }} />);

        const nameInput = screen.getByRole("textbox", { name: /назва:/i });
        const button = screen.getByRole("button", { name: /зберегти/i });

        act(() => {
            userEvent.type(nameInput, "New Tag");
            userEvent.click(button);
        });

        await waitFor(() => {
            expect(TagsApi.create).toHaveBeenCalled();
            expect(message.success).toHaveBeenCalled();
            expect(TagsApi.update).not.toHaveBeenCalled();
        })

        cleanup();
    })

    test("update tag", async () => {
        render(<TagAdminModal isModalVisible={true} setIsModalOpen={() => { }} initialData={{id: 1, title: "Old Tag"} as Tag}/>);

        const nameInput = screen.getByRole("textbox", { name: /назва:/i });
        const button = screen.getByRole("button", { name: /зберегти/i });

        await waitFor(() => {
            expect(nameInput).toHaveValue("Old Tag");
        })

        act(() => {
            userEvent.type(nameInput, "New Tag");
            userEvent.click(button);
        });

        await waitFor(() => {
            expect(TagsApi.update).toHaveBeenCalled();
            expect(message.success).toHaveBeenCalled();
            expect(TagsApi.create).not.toHaveBeenCalled();
        })

        cleanup();
    })

    test("throw error on validation", async () => {
        render(<TagAdminModal isModalVisible={true} setIsModalOpen={() => { }}/>);

        const nameInput = screen.getByRole("textbox", { name: /назва:/i }) as HTMLInputElement;
        const button = screen.getByRole("button", { name: /зберегти/i });

        nameInput.value = "";

        act(() => {
            userEvent.click(button);
        });

        await waitFor(() => {
            expect(message.error).toHaveBeenCalled();
        })

        cleanup();
    })

    test("throw error on same tag title", async () => {
        render(<TagAdminModal isModalVisible={true} setIsModalOpen={() => { }}/>);

        const nameInput = screen.getByRole("textbox", { name: /назва:/i }) as HTMLInputElement;
        const button = screen.getByRole("button", { name: /зберегти/i });

        act(() => {
            userEvent.type(nameInput, "existing tag");
            userEvent.click(button);
        });

        await waitFor(() => {
            expect(message.error).toHaveBeenCalled();
        })

        cleanup();
    })

});
