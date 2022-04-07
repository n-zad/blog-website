const DatabaseHandler = require("./DatabaseHandler");
const UserSchema = require("./UserSchema");
const { v4: uuidv4 } = require('uuid');

const uniqueID = () => {
	return uuidv4();
}

// GET /user/
async function getAllUsers() {
	const db = await DatabaseHandler.getDbConnection();
	const userModel = db.model('User', UserSchema);
	let result = await userModel.find();
	return result;
};

// POST /user/
async function createUser(user) {
	const db = await DatabaseHandler.getDbConnection();
	const userModel = db.model('User', UserSchema);
	
	var token = uniqueID();
	
	const newUser = 
		new userModel(
			{ 
				_id: uniqueID().slice(0,6), 
				firstName: user.firstName, 
				lastName: user.lastName,
				email: user.email, 
				role: user.role,
				photo: "default.jpg", 
				password: user.password,
				password_confirm: user.password_confirm, 
				passwordChangedAt: Date.now(),
				reset_token: token, 
				reset_token_ext: Date.now() + 60 * 60 * 1000, // 60 minutes
				blocked: false,
				interestedIn: user.interestedIn
			}
	);
	
	const result = await newUser.save();
	return result;
}

// GET /user/{id}
async function getUserById(id) {
	const db = await DatabaseHandler.getDbConnection();
	const userModel = db.model('User', UserSchema);
	
	const user = await userModel.findById({'_id': id});
	return user;  
}

// UPDATE /user/{id}
async function updateUserById(id, newUser) {
	const db = await DatabaseHandler.getDbConnection();
	const userModel = db.model('User', UserSchema);

	const user = await userModel.updateOne({'_id': id}, {
		$set: newUser,
	});
  
	return user;
}

// DELETE /user/{id}
async function deleteUserById(id) {
	const db = await DatabaseHandler.getDbConnection();
	const userModel = db.model('User', UserSchema);

	await userModel.deleteOne({ _id: id });
	return 0;
}

// GET /user/{email}
async function getUserByEmail(email) {
	const db = await DatabaseHandler.getDbConnection();
	const userModel = db.model('User', UserSchema);

	const user = await userModel.findOne({"email": email});
	return user;
}

// GET /user/saved/{id}
async function getSavedPosts(userId) {
	const db = await DatabaseHandler.getDbConnection();
	const userModel = db.model('User', UserSchema);

	const user = await userModel.findOne({ _id: userId });
	if(user === null) {
		return 0;
	}

	let savedPosts = user.savedPosts.sort((p1, p2) => {
		return p2.dateSaved - p1.dateSaved;
	});

	return savedPosts;
}

// POST /user/saved/{id}
async function addSavedPost(userId, _postId) {
	const db = await DatabaseHandler.getDbConnection();
	const userModel = db.model('User', UserSchema);

	const user = await userModel.findOne({ _id: userId });
	if(user === null) {
		return 0;
	}

	let duplicate = user.savedPosts.find( ({ postId }) => postId === _postId );
	if(duplicate !== undefined && duplicate !== null) {
		return null;
	}

	const result = await userModel.updateOne({_id: userId}, {
		$push: {savedPosts: { postId: _postId} }
	});
	
	return result;
}

// DELETE /user/saved/{id}
async function deleteSavedPost(userId, postId) {
	const db = await DatabaseHandler.getDbConnection();
	const userModel = db.model('User', UserSchema);

	const result = await userModel.updateOne({_id: userId}, {
		$pull: {savedPosts: { postId: postId} }
	});
	
	return result;
}

module.exports = {
	getAllUsers,
	createUser,
	getUserById,
	updateUserById,
	deleteUserById,
	getUserByEmail,
	getSavedPosts,
	addSavedPost,
	deleteSavedPost
}
