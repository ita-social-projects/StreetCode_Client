import React, { Component, createRef } from 'react';
import Freezeframe, { Freeze, FreezeframeOptions } from 'freezeframe';

type Key = string | number;

export type Props = {
  key?: Key | null | undefined;
  src?: string;
  options?: FreezeframeOptions;
  onStart?: (items: Freeze[], isPlaying: boolean) => void;
  onStop?: (items: Freeze[], isPlaying: boolean) => void;
  onToggle?: (items: Freeze[], isPlaying: boolean) => void;
} & React.ImgHTMLAttributes<HTMLElement>;

export type State = {
  isPlaying: boolean;
};

class ReactFreezeframe extends Component<Props, State> {
    $freezeframe?: Freezeframe;

    private freeze = createRef<HTMLDivElement & HTMLImageElement>();

    constructor(props: Props) {
        super(props);
        this.state = {
            isPlaying: false,
        };
    }

    componentDidMount() {
        if (!this.freeze.current) {
            throw new Error('You must provide a valid ref');
        }
        this.$freezeframe = new Freezeframe(this.freeze.current, this.props.options);
        this.$freezeframe.on('toggle', (items: Freeze[], isPlaying: boolean) => {
            const { onStart, onStop, onToggle } = this.props;
            if (isPlaying) {
                if (onStart) {
                    onStart(items, isPlaying);
                }
            } else if (onStop) {
                onStop(items, isPlaying);
            }
            if (onToggle) {
                onToggle(items, isPlaying);
            }
        });
    }

    componentWillUnmount() {
        if (this.$freezeframe) {
            this.$freezeframe.destroy();
        }
    }

    start(): void {
        this.$freezeframe?.start();
        this.setState({
            isPlaying: true,
        });
    }

    stop(): void {
        this.$freezeframe?.stop();
        this.setState({
            isPlaying: false,
        });
    }

    toggle(): void {
        if (this.state.isPlaying) {
            this.stop();
        } else {
            this.start();
        }
    }

    render() {
        const { children, alt, src, ...otherProps } = this.props;
        return (
            <div className="react-freezeframe">
                {children ? (
                    <div ref={this.freeze}>{children}</div>
                ) : (
                    <img ref={this.freeze} alt={alt} src={src} {...otherProps} />
                )}
            </div>
        );
    }
}

export default ReactFreezeframe;
