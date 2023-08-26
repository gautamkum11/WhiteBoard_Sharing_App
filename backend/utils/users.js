const users = [];


//Adding user
const adduser = ({name,roomID,userID,host,presenter,socketID}) => {
    const user = {name,roomID,userID,host,presenter,socketID};
    users.push(user);
    return users.filter((user) => user.roomID === roomID);
};

//Removing user
const removeuser = (id) => {
    const index = users.findIndex(user => user.socketID === id)
    if(index != -1)
    {
        return users.splice(index,1)[0];
    }
};

//Get a user from the list
const getuser = (id) => {
    return users.find((user) => user.socketID === id);
}

//get all users from the list
const getusersinroom = (roomID) => {
    return users.filter((user) => user.roomID === roomID);
};

module.exports = {
    adduser,
    removeuser,
    getuser,
    getusersinroom
};