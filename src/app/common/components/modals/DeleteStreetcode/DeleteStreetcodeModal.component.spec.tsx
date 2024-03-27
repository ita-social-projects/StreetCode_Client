import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { mockSetModal } from "../../../../../../__mocks__/@stores/root-store";
import { DELETE_STREETCODE } from "../../../constants/modal.constants";
import DeleteStreetcodeModalComponent from "./DeleteStreetcodeModal.component";

const mockSetState = jest.fn();

describe("DeleteStreetcodeModalComponent", () => {
  beforeEach(() => {
    const mockUseState: any = (initValue: any) => [initValue, mockSetState];
    jest.spyOn(React, "useState").mockImplementation(mockUseState);
  });

  it("should render itself and its elements", () => {
    render(<DeleteStreetcodeModalComponent />);
    expect(screen.getByText("Delete streetcode")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("OK")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  it("should call setModal from useModalContext when clicking OK button", () => {
    render(<DeleteStreetcodeModalComponent />);
    fireEvent.click(screen.getByText("OK"));
    expect(mockSetModal).toHaveBeenCalledWith(DELETE_STREETCODE);
  });

  it("should call setModal from useModalContext when clicking Cancel button", () => {
    render(<DeleteStreetcodeModalComponent />);
    fireEvent.click(screen.getByText("Cancel"));
    expect(mockSetState).toHaveBeenCalledWith(false);
  });
});
