import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import TagsSliderModal from './TagsSliderModal.component';
import useMobx from '@stores/root-store';
import '@testing-library/jest-dom';


jest.mock('@stores/root-store', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('@features/SlickSlider/SlickSlider.component', () => {
  return jest.fn((props: any) => {
    return <div data-testid="mock-slider" {...props}></div>;
  });
});

describe('TagsSliderModal', () => {
  let mockStore: any;

  beforeEach(() => {
    mockStore = {
      tagsStore: {
        fetchTagByStreetcodeId: jest.fn(),
        fetchAllTags: jest.fn(),
        getTagArray: [
          { id: 1, title: 'Tag 1' },
          { id: 2, title: 'Tag 2' },
        ],
        getAllTagsArray: [
          { id: 1, title: 'Tag 1' },
          { id: 2, title: 'Tag 2' },
          { id: 3, title: 'Tag 3' },
        ],
      },
    };
    (useMobx as jest.Mock).mockReturnValue(mockStore);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders component with setted tags', async () => {
    render(
      <TagsSliderModal 
        streetCodeid={1} 
        activeTagId={1} 
        setActiveTagId={jest.fn()} 
        showAllTags={false} 
      />
    );

    expect(screen.getByText('Tag 1')).toBeInTheDocument();
    expect(screen.getByText('Tag 2')).toBeInTheDocument();
  });

  it('calls fetchTagByStreetcodeId and fetchAllTags', async () => {
    render(
      <TagsSliderModal 
        streetCodeid={123} 
        activeTagId={1} 
        setActiveTagId={jest.fn()} 
        showAllTags={true} 
      />
    );

    await waitFor(() => {
      expect(mockStore.tagsStore.fetchTagByStreetcodeId).toHaveBeenCalledWith(123);
      expect(mockStore.tagsStore.fetchAllTags).toHaveBeenCalled();
    });
  });

  it('changes activeTagId when click on tag', async () => {
    const setActiveTagIdMock = jest.fn();

    render(
      <TagsSliderModal 
        streetCodeid={1} 
        activeTagId={1} 
        setActiveTagId={setActiveTagIdMock} 
        showAllTags={false} 
      />
    );

    const tagButton = screen.getByText('Tag 2');

    fireEvent.click(tagButton);

    expect(setActiveTagIdMock).toHaveBeenCalledWith(2);
  });

  it('should pass correct initialSlide to SlickSlider', async () => {
    const mockSlider = require('@features/SlickSlider/SlickSlider.component');
    const mockSetActiveTagId = jest.fn();

    await act(async () => {
      render(
        <TagsSliderModal
          streetCodeid={1}
          activeTagId={2} 
          setActiveTagId={mockSetActiveTagId}
          showAllTags={true}
        />
      );
    });

    expect(mockSlider).toHaveBeenCalled();

    await waitFor(() => {
      const sliderProps = mockSlider.mock.calls[mockSlider.mock.calls.length - 1]?.[0];
      expect(sliderProps.initialSlide).toBe(1); // activeTagId = 2 and its index = 1
    });
  });
});
