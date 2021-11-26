
import {Paper, Button} from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
    paper: {
        height: "350px",
        padding: "0.2rem 0.4rem"
    }
})

export default function JobPost(props) {
    const classes = useStyles();
    const {reward, assignmentHolder, title, deadline, description, category} = props.job
    return (
        <Paper className={classes.paper} elevation={3}>
            <h4>{title}</h4>
            <h4>Job Category: {category}</h4>
            <h5>Description:</h5>
            <p>{description}</p>
            <h5>Expected Salary: {reward} ETH</h5>
            <h5>Job deadline: {deadline}</h5>
            <Button variant="contained" color="success">Submit Job</Button>
        </Paper>
    )
}