// src/hooks/useIsMobile.ts
import {Grid} from 'antd';

const {useBreakpoint} = Grid;

export const useIsMobile = () => {
    const screens = useBreakpoint();
    // Return true for screens smaller than 'md' (i.e., xs and sm)
    // This aligns with CSS media queries using max-width: 768px
    return !screens.md;
};
