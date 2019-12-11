import mongoose from 'mongoose';

const Schema = mongoose.Schema;

let Issues = new Schema({
    issueId : {
        type: String
    },
    type : {
        type : String
    },
    description : {
        type : String
    },
    assigned : {
        type : String
    },
    assignedTo : {
        type : String
    },
    severity : {
        type : String
    },
    status : {
        type : String,
        default : 'open'
    }
});

export default mongoose.model('IssueDB', Issues);