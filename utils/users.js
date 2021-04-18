

function removeUserById(userObject, arrayOfuserObjects)
{
    arrayOfuserObjects.slice(arrayOfuserObjects.findIndex(userObject => userObject.userID === userObject.userID), 1);
}





module.exports = {
    removeUserById
};