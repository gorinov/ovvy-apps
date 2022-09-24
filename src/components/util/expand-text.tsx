import * as React from "react";
import Link from "@mui/material/Link/Link";
import Popover from "@mui/material/Popover/Popover";
import Paper from "@mui/material/Paper/Paper";
import Box from "@mui/material/Box/Box";
import Typography from "@mui/material/Typography/Typography";

function isOverflown(element) {
    return (
        element.scrollHeight > element.clientHeight ||
        element.scrollWidth > element.clientWidth
    );
}

interface CellExpandProps {
    value: string;
    width: number;
}

export const ExpandText = (props: CellExpandProps) => {
    const { value, width } = props;

    const wrapper = React.useRef<HTMLDivElement | null>(null);
    const cellValueRef = React.useRef(null);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const [
        isCurrentlyOverflown,
        setCurrentlyOverflown
    ] = React.useState<null | Boolean>(null);

    React.useEffect(() => {
        setCurrentlyOverflown(isOverflown(cellValueRef.current!));
    }, [isCurrentlyOverflown, value]);

    const handleClick = (event: any) => {
        setAnchorEl(event.currentTarget);
        return;
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    const open = Boolean(anchorEl);

    return (
        <div ref={wrapper} className="ov-expand">
            <div ref={cellValueRef} className="ov-expand__text">
                {value}
            </div>
            {isCurrentlyOverflown && (
                <>
                    <Link component="button" onClick={handleClick}>
                        Показать
                    </Link>
                    <Popover
                        open={open}
                        anchorEl={anchorEl}
                        onClose={handleClose}
                        anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "center"
                        }}
                        transformOrigin={{
                            vertical: "top",
                            horizontal: "center"
                        }}
                    >
                        <Paper elevation={1}>
                            <Box width={width} p={2}>
                                <Typography variant="body2">{value}</Typography>
                            </Box>
                        </Paper>
                    </Popover>
                </>
            )}
        </div>
    );
};