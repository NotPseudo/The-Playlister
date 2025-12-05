const auth = require('../auth')
//const User = require('../models/user-model')
const bcrypt = require('bcryptjs')

const { DB } = require('../db/DatabaseManager')

getLoggedIn = async (req, res) => {
    try {
        let userId = auth.verifyUser(req);
        if (!userId) {
            return res.status(400).json({
                loggedIn: false,
                user: null,
                success: false, error: "Could not find user"
            })
        }

        //const loggedInUser = await User.findOne({ _id: userId });
        const loggedInUser = await DB.findUser({ _id: userId })
        if (!loggedInUser) {
            return res.status(400).json({
                loggedIn: false,
                user: null,
                success: false, error: "Could not find user"
            })
        }
        console.log("loggedInUser: " + loggedInUser);

        return res.status(200).json({
            loggedIn: true,
            user: {
                firstName: loggedInUser.firstName,
                lastName: loggedInUser.lastName,
                email: loggedInUser.email
            }
        })
    } catch (err) {
        console.log("err: " + err);
        return res.status(500).json({ success: false, error: err });
    }
}

loginUser = async (req, res) => {
    console.log("loginUser");
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res
                .status(400)
                .json({ success: false, error: "Please enter all required fields." });
        }

        //const existingUser = await User.findOne({ email: email });
        const existingUser = await DB.findUser({ email: email });
        console.log("existingUser: " + JSON.stringify(existingUser));
        if (!existingUser) {
            return res
                .status(401)
                .json({
                    success: false, error: "Wrong email or password provided."
                })
        }

        console.log("provided password: " + password);
        const passwordCorrect = await bcrypt.compare(password, existingUser.passwordHash);
        if (!passwordCorrect) {
            console.log("Incorrect password");
            return res
                .status(401)
                .json({
                    success: false, error: "Wrong email or password provided."
                })
        }

        // LOGIN THE USER
        const token = auth.signToken(existingUser._id);
        console.log(token);

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: true
        }).status(200).json({
            success: true,
            user: {
                firstName: existingUser.firstName,
                lastName: existingUser.lastName,  
                email: existingUser.email              
            }
        })

    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, error: err });
    }
}

logoutUser = async (req, res) => {
    res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0),
        secure: true,
        sameSite: "none"
    }).status(200).json({success: true});
}

registerUser = async (req, res) => {
    console.log("REGISTERING USER IN BACKEND");
    try {
        const { username, email, avatar, password, passwordVerify } = req.body;
        console.log("create user: " + username + " " + email + " " + password + " " + passwordVerify + " " + avatar);
        if (!username || !email || !password || !passwordVerify || !avatar) {
            return res
                .status(400)
                .json({ success: false, error: "Please enter all required fields." });
        }
        console.log("all fields provided");
        if (password.length < 8) {
            return res
                .status(400)
                .json({
                    success: false, error: "Please enter a password of at least 8 characters."
                });
        }
        console.log("password long enough");
        if (password !== passwordVerify) {
            return res
                .status(400)
                .json({
                    success: false, error: "Please enter the same password twice."
                })
        }
        console.log("password and password verify match");
        //const existingUser = await User.findOne({ email: email });
        const existingUser = await DB.findUser({ email: email });
        console.log("existingUser: " + existingUser);
        if (existingUser) {
            return res
                .status(400)
                .json({
                    success: false, error: "An account with this email address already exists."
                })
        }

        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const passwordHash = await bcrypt.hash(password, salt);
        console.log("passwordHash: " + passwordHash);

        //const newUser = new User({firstName, lastName, email, passwordHash});
        //const savedUser = await newUser.save();
        const savedUser = await DB.createUser(username, email, avatar, passwordHash, []);
        if (!savedUser) {
            return res
                .status(500)
                .json({
                    success: false, error: "Unable to register."
                })
        }
        console.log("savedUser: " + JSON.stringify(savedUser));
        let savedToken = savedUser._id;
        console.log("new user saved: " + savedToken);

        // LOGIN THE USER
        const token = auth.signToken(savedToken);
        console.log("token:" + token);

        await res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        }).status(200).json({
            success: true,
            user: {
                username: savedUser.username,
                email: savedUser.email,
                avatar: savedUser.avatar              
            }
        })
        console.log("token sent");
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, error: err });
    }
}

editAccount = async (req, res) => {
    let userId = auth.verifyUser(req);
    if (!userId) {
        return res.status(500).json({
            success: false, error: "Could not find user"
        })
    }
    try {
        const { username, avatar, password, passwordVerify } = req.body;
        console.log("Edit user: " + username + " " + password + " " + passwordVerify + " " + avatar);
        if (password) {
            if (password.length < 8) {
            return res
                .status(400)
                .json({
                    success: false, error: "Please enter a password of at least 8 characters."
                });
            }
            console.log("password long enough");
            if (password !== passwordVerify) {
                return res
                    .status(400)
                    .json({
                        success: false, error: "Please enter the same password twice."
                    })
            }
        } 
        console.log("password and password verify match");

        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const passwordHash = await bcrypt.hash(password, salt);
        console.log("passwordHash: " + passwordHash);
        let updatedUser = await DB.updateUser(userId, username, avatar, passwordHash);
        if (!updatedUser) {
            return res
                .status(500)
                .json({
                    success: false, error: "Unable to edit account details"
                })
        }
        console.log("updatedUser: " + JSON.stringify(updatedUser));
        let savedToken = updatedUser._id;
        console.log("new user saved: " + savedToken);

        // LOGIN THE USER
        const token = auth.signToken(savedToken);
        console.log("token:" + token);

        await res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        }).status(200).json({
            success: true,
            user: {
                username: updatedUser.username,
                email: updatedUser.email,
                avatar: updatedUser.avatar              
            }
        })
        console.log("token sent");
    } catch (err) {
        console.error(err);
        
}
}

module.exports = {
    getLoggedIn,
    registerUser,
    loginUser,
    logoutUser,
    editAccount
}