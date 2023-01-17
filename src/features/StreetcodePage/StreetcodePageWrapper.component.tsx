import { type } from "os";
import { useRef, cloneElement, useEffect} from "react";

export type Block = {
    id: string,
    height: number,
}

interface Prop{
    children: JSX.Element[],
    setBlocks: (blocks: Block[]) => void,
}

const StreetcodePageWrapper = (props: Prop) => {
    const childRefs = useRef<any>([]);

    useEffect(() => {
        const blockIds: string[] = childRefs.current.map((ref: any) => ref.current.getAttribute("id"));
        const blockCoords: number[] = childRefs.current.map((ref: any) => ref.current.getBoundingClientRect().top);
        const blocks: Block[] = blockIds.map((id, idx) => ({ id, height: blockCoords[idx] } as Block));
        props.setBlocks(blocks);
    }, [childRefs]);
  
    return (
      <div>
        {props.children.map((child, index) => {
            const ref = useRef(child);
            childRefs.current[index] = ref;
            return cloneElement(child, { ref });
        })}
      </div>
    );
}

export default StreetcodePageWrapper;