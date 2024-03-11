import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import Newss from "./News.component";
import { MemoryRouter } from "react-router-dom";

jest.mock("@stores/root-store", () => ({
  __esModule: true,
  default: () => ({
    newsStore: {
      fetchNewsAllSortedByCreationDate: jest.fn().mockResolvedValue([]),
      NewsMap: new Map(),
      getNewsArray: [],
      deleteNews: jest.fn(),
      setInternalMap: jest.fn(),
    },
  }),
  useModalContext: jest.fn(() => ({
    modalStore: {
      setConfirmationModal: jest.fn(),
    },
  })),
}));

jest.mock("antd/es/table", () => ({ columns, dataSource }: any) => {
  const mockNewsData = [
    {
      id: "1",
      title: "Mock News 1",
      image: {
        base64: "mockBase64String",
        mimeType: "image/png",
        alt: "Mock News 1 Image",
      },
      creationDate: "2022-01-01",
      action: "Mock Action",
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
        {mockNewsData.map((news: any) => (
          <tr key={news.id}>
            {columns.map((column: any) => (
              <td key={`${news.id}-${column.key}`}>
                {column.render
                  ? column.render(news[column.dataIndex], news, 0)
                  : news[column.dataIndex]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
});

describe("News", () => {
  test("it should render component and its elements", () => {
    render(
      <MemoryRouter>
        <Newss />
      </MemoryRouter>
    );

    const columnHeaders = screen.getAllByRole("columnheader");
    const createNewsButton = screen.getByText("Створити новину");

    const titleCell = screen.getByText("Mock News 1").closest("td");
    const imageCell = screen.getByRole("img", { name: /Mock News 1 Image/i }).closest("td");
    const creationDateCell = screen.getByText("2022-01-01").closest("td");

    expect(createNewsButton).toBeInTheDocument();
    expect(columnHeaders).toHaveLength(4);

    expect(titleCell).toBeInTheDocument();
    expect(imageCell).toBeInTheDocument();
    expect(creationDateCell).toBeInTheDocument();
  });
});
