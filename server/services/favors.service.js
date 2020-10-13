// Import mongoose models
import Favor from '../models/favor.model';
import User from '../models/user.model';
import Proof from '../models/proof.model';

let cycleList;
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
            const each = await Proof.find({ favorId: favor._id });
            if (each.length > 0) favor.image = each[0].fileLink;
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
            const each = await Proof.find({ favorId: favor._id });
            if (each.length > 0) favor.image = each[0].fileLink;
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
        const root = await Favor.findOne({ owedBy: userId, repaid: false }).populate('owedBy', 'username');
        if (root != null){
            await DFS(root.owedBy);
            console.log('here')
            console.log(cycleList);
        }
        return cycleList;
    }
}

const DFS = async (User) => {
    let notFoundUser = true;
    for (let i = 0; i < cycleList.length; i++) {
        console.log(cycleList);
        if (cycleList[i]._id.toString() == User._id.toString()) {
            notFoundUser = false;
            if (i == 0){
                hasCycle = true;
            }
            break;
        }
    }
    if (notFoundUser) {
        cycleList.push(User);
        //console.log(cycleList);
        try {
            const nextUser = await Favor.find({ owedBy: User._id, repaid: false }).populate('owedTo', 'username');
            console.log(nextUser);
    
            nextUser.forEach(function(item, index) {
                //console.log("ID: ", item.owedTo);
                DFS(item.owedTo)
                if (hasCycle)
                return;
            });
        } catch (err){
            console.log(err);
        }
    }
}