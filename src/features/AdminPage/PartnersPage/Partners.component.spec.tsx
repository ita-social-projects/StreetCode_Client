import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Partners from "@features/AdminPage/PartnersPage/Partners.component";
import { MemoryRouter } from "react-router-dom"; // Import MemoryRouter
import "@testing-library/jest-dom";


const mockImageStore = {
  getImageById: jest.fn(() => Promise.resolve({})),
};

jest.mock("@stores/root-store", () => ({
  __esModule: true, // This is required for mocking default exports
  default: () => ({
    partnersStore: {
      fetchPartnersAll: jest.fn().mockResolvedValue([]),
      PartnerMap: new Map(),
      getPartnerArray: jest.fn(),
      setInternalMap: jest.fn(),
    },
    imageStore: mockImageStore,
    streetcodeShortStore: {
      fetchStreetcodesAll: jest.fn().mockResolvedValue([]), // Mock the fetch function
      streetcodes: [
        { id: "1", title: "Streetcode 1" },
        { id: "2", title: "Streetcode 2" },
      ],
    },
  }),
  useModalContext: jest.fn(() => ({
    modalStore: {
      setConfirmationModal: jest.fn(),
    },
  })),
}));

// Mock antd components as needed
jest.mock("antd/es/table", () => ({ dataSource, columns }: any) => {
  const mockPartnersData = [
    {
      id: "1",
      title: "Mock Partner 1",
      targetUrl: {
        href: "https://mockpartner1.com",
        title: "Mock Partner 1 Website",
      },
      partnerSourceLinks: [],
      logo: { base64: "mockBase64String", mimeType: "image/png" },
    },
  ];
  return (
    <table>
      <thead>
        <tr>
          {columns.map((column: any) => (
            <th key={column.key}>{column.title}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {mockPartnersData.map((partner : any) => (
          <tr key={partner.id}>
            {columns.map((column : any) => (
              <td key={`${partner.id}-${column.key}`}>
                {column.dataIndex === "targetUrl" ? (
                  <a
                    href={partner[column.dataIndex].href}
                    title={partner[column.dataIndex].title}
                  >
                    {partner[column.dataIndex].title}
                  </a>
                ) : column.dataIndex === "logo" ? (
                  partner[column.dataIndex].base64 ? (
                    <img
                      src={`data:${partner[column.dataIndex].mimeType};base64,${
                        partner[column.dataIndex].base64
                      }`}
                      alt="Logo"
                    />
                  ) : (
                    "No Logo"
                  )
                ) : (
                  partner[column.dataIndex]
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
});

jest.mock("antd/es/upload", () => () => <div>Upload</div>);

describe("Partners Component", () => {
  test("should render without crashing", async () => {
    render(
      <MemoryRouter>
        <Partners />
      </MemoryRouter>
    );
    const button = screen.getByRole('button', {
      name: /створити партнера/i
    })

    await waitFor(() => {
      expect(screen.getByText("Mock Partner 1")).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /mock partner 1 website/i })).toBeInTheDocument()
      expect(screen.getByRole('img', { name: /logo/i })).toBeInTheDocument()
      expect(screen.getByRole('link', { name: /стріткоди/i })).toBeInTheDocument()
    });

  });
});
