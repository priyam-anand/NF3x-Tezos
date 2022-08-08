
import { makeStyles } from '@mui/styles';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';

const useStyles = makeStyles({
    root: {
        background: "#FCFCFD",
        border: "1px solid #E4E4E4",
        transform: "rotate(90deg)",
        display: "inline-block",
        borderRadius: "20px",
        padding:"3px 3px 0px 3px",
        position :"absolute",
        left: "calc(50% - 9px)",
        top: "-13px",
        "& svg":{
            width: "18px",
            height: "18px"
        }
    }
});

export const DoubleArrowIcon = () => {
    const classes = useStyles();
    return (
        <span className={classes.root}>
            <CompareArrowsIcon/>
        </span>
    );
}