import {Paper, Box, Divider} from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
    box: {
        width: "100px",
        backgroundColor: props => props.job.hex,
        height: '100px',
        margin: "0 auto",
        borderRadius: "50%"
    },
    paper: {
        minHeight: "200px",
        padding: "0.5rem",
        '& h5' : {
            margin: "0.3px 0"
        }
    }
})

export default function JobApproved(props) {
    const {title, attribute, url, owner} = props.job
    const classes = useStyles(props)
    return (
        <>
        <Paper className={classes.paper}>
            <Box className={classes.box}></Box>
            <Box sx={{display:"flex", justifyContent:"center"}}>
                <h5>{attribute}</h5>
            </Box>
            <Divider />
            <Box sx={{marginTop: "10px"}}>
                <h5>Job Title: {title}</h5>
                <h5>Url: {url}</h5>
                <h5>Owned by: {owner}</h5>
            </Box>
        </Paper>
        </>
    )
}