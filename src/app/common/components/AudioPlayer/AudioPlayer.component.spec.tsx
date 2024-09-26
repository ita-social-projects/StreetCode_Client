import { act } from 'react-dom/test-utils';
import {
    fireEvent,
    render,
    screen,
} from '@testing-library/react';
import user from '@testing-library/user-event';

import '@testing-library/jest-dom';

import { AudioPlayer } from './AudioPlayer.component';

Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: unknown) => ({
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

jest.mock('@images/audio-player/PauseBtn.webp', () => 'test-file-stub');
jest.mock('@images/audio-player/PlayBtn.webp', () => 'test-file-stub');

global.HTMLMediaElement.prototype.play = jest.fn();
global.HTMLMediaElement.prototype.pause = jest.fn();
global.HTMLMediaElement.prototype.addEventListener = jest.fn((event, callback) => {
    if (event === 'ended') {
        setTimeout(() => {
            if (typeof callback === 'function') {
                callback(new Event('ended'));
            }
        }, 0);
    }
});

describe('AudioPlayer test', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be rendered', async () => {
        const { container } = await render(<AudioPlayer />);

        const audio = container.getElementsByTagName('audio');
        expect(audio).toHaveLength(1);

        const audioSlider = screen.getByRole('slider');
        expect(audioSlider).toBeInTheDocument();

        const buttonPlayPause = container.getElementsByClassName('buttonContainer');
        expect(buttonPlayPause).toHaveLength(1);

        const icon = buttonPlayPause[0].getElementsByTagName('img');
        expect(icon).toHaveLength(1);
    });

    it('should immediately play', async () => {
        const { container } = await render(<AudioPlayer immediatelyPlay />);

        const audio = container.getElementsByTagName('audio')[0];
        const icon = container.getElementsByTagName('img')[0];

        expect(audio.play).toHaveBeenCalled();
        expect(icon.alt).toBe('Пауза');
    });

    it('should not immediately play', async () => {
        const { container } = await render(<AudioPlayer />);

        const audio = container.getElementsByTagName('audio')[0];
        const icon = container.getElementsByTagName('img')[0];

        expect(audio.play).not.toHaveBeenCalled();
        expect(icon.alt).toBe('Програти');
    });

    it('should play/pause audio and toggle button icon', async () => {
        const { container } = await render(<AudioPlayer />);

        const audio = container.getElementsByTagName('audio')[0];
        const buttonPlayPause = container.getElementsByClassName('buttonContainer')[0];
        const icon = buttonPlayPause.getElementsByTagName('img')[0];

        act(() => {
            user.click(icon);
        });

        expect(audio.play).toHaveBeenCalled();
        expect(icon.alt).toBe('Пауза');

        act(() => {
            user.click(icon);
        });

        expect(audio.pause).toHaveBeenCalled();
        expect(icon.alt).toBe('Програти');
    });

    it('should change slider and audio position', async () => {
        const { container } = await render(<AudioPlayer />);

        const audio = container.getElementsByTagName('audio')[0];
        const audioSlider = screen.getByRole('slider') as HTMLInputElement;

        expect(audio.currentTime).toBe(0);
        expect(audioSlider.value).toBe('0');

        act(() => {
            fireEvent.change(audioSlider, { target: { value: '50' } });
        });

        expect(audio.currentTime).toBe(50);
        expect(audioSlider.value).toBe('50');
    });
});
