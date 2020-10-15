// Import mongoose models
import Favor from '../models/favor.model';
import User from '../models/user.model';
import Proof from '../models/proof.model';

let cycleList;
let rewardList;
let favorList;
let hasCycle;

export default {
    createFavor: async (description, owedBy, owedTo) => {
        // const legit = jwt.verify(token, process.env.JWT_SECRET);
        // console.log(`JWT verification result: ${JSON.stringify(legit)}`);
        
        const owedByUser = await User.findOne({ username: owedBy });
        const owedToUser = await User.findOne({ username: owedTo });
        const owedByUserId = owedByUser._id.toString();
        const owedToUserId = owedToUser._id.toString();
        // construct new favor
        const newFavor = new Favor({
            description: description,
            owedBy: owedByUserId,
            owedTo: owedToUserId
        });
        // save favor to collection
        await newFavor.save();
        return newFavor;
    },
    getOwedByUserFavors: async (userId, limit, skip) => {
        const favorsOwedByMe = await Favor.find({ owedBy: userId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('owedTo', 'username');
        
        for (const favor of favorsOwedByMe) {
            const eachSubmit = await Proof.find({ favorId: favor._id, favorFileType: 'submit' });
            if (eachSubmit.length > 0) {
                favor.submitImage = eachSubmit[0].fileLink;
                favor.submitImageType = eachSubmit[0].favorFileType;
            }
            const eachRepaid = await Proof.find({ favorId: favor._id, favorFileType: 'repaid' });
            if (eachRepaid.length > 0) {
                favor.repaidImage = eachRepaid[0].fileLink;
                favor.repaidImageType = eachRepaid[0].favorFileType;
            }
        };
        
        return favorsOwedByMe;
    },
    getOwedToUserFavors: async (userId, limit, skip) => {
        const favorsOwedToMe = await Favor.find({ owedTo: userId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('owedBy', 'username');

        for (const favor of favorsOwedToMe) {
            const eachSubmit = await Proof.find({ favorId: favor._id, favorFileType: 'submit' });
            if (eachSubmit.length > 0) {
                favor.submitImage = eachSubmit[0].fileLink;
                favor.submitImageType = eachSubmit[0].favorFileType;
            }
            const eachRepaid = await Proof.find({ favorId: favor._id, favorFileType: 'repaid' });
            if (eachRepaid.length > 0) {
                favor.repaidImage = eachRepaid[0].fileLink;
                favor.repaidImageType = eachRepaid[0].favorFileType;
            }
        };

        return favorsOwedToMe;
    },
    getOwedByUserFavorsCount: async (userId) => {
        const favorsOwedByMeCount = await Favor.countDocuments({
            owedBy: {$eq: userId}
        });
        return favorsOwedByMeCount;
    },
    getOwedToUserFavorsCount: async (userId) => {
        const favorsOwedToMeCount = await Favor.countDocuments({
            owedTo: {$eq: userId}
        });
        return favorsOwedToMeCount;
    },
    getFavor: async (favorId) => {
        const favor = await Favor.findById(favorId);
        return favor;
    },
    deleteFavor: async (favorId) => {
        await Favor.findByIdAndDelete(favorId);
    },
    findCycle: async (userId) => {
        cycleList = [];
        hasCycle = false;

        favorList = await Favor.find({repaid: false}).populate('owedBy', 'username').populate('owedTo', 'username');
        //console.log(favorList);
        //console.log("Total: "+favorList.length);
        let root_node = "";
        for (let i = 0; i<favorList.length; i++){
            if (favorList[i].owedBy._id.toString() == userId){
                root_node = favorList[i].owedBy.username.toString();
                break;
            }
        }

        if (root_node != ""){
            cycleList.push(root_node);
            DFS(root_node); //Root_user
            // console.log('cycleList--------------------------')
            // console.log(cycleList);
        }

        return cycleList;
    },
    findRewardCycle: () => {
        rewardList = [];
        //console.log(favorList);

        //find reward in favor between user and next_user in cycle list
        for (let i = 0; i<cycleList.length-1; i++){
            findReward(cycleList[i],cycleList[i+1]);
        }

        //find reward in favor between last_user and first_user in cycle list
        findReward(cycleList[cycleList.length-1], cycleList[0]);
        
        // console.log('reward List--------------------------')
        // console.log(rewardList);

        return rewardList;
    }
}

const findReward = (owedByUsername, owedToUsername)=>{

    for (let i = 0; i<favorList.length; i++){
        if ((favorList[i].owedBy.username.toString() == owedByUsername) && (favorList[i].owedTo.username.toString() == owedToUsername)){
            addReward(favorList[i].description.toString());
        }
    }
}

const addReward = (reward) =>{
    for (let i = 0; i<rewardList; i++){
        if (rewardList[i] == reward){
            return;     //reward is already in the reward List
        }
    }

    //add new reward
    rewardList.push(reward);
    return;
}

const find = (Username) =>{
    let nextUsers = [];

    for (let i = 0; i < favorList.length; i++){
        if (favorList[i].owedBy.username.toString() == Username){
            nextUsers.push(favorList[i].owedTo.username.toString());
        }
    }

    return nextUsers;
}

const DFS = (Username) => {

    //console.log(cycleList);
    try {
        const nextUsers = find(Username);
        //console.log(nextUsers);
        
        if (nextUsers.length > 0){
            for (let i = 0; i< nextUsers.length; i++){

                //console.log(cycleList);

                //check cycle
                let UserNotFound = true;
                if(cycleList.length > 1){
                    for (let j = 0; j < cycleList.length; j++) {
                        if (cycleList[j] == nextUsers[i]) {
                            UserNotFound = false;
                            if (j == 0){
                                hasCycle = true;
                            }
                            break;
                        }
                    }
                }
                
                if (UserNotFound){
                    cycleList.push(nextUsers[i]);
                    DFS(nextUsers[i]);
                    if (hasCycle)
                        return;
                    cycleList.pop();
                }
            }       
        }
    } catch (err){
        console.log(err);
    }
    
}
