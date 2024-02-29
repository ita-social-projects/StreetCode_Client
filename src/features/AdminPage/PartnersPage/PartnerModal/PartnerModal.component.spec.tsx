import React, { ReactNode } from "react";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PartnerModal from "./PartnerModal.component";

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
        // Mock the state with some example streetcodes
        { id: "1", title: "Streetcode 1" },
        { id: "2", title: "Streetcode 2" },
      ],
    },
  }),
}));

jest.mock("antd/es/upload", () => {
  const antd = jest.requireActual("antd")
  const { Upload } = antd;
  return {__esModule: true, ...antd, Upload: {...Upload}}

})

describe("PartnerModal", () => {
  test("it should render component", () => {
    const container = render(
      <PartnerModal open={false} setIsModalOpen={() => {}} />
    );

    const input = container.getAllByTestId("input-show-count");
    console.log(container);
  });
});
